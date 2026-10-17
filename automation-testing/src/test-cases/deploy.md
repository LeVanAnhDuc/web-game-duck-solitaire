# DEPLOY — Test cases

Requirement: `docs/requirements/deploy.md` · quyết định: `docs/decisions/deploy.md`.
Lăng kính: 1 truy vết · 2 phân vùng · 3 biên · 4 chuyển trạng thái · 5 negative · 6 ngoài lề.
Chạy được trên dev và prd: `ENV=prd pnpm test src/tests/e2e/deploy`.

### TC-DEPLOY-001 — mọi tài nguyên của trang đều tải được

- **Requirement:** REQ-DEPLOY-01
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 1
- **Bước:** mở `./?van=20260904`, chờ mạng yên
- **Mong đợi:** 52 lá; không response ≥ 400, không request hỏng
- **Automated:** `tests/e2e/deploy/static-export.e2e.ts`

### TC-DEPLOY-002 — mọi request của trang nằm dưới đường dẫn gốc của site

- **Requirement:** REQ-DEPLOY-02
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 6
- **Bước:** mở `./?van=20260904`, chờ mạng yên
- **Mong đợi:** mọi URL request bắt đầu bằng `<webUrl>/`; địa chỉ trang là `<webUrl>/?van=20260904`
- **Automated:** `tests/e2e/deploy/static-export.e2e.ts`
