import { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
import { useLocation } from "react-router";
import { userRequest } from "../requestMethods";
import { useDispatch, useSelector } from "react-redux";
import { clearCart } from "../redux/cartRedux";
import { Link } from "react-router-dom";
import axios from "axios";
const Success = () => {
  window.scrollTo(0, 0);
  const location = useLocation();
  //in Cart.jsx I sent data and cart. Please check that page for the changes.(in video it's only data)
  const data = location.state.stripeData;
  const cart = location.state.cart;
  const currentUser = useSelector((state) => state.user.currentUser);
  const [orderId, setOrderId] = useState(null);

  useEffect(() => {
    const createOrder = async () => {
      try {
        const res = await userRequest.post(
          "/orders",
          {
            userId: currentUser._id,
            products: cart.products.map((item) => ({
              productId: item._id,
              quantity: item._quantity,
            })),
            amount: cart.total,
            address: data.billing_details.address,
          },
          {
            headers: {
              token: `Bearer ${currentUser.accessToken}`,
            },
          }
        );
        setOrderId(res.data._id);
        const clear_Db_cart = await axios.put(
          `${process.env.REACT_APP_BASE_URL}/api/carts/clear/${currentUser._id}`,
          {
            cartId: cart.cartId,
          },
          {
            headers: {
              token: `Bearer ${currentUser.accessToken}`,
            },
          }
        );
      } catch (err) {
        console.log(err);
      }
    };
    data && createOrder();
  }, [cart, data]);
  // }, [cart, data, currentUser]);
  const dispatch = useDispatch();
  dispatch(clearCart());
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}>
      {orderId
        ? `Order has been created successfully. Your order number is ${orderId}`
        : `Successfull. Your order is being prepared...`}
      <Link to="/">
        <button style={{ padding: 10, marginTop: 20, cursor: "pointer" }}>
          Go to Homepage
        </button>
      </Link>
    </div>
  );
};

export default Success;
