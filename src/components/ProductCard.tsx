import { Link } from "react-router-dom";
import { useAppDispatch } from "../app/hooks";
import { addToCart } from "../features/cart/cartSlice";
import type { Product } from "../types";

export default function ProductCard({ product }: { product: Product }) {
  const dispatch = useAppDispatch();
  return (
    <article className="card">
      <Link to={`/products/${product.id}`} className="card-img">
        <img src={product.image} alt={product.title} loading="lazy" />
      </Link>
      <h3 className="card-title">
        <Link to={`/products/${product.id}`}>{product.title}</Link>
      </h3>
      <p className="price">${product.price.toFixed(2)}</p>
      <button className="btn btn-primary" onClick={() => dispatch(addToCart(product))}>
        Thêm vào giỏ
      </button>
    </article>
  );
}