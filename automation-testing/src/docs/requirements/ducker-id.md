# DUCKERID — Đăng nhập Ducker ID tuỳ chọn (sau cờ tính năng)

Truy vết phía app: FR-15 · US-06 · ADR-0012 · invariant #10 · NFR-DATA-01 (ngoại lệ có biên giới) · NFR-A11Y-03.

- **REQ-DUCKERID-01** Cờ tắt (bản deploy): không nút đăng nhập, không menu tài khoản, không đọc tham số callback trên địa chỉ (`?code=` để nguyên), không chạm storage, không request ra ngoài site; câu cam kết giữ "Không tài khoản · …".
- **REQ-DUCKERID-02** Cờ bật, chưa bấm: có nút "Đăng nhập", chưa gọi issuer, chưa lưu gì; câu cam kết đổi thành "Không tài khoản riêng · …".
- **REQ-DUCKERID-03** Bấm "Đăng nhập" đi qua Ducker ID rồi về đúng ván: địa chỉ sạch (không `code` / `state`) và giữ `?van`, đúng thế bài lúc chia, gọi issuer đúng ba lần theo thứ tự authorize → token → userinfo, khoá PKCE đã xoá, không lỗi console.
- **REQ-DUCKERID-04** Menu tài khoản hiện tên, email, "Mở hồ sơ Ducker ID" (tới trang hồ sơ trên issuer, tab mới) và "Đăng xuất"; đăng xuất trả lại nút "Đăng nhập" và đặt tiêu điểm vào nó.
- **REQ-DUCKERID-05** Bàn phím trong menu: mũi tên / Home / End đi giữa các mục mà không chạm tới bàn bài; `Escape` đóng menu và trả tiêu điểm về nút tài khoản.
- **REQ-DUCKERID-06** Đăng nhập không đổi cách chơi: đã đăng nhập vẫn đi nước, rút bài như thường.
- **REQ-DUCKERID-07** Hồ sơ chỉ nằm trong bộ nhớ: tải lại trang là chưa đăng nhập, ván (số hiệu) còn nguyên.
- **REQ-DUCKERID-08** Từ chối ở Ducker ID, hoặc `state` bị sửa, thì lặng lẽ về chưa đăng nhập, địa chỉ sạch, ván nguyên; `state` sai thì không bao giờ gọi tới token.
- **REQ-DUCKERID-09** Issuer không trả lời thì sau tối đa 15 giây về chưa đăng nhập.
- **REQ-DUCKERID-10** `sessionStorage` bị chặn thì bấm "Đăng nhập" không đưa đi đâu (không để người chơi kẹt ở callback), game vẫn chạy.
- **REQ-DUCKERID-11** Nút đăng nhập có vùng bấm ≥ 44px, không đè số hiệu ván, không gây cuộn ngang; menu tài khoản nằm trọn trong màn hình, nằm trên mọi lá bài và mở ra không làm header nhảy.
