# templateApp

Welcome to binhchili's git repo. Đọc kỹ hướng dẫn sử dụng trước khi dùng !!!

## Requirement + Install

Node version 18.19.0. Run `yarn install`. **Không dùng npm install**

IOS install `cd ios && pod install`

Mac chip M dùng lệnh `cd ios && arch -x86_64 pod install`

Chạy giả lập trên android :

- Install android 12.0, 11.0
- Install CMake 3.18.1 (SDK tools)

Chạy trên XCode: version 14.0 or higher

Run debug trên giả lập Android để xem log trên Chrome (iOS không debug trên Chrome được). Project không hỗ trợ Flipper vì xài Firebase.

**UPDATE:** Theo thông báo của Apple từ ngày 29/4/2024 , các bản build app cần phải build = XCode 15 trở lên => phải nâng cấp Mac lên Ventura 13.5

Install xong, 1 số lib trong node-modules cần đc fix lại :

- [react-native-fast-image](https://github.com/DylanVann/react-native-fast-image/issues/943): nếu bị crash thì fix theo link

IDE: Visual Studio Code là tốt nhất.

**WARNING:** Bắt buộc phải dùng prettier để format code nhằm tránh conflict. Nếu IDE xài eslint thì tắt nó đi. Nếu không tắt eslint được thì phải dùng tổ hợp phím Save without Formatting ( CMD + K => S trên VS Code)

Dev mới làm ơn đọc kĩ phần này bởi vì khi commit code rất dễ gây conflict nhiều file.

**WARNING:** Nếu thêm/upgrade lib mới vào node_modules, bắt buộc phải thay đổi target version trong lệnh [Code Push](#codepush-command) ở dưới. Target version mới phải là version hiện tại của app (1.6.10). Đẩy Code Push khi thêm lib mới, đặc biệt là lib có native code rất dễ **gây crash app.** Trường hợp đã đẩy Code Push lên production, vào [App Center](https://appcenter.ms/apps) disable bản update mới nhất.

## Knowledge requirement

- React & React native & Functional components
- [Custom Hooks](https://react.dev/learn/reusing-logic-with-custom-hooks)
- [Redux store](https://redux.js.org/introduction/getting-started)
- [Formik](https://formik.org/docs/api/useFormik) & [Yup validation](https://github.com/jquense/yup)
- [Slice function](https://redux.js.org/usage/migrating-to-modern-redux#reducers-and-actions-with-createslice)
- [RTK Query](https://redux.js.org/redux-toolkit/overview)

## Cấu trúc thư mục src :

- api: Thông tin config axios, constant request, debug, etc
- assets: Bao gồm ảnh (.png, .svg, etc), font, animation, etc
- components: Các component cơ bản/reuse của app
- constant: Hằng số
- module: App được xây dựng dựa vào module, mỗi module sẽ phục vụ 1 chức năng cụ thể. 1 module có thể gồm nhiều screen, nhiều component khác
- navigation: Cấu trúc navigation(luồng đi) của app
- store: Nơi lưu trữ redux store, config store + middleware
- styles: Các styles dùng trong app
- types: Kiểu dữ liệu được dùng nhiều
- util: Function hay sử dụng chung

## Cấu trúc của 1 module

1 module app gồm các thành phần cơ bản sau:

- File `index.tsx`: Màn hình chính của module đó
- Folder `component` : Các component được sử dụng cho module đó
- File `service.ts` : Các service (query, mutation) được dùng cho module, giải thích sau
- File `reducer.ts`: Lưu trữ các state dùng cho toàn bộ module (chỉ tạo khi thây cần thiết)
- File `type.ts`: Kiểu dữ liêu dùng cho module, thường là các kiểu response, request của query trong `service.ts`

Nếu module đó có nhiều screen liên quan, 1 folder `screen` nên được tạo

## RTK Query:

Trước khi hiểu về luồng call endpoint của app , đọc guide về [RTK Query](https://redux.js.org/redux-toolkit/overview) này

File `api/service.ts` tạo ra các domain để gọi endpoint tới. Hiện tại app đang call tới 3 domain => 3 base query được tạo
Để hiểu thêm về cách xử lý data trả về success/error, đọc hàm `axiosBaseQuery`. Có thời gian thì có thể custom lại để optimal hơn

File `api/constant.ts` sẽ có 1 trường `SERVICE_DEBUG`. Nếu muốn log ra dữ liệu trả về từ query nào thì điền vào mảng

Mỗi module thường có file `service.ts` để inject endpoint vào. Muốn callendpoint nào thì sử dụng các hook đã được build sẵn từ đó ra

Có 2 kiểu query được sử dụng

- `useFetchSomethingQuerry`: đơn giản là fetch data ngay khi component mount và trả về result
- `useLazyFetchSomethingQuerry`: Promise function , trả về data để tự xử lý. Dùng cho lazy load

1 số trường hợp sau khi fetch api cần set data vào redux store (user cart, etc, ...) thì dùng matching trong reducer để hứng data trả về
Example: `cart/reducer.ts`

Ngoài ra còn 1 số kĩ năng advanced về rtk query nữa sẽ hươngs dẫn sau

## Sơ lược về các component hay sử dụng

Folder `src/components` gồm sub folder sau

- hooks: Các hook thường sử dụng.
- input: Textinput sử dụng cho app. Có 2 loại input là text input và option input(`InputOption`). Đọc thêm về cách sử dụng input cũng như validate các trường ở file `CreateAddress.tsx`
- list: Swiper image hiển thị ảnh product
- loading: Các component loading khi call api. Đặt component này ở màn bao quát toàn bộ screen
- popup: Các popup thông báo dùng chung của app. Đã export thành các function để tiện sử dụng: `alertSuccess()`, `alertError()` , `showMessage()`
- product: Gồm các product card sử dụng trong các list hiển thị product. `DynamicCard` sẽ có height tuỳ biến dùng cho list dọc còn `HorizonCard` dùng cho list ngang(`ProductRow`)
- text: Bắt buộc phải sử dụng text này do có sử dụng font cho app. Có 2 loại `TextNormal` và `TextSemiBold`. Chưa có kế hoạch thêm

Ngoài ra còn 1 số text đặc biệt như `RadioText` dùng cho RadioButton

- `FancyButton.tsx`: Button có animation khi nhấn đê tạo cảm giác. Có thể customize lại cho đẹp
- `HeaderScreen.tsx`: Header dùng chung cho toàn bộ screen app

1 số comp khác nữa tự khám phá

## Style guide

Mã màu app thường sử dụng sẽ nằm trong folder `styles/color.ts`. Trong file có object `lightColor` dùng để phân biệt 2 theme light/dark (nếu sau này app có làm theme mới thì thêm `darkColor`)

Mảng `pastel` dùng để pick ngẫu nhiên 1 color trong đó . Search hàm `randomizeColor` trong file `util/index`

Bên cạnh file `color.ts` còn 1 file `shadow.ts` dùng để implement shadow cho 1 view. Nhớ set `backgroundColor` cho view đó !!

Quy định về margin/spacing của app

- Block-block: 32px
- Title-content: 16px
- Item-item trong 1 list: row-row 24px, column-column 12px
- Padding horionztal của hầu hết screen (không có list ngang) : 18px

Đọc thêm ở figma: https://www.figma.com/file/YQS3URn5rkwIdUgxwAQe5e/Printerval-App

## Coding convention

### Quy định về folder structure

- Folder `src/module` lưu trữ nhiều folder, mỗi folder là 1 chức năng nhất đinh. Case phát sinh chức năng mới thì tạo thêm 1 folder mới
- Khi tạo 1 folder mới , cần config alias path đến folder đó (import k bị dài). Trong file `.babelrc` thêm 1 dòng mới trong mảng alias (cấu trúc như các folder khác), đồng thời thêm 1 dòng mới trong property `paths` trong file `tsconfig.json`
- Mặc định màn hình chính của chức năng là file `index.tsx`. Tạo 1 folder `component` trong module nếu cảm thấy cần tách code.
- Nếu chức năng gồm nhiều màn hình thì tạo 1 folder `screen` trong module để lưu các file màn hình
- Nếu logic xử lý data trả về từ api là phức tạp , cân nhắc chuyển logic đó sang 1 custom hook. Tạo 1 folder `hook` và tách phần xử lý logic ra 1 file ở đó
- Folder service có 2 file : `index.ts` lưu trữ các query/mutation, `type.ts` define các kiểu dữ liệu gửi lên query hay dữ liệu trả về từ query. Nhớ export type vì chắc chắn được dùng cho màn khác

### Quy định về file

- File UI có đuôi là `.tsx`. File handle logic có đuôi là `.ts`. File UI luôn có import React
- Phần xử lý logic của component nên tách thành 1 custom hook có tên `useSomething`. Đọc thêm về convention ở đây : https://react.dev/learn/reusing-logic-with-custom-hooks
- 1 file không nên quá 400 line. Nếu dài quá nên tách thành nhiều component.

## Build app

### IOS

Trong XCode có 2 scheme để build, Printerval và Printerval Staging.

- Printerval Staging: dùng để build bản staging phục vụ cho mục địch test, upload lên Deploy Gate. Trước khi build set `IS_PRODUCT = false` trong file `src/App.js`
- Printerval: dùng để build bản trên Testflight phục vụ cho mục địch test app trên môi trường thật (thanh toán tiền thật). Set `IS_PRODUCT = true `

### Android

**IMPORTANT:** Vì lí do bảo mật, trong file `build.gradle` sẽ không có password của `upload_keystore` dùng cho việc upload app android (đọc thêm [ở đây](https://reactnative.dev/docs/signed-apk-android)). Dev mới cần thêm password đó vào trong keychain access của mình (mặc định sử dụng Macbook)

- Mở keychain access, mục trên cùng chọn File -> New password item

- Nhập keychain item name , account name và password. Password này chính là password của `upload_keystore` lúc được tạo. Liên hệ mình để biết được

- Sửa file `android/build.gradle`, search hàm `getPassword` sẽ thấy có 2 params. Thay param đầu tiên = keychain item name vừa nhập ở bước trên

Xong. Chạy thử bundle app để test `./gradlew bundleRelease`

**NOTE:** `react-native-code-push` phát sinh bug khiến không thể build android được. Trước khi build 1 bản apk/bundle hãy xoá folder `android/app/build/generated`

- Build apk để test/đẩy Deploygate: `npx react-native run-android --variant=releaseStaging`
- Nếu sử dụng fastlane để deploy, đọc mục dưới đây

## CI

Project sử dụng `Fastlane` để deploy nhanh hơn. Đọc hướng dẫn ở [đây](./CI.md)

## Codepush command

## Advanced guide

[Trick gọi 1 hàm của 1 functional component từ 1 component khác nhờ EventEmitter](./EVENT_EMITTER.md)

[Đo hiệu năng của ứng dụng](./PROFILING.md)

Credit by binhchili <br/>
Contact: <br/> - dragonlava99@gmail.com (Skype) <br/> - g4.terminator@gmail.com
