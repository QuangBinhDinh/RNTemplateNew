# Trick gọi hàm của 1 functional component dựa vào EventEmitter

**Warning:** Trick này là 1 anti-pattern cấu trúc React Native. Về cơ bản React chỉ cho phép truyền props (variable,function) từ component cha xuống các component con. Trick này được tạo nên để skip cơ chế truyền prop trên khi cây component trở nên phức tạp, có nhiều nhánh

## Giới thiệu về EventEmitter

Mở file `EventEmitter.ts` [ở đây](./src/EventEmitter.ts)

`EventEmitter` cơ bản là 1 object lưu trữ các hàm(function) theo cấu trúc key-value. Chú ý value ở đây là 1 **mảng** các function chứ không phải 1 func duy nhất. Có 3 method chính

- `addListener` : Register 1 function vào mảng , dựa vào `eventName` để tạo key
- `removeListener`: Unregister function mới nhất của `eventName`
- `dispatch`: Call function mới nhất với `eventName` và các params truyền vào

Tại sao lại là mảng value? Printerval là 1 app thương mai điện tử , user có thể vào nhiều trang sp cùng lúc . Lúc này các trang sp sẽ được xếp chồng lên nhau, nếu như không khởi tạo mảng thì function của screen mới nhất sẽ ghi dè lên. Khi user quay lại trang cũ thì sẽ không còn function đó nữa và gây bug. Khởi tạo mảng để lưu lại các function của screen cũ , và khi user quay lại trang trước đó, function hiện tại sẽ được unregister thông qua hàm `removeListener`. Có thể xem VD dưới đây:

```
    const open = (msg: string) => {
      //some code go here
    };

    useEffect(() => {
        EventEmitter.addListener('some_event_name', open);
        return () => {
            EventEmitter.removeListener('some_event_name', open);
        };
    }, []);
```

Trên là cách register/unregister 1 function bất kì vào `EventEmitter`. Để gọi function này từ 1 component khác , đơn giản gọi

```
    EventEmitter.dispatch('some_event_name', params1, params2);
```

Với trick này coder sẽ không cần tốn thời gian để pass 1 function xuống tới các children sâu qua nhiều tầng nữa

## Ứng dụng: Các service component

Service component ở đây là các component hiển thị UI chung cho toàn bộ app như show alert , show thông báo lỗi , ...

Folder `src/components/popup` đã viết sẵn 1 số service component để dùng cho toàn bộ app. Ai có nhu cầu tạo 1 service mới có thể tham khảo file ở đó

Quay lại vấn đề về dispatch function ở trên. Ta thấy được muốn dispatch 1 function cần phải biết được `eventName` của function đó. Tuy nhiên không phải lúc nào cx có thể nhớ được tên function đã đc register. Vì vậy giải pháp là chúng ta sẽ export 1 hàm từ service component để dùng chung

```
const EVENT_NAME = 'open_message';
const open = (msg: string) => {
      //some code go here
    };

useEffect(() => {
    EventEmitter.addListener(EVENT_NAME, open);
    return () => {
        EventEmitter.removeListener(EVENT_NAME, open);
    };
}, []);

```

Tạo 1 constant để lưu `eventName`. Và ở ngoài component chúng ta export ra luôn

```
export const showMessage = (content: string) => {
    EventEmitter.dispatch(EVENT_NAME, content);
};

```

Sử dụng hàm này ở component khác chỉ đơn giản là import function này vào và gọi bình thường.

**Lưu ý:** Các service component này đặt trong `NavigationContainer` ở file `src/navigation/index.tsx`

Done. Happy coding!
