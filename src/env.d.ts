declare namespace NodeJS {
  interface ProcessEnv {
    /** Site sub-path, e.g. "/web-game-duck-solitaire". Empty or unset = site root. */
    readonly NEXT_PUBLIC_BASE_PATH?: string;
    /** Only the exact string "true" turns Ducker ID sign-in on. */
    readonly NEXT_PUBLIC_FEATURE_DUCKER_SIGN_IN?: string;
    readonly NEXT_PUBLIC_DUCKER_ISSUER?: string;
    readonly NEXT_PUBLIC_DUCKER_CLIENT_ID?: string;
    readonly NEXT_PUBLIC_DUCKER_SCOPE?: string;
    readonly NEXT_PUBLIC_DUCKER_PROFILE_PATH?: string;
  }
}
