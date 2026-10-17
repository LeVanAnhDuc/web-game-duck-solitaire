# RESPONSIVE — Bàn bài co giãn theo bề rộng màn hình

Truy vết phía app: FR-11 · NFR-A11Y-03 · NFR-REL-03 · klondike design §3 · US-01 ("màn hình hẹp hơn bảy cột → co lại, không tràn ngang").
Mỗi khẳng định kiểm ở 320 / 375 / 768 / 1024 / 1440px.

- **REQ-RESPONSIVE-01** Không bao giờ cuộn ngang, từ 320px trở lên.
- **REQ-RESPONSIVE-02** Mỗi lá có vùng bấm ≥ 44×44px và mỗi nút / ô chọn trên thanh điều khiển cao ≥ 44px, ở mọi bề rộng được hỗ trợ.
- **REQ-RESPONSIVE-03** Bảy cột nằm trọn trong màn hình với hai lề bằng nhau; hàng trên thẳng hàng với các cột (chồng rút trên cột 1, chồng đích cuối trên cột 7).
- **REQ-RESPONSIVE-04** Ở mọi bề rộng, chọn và đặt một lá bằng chạm, rút bài bằng chạm đều chạy.
- **REQ-RESPONSIVE-05** Ở mọi bề rộng, đang cầm một lá mà chạm chồng rút thì bị từ chối và bỏ lựa chọn — không bao giờ kẹt.
