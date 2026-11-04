import { useState } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { clearCart, selectCartItems, selectCartTotal } from "../features/cart/cartSlice";

export default function CheckoutPage() {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const total = useAppSelector(selectCartTotal);
  const [ordered, setOrdered] = useState(false);

  const handleOrder = () => {
    dispatch(clearCart());
    setOrdered(true);
  };

  if (ordered)
    return (
      <div className="success">
        <h1>Đặt hàng thành công!</h1>
        <Link to="/" className="btn btn-primary">Về trang chủ</Link>
      </div>
    );

  if (items.length === 0)
    return (
      <p>
        Không có gì để thanh toán. <Link to="/">Chọn sản phẩm</Link>
      </p>
    );

  return (
    <section>
      <h1>Thanh toán</h1>
      {items.map((i) => (
        <div className="cart-row" key={i.id}>
          <span className="cart-info">{i.title} × {i.quantity}</span>
          <strong>${(i.price * i.quantity).toFixed(2)}</strong>
        </div>
      ))}
      <p className="total">Tổng tiền: ${total.toFixed(2)}</p>
      <button className="btn btn-primary" onClick={handleOrder}>Đặt hàng</button>
    </section>
  );
}
