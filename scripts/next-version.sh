#!/usr/bin/env bash
# Prints the tag the next release should carry, or nothing at all when there
# should not be one.
#
# Lives here rather than inside the workflow so it can be run against the real
# history on a laptop - a version scheme you can only exercise by pushing to main
# is a version scheme nobody checks.
#
#   scripts/next-version.sh            # decide for HEAD
#   scripts/next-version.sh --explain  # and say why, on stderr
#
# Exit 0 with empty output means "no release": either HEAD is already tagged (a
# re-run) or the work being landed carries [skip release].
set -euo pipefail

explain=false
[ "${1:-}" = "--explain" ] && explain=true
say() { $explain && printf '%s\n' "$1" >&2 || true; }

# Where a manual marker is allowed to live: a commit SUBJECT. Never a body - a
# changelog or a doc about this very file mentions the markers, and that must not
# publish a major version.
#
# It cannot be HEAD's subject alone, which is what this script did until v1.0.1 was
# published from a commit whose subject said [skip release]. Merging a pull request on
# GitHub writes its own subject ("Merge pull request #2 from ..."), so with a PR-based
# flow HEAD's subject is boilerplate and no marker is ever reachable. When HEAD is a
# merge, the commits it brought in are the ones that asked for something.
if git rev-parse -q --verify HEAD^2 >/dev/null 2>&1; then
  marker_subjects=$(git log --no-merges --pretty=%s 'HEAD^1..HEAD^2')
else
  marker_subjects=$(git log -1 --pretty=%s)
fi

# git log is newest first, so the newest marker in what is being landed wins - the
# same "the head of this work decides" rule, now anchored to the work and not to
# whatever GitHub wrote on top of it.
# `|| true` is load-bearing: with `set -o pipefail`, grep finding nothing fails the
# whole pipeline and takes the script down with it - which is the normal case, since
# most pushes carry no marker at all.
marker=$(printf '%s\n' "$marker_subjects" |
  grep -oiE '\[(skip release|release major|release minor)\]' | head -1 |
  tr '[:upper:]' '[:lower:]' || true)

if [ "$marker" = "[skip release]" ]; then
  say "skipped: a subject in this push carries [skip release]"
  exit 0
fi

if [ -n "$(git tag --points-at HEAD -l 'v*')" ]; then
  say "skipped: HEAD is already released as $(git tag --points-at HEAD -l 'v*' | head -1)"
  exit 0
fi

latest=$(git tag -l 'v*' --sort=-v:refname | head -1)

if [ -z "$latest" ]; then
  # First release. v1.0.0 rather than v0.1.0: the game is playable, and a 0.x
  # would only invite the question of what 1.0 is waiting for.
  say "first release, no previous v* tag"
  printf 'v1.0.0\n'
  exit 0
fi

IFS=. read -r major minor patch <<<"${latest#v}"
range="$latest..HEAD"

if [ "$marker" = "[release major]" ]; then
  bump=major
  say "major: a subject in this push carries [release major]"
elif [ "$marker" = "[release minor]" ]; then
  bump=minor
  say "minor: a subject in this push carries [release minor]"
elif git log --no-merges --pretty=%s "$range" | grep -qE '^[a-z]+(\([^)]*\))?!:' ||
  git log --no-merges --pretty=%B "$range" | grep -q '^BREAKING CHANGE'; then
  bump=major
  say "major: a commit since $latest is marked breaking"
elif git log --no-merges --pretty=%s "$range" | grep -qE '^feat(\([^)]*\))?:'; then
  bump=minor
  say "minor: a feat: commit since $latest"
else
  bump=patch
  say "patch: nothing since $latest claims more"
fi

case "$bump" in
major) printf 'v%s.0.0\n' "$((major + 1))" ;;
minor) printf 'v%s.%s.0\n' "$major" "$((minor + 1))" ;;
patch) printf 'v%s.%s.%s\n' "$major" "$minor" "$((patch + 1))" ;;
esac
