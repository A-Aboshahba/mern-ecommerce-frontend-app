import { useState } from "react";
import styled from "styled-components";
import { LoginCall } from "../redux/apiCalls";
import { mobile } from "../responsive";
import { useDispatch, useSelector } from "react-redux";
import Announcement from "../components/Announcement";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { loginFailure, loginStart, loginSuccess } from "../redux/userRedux";
import { addCartFromDb, addProduct, updateProduct } from "../redux/cartRedux";
import { publicRequest } from "../requestMethods";
import axios from "axios";

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background: linear-gradient(
      rgba(255, 255, 255, 0.5),
      rgba(255, 255, 255, 0.5)
    ),
    url("http://localhost:5000/images/auth/login.jpeg") center;
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Wrapper = styled.div`
  width: 25%;
  padding: 20px;
  background-color: white;
  ${mobile({ width: "75%" })}
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 300;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  flex: 1;
  min-width: 40%;
  margin: 10px 0;
  padding: 10px;
`;

const Button = styled.button`
  width: 40%;
  border: none;
  padding: 15px 20px;
  background-color: teal;
  color: white;
  cursor: pointer;
  margin-bottom: 10px;
  &:disabled {
    color: green;
    cursor: not-allowed;
  }
`;

const Link = styled.a`
  margin: 5px 0px;
  font-size: 12px;
  text-decoration: underline;
  cursor: pointer;
`;
const Error = styled.span`
  color: red;
`;
export default function Login() {
  let localCart = useSelector((state) => state.cart);
  window.scrollTo(0, 0);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [cart, setCart] = useState(useSelector((state) => state.cart));
  const dispatch = useDispatch();
  const { isFetching, error } = useSelector((state) => state.user);
  const handleLogin = async (e) => {
    e.preventDefault();
    setUsername("");
    setPassword("");
    dispatch(loginStart());
    try {
      let localStorageProducts = localCart.products;
      const userRes = await publicRequest.post("auth/login", {
        username,
        password,
      });
      console.log("userRes.data", userRes.data);
      dispatch(loginSuccess(userRes.data));
      const dbCart = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/carts/find/${userRes.data.cartId}`,
        {
          headers: {
            token: `Bearer ${userRes.data.accessToken}`,
          },
        }
      );
      if (localCart.quantity === 0) {
        dispatch(
          addCartFromDb({
            cartId: dbCart.data._id,
            products: dbCart.data.products,
            quantity: dbCart.data.quantity,
            total: dbCart.data.total,
          })
        );
      } else {
        let mutualCart = {
          cartId: dbCart.data._id,
          products: dbCart.data.products,
          quantity: dbCart.data.quantity,
          total: dbCart.data.total,
        };
        mutualCart.products.forEach(async (dbCaretElement) => {
          let equal = null;
          localCart.products.forEach((localCartElement) => {
            if (dbCaretElement.cartPageId === localCartElement.cartPageId) {
              console.log("localCartElement", localCartElement);
              equal = localCartElement;
            }
          });
          if (equal) {
            localStorageProducts = localStorageProducts.filter(function (
              localStorageProduct
            ) {
              return localStorageProduct.cartPageId !== equal.cartPageId;
            });
            dispatch(
              updateProduct({
                cartPageId: dbCaretElement.cartPageId,
                add_or_remove: dbCaretElement.quantity,
                price: dbCaretElement.price * dbCaretElement.quantity,
              })
            );
            const update_Product_Form_Local_To_Db = await axios.put(
              `${process.env.REACT_APP_BASE_URL}/api/carts/${userRes.data._id}`,
              {
                cartId: dbCart.data._id,
                cartPageId: equal.cartPageId,
                quantity: equal.quantity,
                price: equal.price,
              },
              {
                headers: {
                  token: `Bearer ${userRes.data.accessToken}`,
                },
              }
            );
          } else {
            dispatch(
              addProduct({
                ...dbCaretElement,
                cartPageId:
                  dbCaretElement._id +
                  dbCaretElement.color +
                  dbCaretElement.size,
              })
            );
          }
        });
      }
      let localStorageProductsPrice = 0;
      localStorageProducts.forEach((element) => {
        localStorageProductsPrice += element.price * element.quantity;
      });
      const add_Product_Form_Local_To_Db = await axios.put(
        `${process.env.REACT_APP_BASE_URL}/api/carts/product/${userRes.data._id}`,
        {
          cartId: dbCart.data._id,
          products: localStorageProducts,
          quantity: localStorageProducts.length,
          total: localStorageProductsPrice,
        },
        {
          headers: {
            token: `Bearer ${userRes.data.accessToken}`,
          },
        }
      );
    } catch (err) {
      dispatch(loginFailure());
    }
  };
  return (
    <div>
      <Announcement />
      <Navbar />
      <Container>
        <Wrapper>
          <Title>Sign In</Title>
          <Form>
            <Input
              placeholder="username"
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              placeholder="password"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button onClick={handleLogin} disabled={isFetching}>
              Log In
            </Button>
            {error && <Error>Something went wrong</Error>}
            <Link>Do You forgot the password?</Link>
            <Link>CREATE A NEW ACCOUNT</Link>
          </Form>
        </Wrapper>
      </Container>
      <Footer />
    </div>
  );
}
