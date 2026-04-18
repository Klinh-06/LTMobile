# MediCare+ — Ứng dụng Đặt lịch Khám bệnh

Ứng dụng React Native (Expo) dành cho bệnh nhân: tìm kiếm bác sĩ, đặt lịch khám, quản lý hồ sơ y tế và theo dõi lịch hẹn.

---

## Cài đặt & Chạy

```bash
cd MediCare
npm install
npx expo start --clear
```

Quét mã QR bằng **Expo Go** trên điện thoại (cùng mạng WiFi).

---

## Tài khoản demo

| Số điện thoại | Mật khẩu | Tên |
|---------------|----------|-----|
| `0901234567` | `123456` | Nguyễn Văn An |

> Hoặc tạo tài khoản mới qua màn hình **Đăng ký**.

---

## Dữ liệu mẫu

Lần chạy đầu tiên app tự nạp:

- **2 lịch hẹn sắp tới** — BS. Nguyễn Thị Hương (Tim mạch), BS. Phạm Văn Đức (Nội tổng quát)
- **1 lịch đã khám** — BS. Lê Thị Mai (Da liễu) kèm hồ sơ y tế mẫu
- **1 lịch đã hủy** — BS. Trần Văn Minh (Nhi khoa)
- **Thông báo trống** — chỉ xuất hiện khi người dùng đặt / hủy / đổi lịch

---

## Danh sách bác sĩ (50 bác sĩ)

| Chuyên khoa | Số bác sĩ |
|---|:---:|
| Tim mạch | 6 |
| Nhi khoa | 6 |
| Nội tổng quát | 7 |
| Da liễu | 6 |
| Thần kinh | 6 |
| Xương khớp | 6 |
| Mắt | 6 |
| Tai Mũi Họng | 7 |
| **Tổng** | **50** |

**Lịch làm việc (đồng nhất toàn bộ bác sĩ):**

| Thứ 2 – Thứ 7 | Chủ nhật |
|:---:|:---:|
| 08:00 · 09:00 · 10:00 · 11:00 · 14:00 · 15:00 · 16:00 | Nghỉ |

---

## Chức năng

### Xác thực
- **Đăng nhập** — số điện thoại + mật khẩu, ẩn/hiện mật khẩu
- **Đăng ký** — họ tên + số điện thoại Việt Nam (10 số, đầu 03/05/07/08/09) + mật khẩu ≥ 6 ký tự; kiểm tra trùng số điện thoại
- **Quên mật khẩu** — nhập SĐT đã đăng ký → đặt mật khẩu mới ngay trên app (không cần email)
- **Đổi mật khẩu** — trong Cài đặt → nhập mật khẩu cũ + mới + xác nhận
- Phiên đăng nhập lưu qua AsyncStorage, không mất khi tắt app
- Dữ liệu (lịch hẹn, hồ sơ, thông báo) tách biệt theo từng tài khoản — đăng nhập tài khoản khác tự động reset dữ liệu

### Trang chủ
- Lời chào theo buổi (sáng / chiều / tối) kèm tên người dùng
- Thanh tìm kiếm nhanh → màn hình tìm bác sĩ
- **Banner nhắc bổ sung CCCD/CMND** nếu chưa điền trong hồ sơ — bấm vào chuyển thẳng sang Chỉnh sửa hồ sơ
- Banner thông tin phòng khám MediCare+ Clinic
- 8 chuyên khoa (cuộn ngang) → lọc bác sĩ theo chuyên khoa
- Tối đa 2 lịch hẹn sắp tới hiển thị nhanh
- Danh sách bác sĩ nổi bật (cuộn ngang) với nút Đặt lịch nhanh
- Badge số thông báo chưa đọc

### Tìm & Xem bác sĩ
- Danh sách 50 bác sĩ với tìm kiếm realtime theo tên hoặc chuyên khoa
- **Lọc/Sắp xếp** qua icon button → modal: Mặc định · Rating cao nhất · Kinh nghiệm nhiều nhất · Phí thấp nhất · Phí cao nhất
- Indicator hiển thị bộ lọc đang áp dụng, bấm X để xóa nhanh
- **Trang chi tiết bác sĩ** bao gồm:
  - Ảnh đại diện, chuyên khoa, số bệnh nhân, rating
  - Giới thiệu
  - Thông tin chuyên môn: năm sinh, học vị, bằng cấp, chứng chỉ hành nghề
  - Kinh nghiệm làm việc: các bệnh viện đã công tác kèm thời gian
  - Thành tích & Giải thưởng
  - Phí khám
  - Lịch làm việc theo tuần
  - Đánh giá từ bệnh nhân (pool 20 review thực tế, mỗi bác sĩ hiện bộ khác nhau)

### Đặt lịch khám
1. **Chọn ngày** — 14 ngày tới; Chủ nhật hiển thị "Nghỉ" và không thể chọn
2. **Chọn giờ** — chỉ hiển thị khung giờ còn lại trong ngày (giờ đã qua bị ẩn hoàn toàn); khung giờ đã có người đặt hiển thị "Đầy"
3. **Ghi chú triệu chứng** (tùy chọn)
4. **Xác nhận** — xem lại thông tin bác sĩ, ngày giờ, phí khám, thông tin bệnh nhân
5. **Quy trình khám 4 bước** hiển thị ngay trên màn hình xác nhận (tầng, phòng cụ thể)
6. **Nhắc mang CCCD/CMND bản gốc** khi đến phòng khám
7. **Màn hình thành công** — animation, nút "Xem lịch hẹn" chuyển thẳng về tab Lịch hẹn

