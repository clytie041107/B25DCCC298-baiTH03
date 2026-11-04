# ShopMini

## Các trang

| Đường dẫn | Trang | Ghi chú |
|---|---|---|
| `/` | Trang chủ | Lưới sản phẩm responsive, tìm kiếm theo tên |
| `/products/:id` | Chi tiết sản phẩm | Lấy `id` từ URL |
| `/cart` | Giỏ hàng | Tăng/giảm/xoá sản phẩm |
| `/login` | Đăng nhập | Giả lập, password = `123456` |
| `/checkout` | Thanh toán | Protected route |
| `*` | 404 | |

## Nguyên tắc chọn nơi lưu state

Mỗi dữ liệu được đặt ở phạm vi hẹp nhất mà vẫn đủ dùng. Thứ tự cân nhắc:

1. Chỉ một component cần, bỏ đi khi rời trang: dùng `useState`.
2. Nhiều component cần, đơn giản, ít thay đổi: dùng Context.
3. Nhiều trang cần, thay đổi thường xuyên, có logic hoặc bất đồng bộ: dùng Redux.
4. Tính ra được từ state khác: không lưu, tính bằng selector hoặc biến cục bộ.

## Bảng tổng hợp

| Dữ liệu | Nơi lưu | File |
|---|---|---|
| Danh sách sản phẩm, `status`, `error` | Redux (`productsSlice`) | `features/products/productsSlice.ts` |
| Các sản phẩm trong giỏ (`CartItem[]`) | Redux (`cartSlice`) | `features/cart/cartSlice.ts` |
| Tổng số lượng, tổng tiền | Selector (tính từ Redux) | `cartSlice.ts` |
| Theme sáng/tối | Context (`ThemeContext`) | `contexts/ThemeContext.tsx` |
| Người dùng đăng nhập (`user`) | Context (`AuthContext`) | `contexts/AuthContext.tsx` |
| Từ khoá tìm kiếm (`query`) | `useState` | `pages/HomePage.tsx` |
| Ô username, password, thông báo lỗi đăng nhập | `useState` | `pages/LoginPage.tsx` |
| Cờ `ordered` (đã đặt hàng chưa) | `useState` | `pages/CheckoutPage.tsx` |
| Danh sách sản phẩm sau khi lọc | Biến tính toán trong render | `pages/HomePage.tsx` |
| `id` sản phẩm đang xem | URL (`useParams`) | `pages/ProductDetailPage.tsx` |
| Trang cần quay lại sau khi đăng nhập (`from`) | Router `location.state` | `ProtectedRoute.tsx`, `LoginPage.tsx` |

## Lý do

### Redux Toolkit

**Danh sách sản phẩm (`productsSlice`)**
- Được dùng ở nhiều trang: Trang chủ hiển thị lưới, Chi tiết sản phẩm tìm một sản phẩm theo `id`. Lưu một nơi thì chỉ gọi API một lần, chuyển trang không phải tải lại.
- Là dữ liệu bất đồng bộ có vòng đời `loading`, `succeeded`, `failed`. `createAsyncThunk` xử lý đúng ba trạng thái này, nếu dùng `useState` thì mỗi trang phải tự lặp lại logic.
- Người dùng mở thẳng `/products/5` vẫn hoạt động, vì trang chi tiết kiểm tra `status === "idle"` rồi tự gọi thunk.

**Giỏ hàng (`cartSlice`)**
- Nhiều nơi cùng đọc và cùng ghi: nút "Thêm vào giỏ" ở card và trang chi tiết, số lượng trên Header, trang Giỏ hàng, trang Thanh toán (xoá giỏ sau khi đặt hàng).
- Có logic cập nhật không đơn giản: thêm sản phẩm đã có thì tăng số lượng, số lượng giảm về 0 thì xoá. Reducer gom logic này vào một chỗ, dễ kiểm tra và dễ tìm lỗi.
- Cần giá trị dẫn xuất (tổng số lượng, tổng tiền). Selector đảm bảo mọi nơi hiển thị cùng một kết quả.
- Redux DevTools cho xem từng action `addToCart`, `updateQuantity`, ... rất tiện khi gỡ lỗi.

### Context API

**Theme (`ThemeContext`)**
- Chỉ là một giá trị `"light" | "dark"` và một hàm đảo giá trị. Không có logic phức tạp và không bất đồng bộ nên không cần Redux.
- Đổi rất hiếm (người dùng bấm nút), nên việc Context render lại các component con không gây vấn đề hiệu năng.
- Ảnh hưởng toàn ứng dụng thông qua `document.documentElement.dataset.theme`, và được lưu vào `localStorage` để giữ lại khi tải lại trang.

**Người dùng (`AuthContext`)**
- Nhiều nơi cần biết ai đang đăng nhập: Header (hiện tên và nút đăng xuất), `ProtectedRoute` (quyết định cho vào hay chuyển hướng), `LoginPage` (đăng nhập, và bỏ qua trang này nếu đã đăng nhập).
- Dữ liệu nhỏ (`user` hoặc `null`) cùng hai hàm `login`, `logout`. Đây là trường hợp điển hình của Context.
- Tách khỏi Redux để thể hiện ranh giới: Context cho trạng thái "môi trường" của ứng dụng (giao diện, phiên đăng nhập), Redux cho dữ liệu nghiệp vụ (sản phẩm, giỏ hàng).

### `useState`

| State | Vì sao không đưa lên Context hoặc Redux |
|---|---|
| `query` ở `HomePage` | Chỉ ô tìm kiếm và lưới sản phẩm trong cùng trang dùng. Rời trang thì reset là hành vi hợp lý. Đưa vào Redux chỉ làm store phình ra không cần thiết. |
| `username`, `password`, `error` ở `LoginPage` | Là dữ liệu tạm của form. Đặc biệt không nên đưa mật khẩu vào store toàn cục. |
| `ordered` ở `CheckoutPage` | Chỉ quyết định hiển thị màn hình "Đặt hàng thành công" hay màn hình thanh toán. Không trang nào khác cần biết. |

### Dữ liệu không lưu vào state

- **Sản phẩm sau khi lọc:** tính trực tiếp từ `products` và `query` mỗi lần render. Nếu lưu riêng một bản sao, hai nguồn dữ liệu có thể lệch nhau.
- **Tổng số lượng, tổng tiền:** tính bằng selector từ `cart.items`, không lưu thành trường riêng để tránh quên cập nhật.
- **`id` sản phẩm đang xem:** đã nằm sẵn trong URL, đọc bằng `useParams`. Nhờ đó link chia sẻ và nút Back hoạt động đúng.
- **Trang cần quay lại sau đăng nhập:** truyền qua `location.state` của React Router, vì nó chỉ có ý nghĩa trong một lần điều hướng.

## Lưu trữ lâu dài (localStorage)

| Dữ liệu | Lưu vào localStorage? | Lý do |
|---|---|---|
| Theme | Có | Giữ lựa chọn giao diện của người dùng |
| `user` | Có | Giữ phiên đăng nhập giả lập khi tải lại trang |
| Giỏ hàng | Không | Đề bài không yêu cầu. Có thể mở rộng bằng cách đồng bộ `cart.items` ra localStorage |
