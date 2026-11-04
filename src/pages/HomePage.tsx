import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  fetchProducts,
  selectProducts,
  selectProductsError,
  selectProductsStatus,
} from "../features/products/productsSlice";
import ProductCard from "../components/ProductCard";

export default function HomePage() {
  const dispatch = useAppDispatch();
  const products = useAppSelector(selectProducts);
  const status = useAppSelector(selectProductsStatus);
  const error = useAppSelector(selectProductsError);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (status === "idle") dispatch(fetchProducts());
  }, [status, dispatch]);

  const filtered = products.filter((p) =>
    p.title.toLowerCase().includes(query.trim().toLowerCase())
  );

  return (
    <section>
      <input
        className="input search"
        type="search"
        placeholder="Tìm kiếm..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {status === "loading" && <p>Đang tải sản phẩm...</p>}
      {status === "failed" && (
        <p className="error">
          {error} <button className="btn btn-ghost" onClick={() => dispatch(fetchProducts())}>Thử lại</button>
        </p>
      )}
      {status === "succeeded" && filtered.length === 0 && <p>Không có sản phẩm nào khớp với "{query}".</p>}
      <div className="grid">
        {filtered.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
