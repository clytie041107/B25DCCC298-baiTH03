import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  clearCart,
  removeFromCart,
  selectCartItems,
  selectCartTotal,
  updateQuantity,
} from "../features/cart/cartSlice";

export default function CartPage() {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const total = useAppSelector(selectCartTotal);

  if (items.length === 0)
    return (
      <p>
        Giỏ hàng đang trống. <Link to="/">Chọn sản phẩm</Link>
      </p>
    );

  return (
    <section>
      <h1>Giỏ hàng</h1>
      {items.map((item) => (
        <div className="cart-row" key={item.id}>
          <img src={item.image} alt={item.title} />
          <div className="cart-info">
            <Link to={`/products/${item.id}`}>{item.title}</Link>
            <span className="muted">${item.price.toFixed(2)}</span>
          </div>
          <div className="qty">
            <button className="btn btn-ghost" onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))}>−</button>
            <span>{item.quantity}</span>
            <button className="btn btn-ghost" onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}>+</button>
          </div>
          <strong>${(item.price * item.quantity).toFixed(2)}</strong>
          <button className="btn btn-ghost" onClick={() => dispatch(removeFromCart(item.id))}>Xoá</button>
        </div>
      ))}
      <p className="total">Tổng tiền: ${total.toFixed(2)}</p>
      <button className="btn btn-ghost" onClick={() => dispatch(clearCart())}>Xoá giỏ hàng</button>{" "}
      <Link to="/checkout" className="btn btn-primary">Thanh toán</Link>
    </section>
  );
}
