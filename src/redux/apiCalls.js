import { loginFailure, loginStart, loginSuccess } from "./userRedux";
import { addCartFromDb } from "./cartRedux";
import { publicRequest } from "../requestMethods";
import axios from "axios";
import { useSelector } from "react-redux";

export async function LoginCall(dispatch, user) {
  // const cart = useSelector((state) => state.cart);
  dispatch(loginStart());
  try {
    const userRes = await publicRequest.post("auth/login", user);
    console.log("userRes.data", userRes.data);
    dispatch(loginSuccess(userRes.data));
    // if (cart.quantity === 0) {
    dispatch(addCartFromDb({ cartId: userRes.data.cartId }));
    // } else {
    console.log("local cart has something");
    // }
  } catch (err) {
    dispatch(loginFailure());
  }
}

// export async function updateDbCart({data,cartId}) {
//   const update = await axios.put(
//     `http://localhost:5000/api/carts/${cartId}`,
//     {
//   cartId: dbCart.data._id,
//   cartPageId: equal.cartPageId,
//   quantity: equal.quantity,
//   price: equal.price,
// },
// {
//   headers: {
//     token: `Bearer ${userRes.data.accessToken}`,
//   },
// }
//   );
//   console.log("UPDATE DB CART", update);
//   return update;
// }