### Quản lý lịch hẹn
3 tab: **Sắp tới · Đã khám · Đã hủy**

| Thao tác | Áp dụng cho | Kết quả |
|----------|-------------|---------|
| Đổi lịch | Sắp tới | Chọn ngày/giờ mới — chi tiết cập nhật tức thì khi quay lại |
| Hủy lịch | Sắp tới | Chuyển sang Đã hủy, gửi thông báo |
| Xác nhận đã khám | Sắp tới | Chuyển sang Đã khám → tự động mở trang đánh giá |
| Đánh giá bác sĩ | Đã khám | 1–5 sao + nhận xét |
| Xem hồ sơ khám | Đã khám | Mở hồ sơ y tế liên kết |

**Chi tiết lịch hẹn sắp tới** hiển thị thêm:
- Quy trình khám 4 bước (tầng 1 lễ tân → tầng 2 chờ → tầng 2 phòng khám → tầng 1 thu ngân)
- Nhắc mang CCCD/CMND

> Lịch hẹn sắp tới đã qua ngày sẽ tự động bị xóa khi mở app.

### Hồ sơ khám bệnh
- Danh sách tất cả lần khám đã hoàn thành
- Chi tiết từng hồ sơ: bác sĩ, chuyên khoa, ngày khám, chẩn đoán, đơn thuốc, ghi chú
- Hồ sơ tự động tạo sau khi xác nhận đã khám

### Thông báo
- Tự động tạo khi đặt lịch (xanh lá), hủy lịch (đỏ), đổi lịch (xanh dương)
- Đánh dấu đã đọc từng thông báo hoặc tất cả cùng lúc
- Badge số chưa đọc trên tab Cá nhân

### Hồ sơ cá nhân & Cài đặt
- Chỉnh sửa: họ tên, SĐT, ngày sinh, **số CCCD/CMND**, giới tính, nhóm máu
- Bật/tắt thông báo Push và Email
- **Đổi mật khẩu** — xác minh mật khẩu cũ trước khi đổi
- Xem thống kê: số lịch hẹn, hồ sơ bệnh, đánh giá đã gửi

---

## Quy trình khám tại MediCare+ Clinic

| Bước | Địa điểm | Nội dung |
|:---:|---|---|
| 1 | Tầng 1 — Quầy lễ tân | Xuất trình CCCD/CMND + mã lịch hẹn, nhận số thứ tự |
| 2 | Tầng 2 — Khu vực chờ | Ngồi chờ, theo dõi bảng điện tử gọi số |
| 3 | Tầng 2 — Phòng khám | Vào phòng khi được gọi, mang CCCD để bác sĩ đối chiếu |
| 4 | Tầng 1 — Quầy thu ngân | Thanh toán phí khám và nhận toa thuốc |

---

## Lưu ý

- Toàn bộ dữ liệu lưu **local** bằng AsyncStorage — không có backend, không đồng bộ qua mạng
- Đăng nhập bằng **số điện thoại** (không dùng email)
- Dữ liệu mỗi tài khoản độc lập — không rò rỉ sang tài khoản khác
- Chủ nhật không có lịch khám
- Hồ sơ y tế mặc định "Chưa cập nhật" vì không có portal bác sĩ
- Đánh giá bác sĩ lưu local, không thay đổi điểm rating hiển thị
- Thông tin bác sĩ (học vị, bệnh viện, giải thưởng) là dữ liệu mẫu minh họa

---

## Cấu trúc thư mục

```
MediCare/
├── App.js
└── src/
    ├── context/AppContext.js       # Toàn bộ state và business logic
    ├── data/mockData.js            # 50 bác sĩ, 8 chuyên khoa, dữ liệu mẫu
    ├── navigation/AppNavigator.js  # Điều hướng toàn app
    ├── screens/
    │   ├── auth/                   # Login · Register · ForgotPassword
    │   ├── home/                   # Home · ClinicInfo
    │   ├── doctor/                 # DoctorList · DoctorDetail · Search · Specialty
    │   ├── appointment/            # Book · Confirm · Success · List · Detail · Reschedule · Rate
    │   ├── records/                # MedicalRecords · RecordDetail
    │   ├── profile/                # Profile · EditProfile · Settings
    │   └── notifications/          # Notifications
    ├── theme/colors.js
    └── utils/
        ├── dateUtils.js
        └── storage.js
```

---

## Công nghệ sử dụng

| Thư viện | Mục đích |
|----------|----------|
| React Native + Expo SDK 54 | Framework chính |
| @react-navigation/native-stack | Điều hướng stack |
| @react-navigation/bottom-tabs | Tab bar |
| react-native-safe-area-context | Hỗ trợ notch / Dynamic Island |
| @react-native-async-storage | Lưu trữ dữ liệu local |
| @expo/vector-icons (Ionicons) | Bộ icon |

---

*Phiên bản 1.0.0*
