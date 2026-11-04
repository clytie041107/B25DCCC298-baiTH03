import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { Product } from "../../types";
import type { RootState } from "../../app/store";

export const fetchProducts = createAsyncThunk<Product[]>("products/fetchProducts", async () => {
  const res = await fetch("https://fakestoreapi.com/products");
  if (!res.ok) throw new Error(`Lỗi tải sản phẩm (HTTP ${res.status})`);
  return (await res.json()) as Product[];
});

export type LoadStatus = "idle" | "loading" | "succeeded" | "failed";

interface ProductsState {
  items: Product[];
  status: LoadStatus;
  error: string | null;
}

const productsSlice = createSlice({
  name: "products",
  initialState :{items: [], status: "idle", error: null} as ProductsState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Không thể tải sản phẩm";
      });
  },
});


export const selectProducts = (s: RootState) => s.products.items;
export const selectProductsStatus = (s: RootState) => s.products.status;
export const selectProductsError = (s: RootState) => s.products.error;
export const selectProductById = (id: number) => (s: RootState) =>
  s.products.items.find((p) => p.id === id);

export default productsSlice.reducer;