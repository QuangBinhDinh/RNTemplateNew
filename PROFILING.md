# Profiling React Native App

**NOTE:** Để kết quả profiling chính xác nhất, chỉ profile ứng dụng đã được build (apk với android, ipa với ios). Không profiling khi ở development mode

## Android

Với Android có 2 cách đo hiệu năng (profiling) ứng dụng.

### Android studio

- Mở Android Studio, open project này lên (open ở root)

- Chờ 1 thời gian để Studio setup, setup xong sẽ có 1 popup Frameworks detected hiện lên. Nhấn Configure -> nhấn OK ở tab mới

![](images/profiling_1.png)

- Configure xong Studio sẽ hiển thị thêm 1 số tab nữa ở dưới đây, trong đó có tab Profiler

![](images/profiling_2.png)

- Run `npx react-native run-android --variant=release` để cài apk trên giả lập Android

- Sau khi giả lập mở app thành công, nhấn nút + ở new session, chọn process app đang chạy. Ở đây process app là trên package (com.printervalapp)

### Flashlight

- Run command cài Flashlight `curl https://get.flashlight.dev | bash`

- Chạy Flashlight `flashlight measure`, sẽ mở ra 1 tab trên trình duyệt.

- Run `npx react-native run-android --variant=release` để cài apk trên giả lập Android.

- Nhấn run để bắt đầu benchmark. 1 số thông tin về emulator sẽ được hiện ra trong quá trình thao tác app

![](images/flashlight.png)

## IOS

Đang cập nhật ...
