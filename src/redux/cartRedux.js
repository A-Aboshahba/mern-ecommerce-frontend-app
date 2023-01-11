import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartId: null,
    products: [],
    quantity: 0,
    total: 0,
  },
  reducers: {
    addProduct: (state, action) => {
      state.quantity += 1;
      state.products.push(action.payload);
      state.total += action.payload.price * action.payload.quantity;
    },
    updateProduct: (state, action) => {
      state.products.forEach((product) => {
        if (action.payload.cartPageId === product.cartPageId) {
          product.quantity += action.payload.add_or_remove;
          state.total += action.payload.price;
        }
      });
    },
    deleteProduct: (state, action) => {
      state.quantity -= 1;
      state.products = state.products.filter(
        (product) => product.cartPageId !== action.payload.cartPageId
      );
      state.total -= action.payload.totalPrice;
    },
    clearCart: (state) => {
      state.quantity = 0;
      state.products = [];
      state.total = 0;
    },
    addCartFromDb: (state, action) => {
      state.cartId = action.payload.cartId;
      state.products = action.payload.products || [];
      state.quantity = action.payload.quantity || null;
      state.total = action.payload.total || null;
    },
    logOutCart: (state) => {
      state.cartId = null;
      state.quantity = 0;
      state.products = [];
      state.total = 0;
    },
  },
});

export const {
  addProduct,
  clearCart,
  updateProduct,
  deleteProduct,
  addCartFromDb,
  logOutCart,
} = cartSlice.actions;
export default cartSlice.reducer;
