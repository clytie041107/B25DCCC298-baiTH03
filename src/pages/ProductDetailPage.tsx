import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  fetchProducts,
  selectProductById,
  selectProductsStatus,
} from "../features/products/productsSlice";
import { addToCart } from "../features/cart/cartSlice";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectProductsStatus);
  const product = useAppSelector(selectProductById(Number(id)));

  useEffect(() => {
    if (status === "idle") dispatch(fetchProducts());
  }, [status, dispatch]);

  if (status === "idle" || status === "loading") return <p>Đang tải...</p>;
  if (status === "failed") return <p className="error">Không thể tải sản phẩm.</p>;
  if (!product)
    return (
      <p>
        Không tìm thấy sản phẩm. <Link to="/">Về trang chủ</Link>
      </p>
    );

  return (
    <div className="detail">
      <div className="detail-img">
        <img src={product.image} alt={product.title} />
      </div>
      <div>
        <p className="muted">{product.category}</p>
        <h1>{product.title}</h1>
        <p className="price">${product.price.toFixed(2)}</p>
        <p>{product.description}</p>
        <button className="btn btn-primary" onClick={() => dispatch(addToCart(product))}>
          Thêm vào giỏ
        </button>{" "}
        <Link to="/" className="btn btn-ghost">Tiếp tục mua sắm</Link>
      </div>
    </div>
  );
}
