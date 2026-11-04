import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CartItem, Product } from "../../types";
import type { RootState } from "../../app/store";


interface CartState {
  items: CartItem[];
}
const initialState: CartState = { items: [] };
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<Product>) {
      const existing = state.items.find((i) => i.id === action.payload.id);
      if (existing) existing.quantity += 1;
      else state.items.push({ ...action.payload, quantity: 1 });
    },
    removeFromCart(state, action: PayloadAction<number>) {
      state.items = state.items.filter((i) => i.id !== action.payload);
    },
    updateQuantity(state, action: PayloadAction<{ id: number; quantity: number }>) {
      const { id, quantity } = action.payload;
      if (quantity <= 0) {
        state.items = state.items.filter((i) => i.id !== id);
        return;
      }
      const item = state.items.find((i) => i.id === id);
      if (item) item.quantity = quantity;
    },
    clearCart(state) {
      state.items = [];
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;

export const selectCartItems = (s: RootState) => s.cart.items;
export const selectCartCount = (s: RootState) =>
  s.cart.items.reduce((sum, i) => sum + i.quantity, 0);
export const selectCartTotal = (s: RootState) =>
  s.cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

export default cartSlice.reducer;
