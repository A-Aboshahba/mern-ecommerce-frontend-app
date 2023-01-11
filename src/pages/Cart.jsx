import styled from "styled-components";
import Announcement from "../components/Announcement";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { mobile } from "../responsive";
import { useSelector } from "react-redux";
import StripeCheckout from "react-stripe-checkout";
import { useState } from "react";
import { useEffect } from "react";
import { userRequest } from "../requestMethods";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  clearCart,
  deleteProduct,
  updateProduct,
  logOutCart,
} from "../redux/cartRedux";
import axios from "axios";
import { logOut } from "../redux/userRedux";
import CancelIcon from "@mui/icons-material/Cancel";
const KEY = process.env.REACT_APP_STRIPE;

const Container = styled.div``;

const Wrapper = styled.div`
  padding: 20px;
  ${mobile({ padding: "10px" })}
`;

const Title = styled.h1`
  font-weight: 300;
  text-align: center;
`;

const Top = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
`;

const TopButton = styled.button`
  padding: 10px;
  font-weight: 600;
  cursor: pointer;
  border: ${(props) => props.type === "filled" && "none"};
  background-color: ${(props) =>
    props.type === "filled" ? "black" : "transparent"};
  color: ${(props) => props.type === "filled" && "white"};
`;

const TopTexts = styled.div`
  ${mobile({ display: "none" })}
`;

const TopText = styled.span`
  text-decoration: underline;
  cursor: pointer;
  margin: 0px 10px;
`;

const Bottom = styled.div`
  display: flex;
  justify-content: space-between;
  ${mobile({ flexDirection: "column" })}
`;

const Info = styled.div`
  flex: 3;
`;

const Product = styled.div`
  margin-bottom: 5px;
  display: flex;
  justify-content: space-between;
  ${mobile({ flexDirection: "column" })}
`;

const ProductDetail = styled.div`
  flex: 2;
  display: flex;
`;

const Image = styled.img`
  border: 1px solid gray;
  border-radius: 10%;
  width: 200px;
`;

const Details = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`;

const ProductName = styled.span``;

const ProductId = styled.span``;
const ProductColorDiv = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;
const ProductColor = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  margin-right: 5px;
  border: 0.5px solid black;
  background-color: ${(props) => props.color};
`;

const ProductSize = styled.span``;

const PriceDetail = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ProductAmountContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const ProductAmount = styled.div`
  font-size: 24px;
  margin: 5px;
  ${mobile({ margin: "5px 15px" })}
`;

const ProductPrice = styled.div`
  font-size: 30px;
  font-weight: 200;
  ${mobile({ marginBottom: "20px" })}
`;

const Hr = styled.hr`
  background-color: #eee;
  border: none;
  height: 1px;
`;

const Summary = styled.div`
  flex: 1;
  border: 0.5px solid lightgray;
  border-radius: 10px;
  padding: 20px;
  height: 50vh;
`;

const SummaryTitle = styled.h1`
  font-weight: 200;
`;

const SummaryItem = styled.div`
  margin: 30px 0px;
  display: flex;
  justify-content: space-between;
  font-weight: ${(props) => props.type === "total" && "500"};
  font-size: ${(props) => props.type === "total" && "24px"};
`;

const SummaryItemText = styled.span``;

const SummaryItemPrice = styled.span``;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  background-color: black;
  color: white;
  font-weight: 600;
  cursor: pointer;
`;

export default function Cart() {
  // window.scrollTo(0, 0);
  const cart = useSelector((state) => state.cart);
  const currentUser = useSelector((state) => state.user.currentUser);
  const [stripeToken, setStripeToken] = useState(null);
  const [isTokenValid, setIsTokenValid] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const onToken = (token) => {
    setStripeToken(token);
  };
  async function onEmptyCart() {
    dispatch(clearCart());
    if (currentUser) {
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
    }
  }
  function onContinue() {
    navigate("/products");
  }
  function doLogOut() {
    dispatch(logOutCart());
    dispatch(logOut());
  }
  async function updateCartProduct(
    cartPageId,
    add_or_remove,
    price,
    productQuantity
  ) {
    if (!(productQuantity === 0 && add_or_remove === -1)) {
      dispatch(updateProduct({ cartPageId, add_or_remove, price }));
      if (currentUser) {
        const update_Product_Form_Local_To_Db = await axios.put(
          `${process.env.REACT_APP_BASE_URL}/api/carts/${currentUser._id}`,
          {
            cartId: cart.cartId,
            cartPageId: cartPageId,
            quantity: add_or_remove,
            price: add_or_remove * price,
          },
          {
            headers: {
              token: `Bearer ${currentUser.accessToken}`,
            },
          }
        );
      }
    }
  }
  async function deleteProductLCLDB(product) {
    dispatch(
      deleteProduct({
        cartPageId: product.cartPageId,
        totalPrice: product.quantity * product.price,
      })
    );
    if (currentUser) {
      const delete_Product_Form_Db = await axios.put(
        `${process.env.REACT_APP_BASE_URL}/api/carts/delete/${currentUser._id}`,
        {
          cartId: cart.cartId,
          cartPageId: product.cartPageId,
          price: -1 * product.quantity * product.price,
        },
        {
          headers: {
            token: `Bearer ${currentUser.accessToken}`,
          },
        }
      );
    }
  }
  useEffect(() => {
    // async function updateCartDb() {}
    async function checkToken() {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/api/users/verifyToken`,
          {
            headers: {
              token: `Bearer ${currentUser.accessToken}`,
            },
          }
        );
        if (res.response.status === 401) {
          setIsTokenValid(false);
        }
      } catch (err) {
        if (err.response?.status === 401 || err.response?.status === 403) {
          setIsTokenValid(false);
          console.log(err.response?.status);
        }
      }
    }
    const makeRequest = async () => {
      try {
        const res = await userRequest.post(
          "/checkout/payment",
          {
            tokenId: stripeToken.id,
            amount: cart.total * 100,
          },
          { headers: { token: `Bearer ${currentUser.accessToken}` } }
        );
        navigate("/success", {
          state: {
            stripeData: res.data,
            cart: cart,
          },
        });
      } catch (err) {
        console.log(err);
      }
    };
    if (stripeToken) {
      makeRequest();
    }
    checkToken();
  }, [
    currentUser,
    stripeToken,
    cart.total,
    navigate,
    cart,
    currentUser?.accessToken,
    dispatch,
  ]);
  return (
    <Container>
      <Announcement />
      <Navbar />
      <Wrapper>
        <Title>YOUR BAG</Title>
        <Top>
          <TopButton onClick={onContinue}>CONTINUE SHOPPING</TopButton>
          <TopTexts>
            <TopText>Shopping Bag {`(${cart.quantity})`}</TopText>
            {/* <TopText>Your Wishlist (0)</TopText> */}
          </TopTexts>
          <TopButton type="filled" onClick={onEmptyCart}>
            Empty Cart
          </TopButton>
        </Top>
        <Bottom>
          <Info>
            {cart.products.map((product) => (
              <Product key={product.id + product.color + product.size}>
                <ProductDetail>
                  <CancelIcon
                    cursor="pointer"
                    onClick={() => deleteProductLCLDB(product)}
                  />
                  <Image
                    src={
                      process.env.REACT_APP_BASE_URL +
                      "/images/products/" +
                      product.img
                    }
                  />
                  <Details>
                    <ProductName>
                      <b>Product: </b>
                      <span>{product.title}</span>
                    </ProductName>
                    {/* <ProductId>
                      <b>ID:</b>
                      {product.id}
                    </ProductId> */}
                    <ProductColorDiv>
                      <ProductColor color={product.color} />
                    </ProductColorDiv>
                    <ProductSize>
                      <b>Size:</b>
                      {"   " + product.size}
                    </ProductSize>
                  </Details>
                </ProductDetail>
                <PriceDetail>
                  <ProductAmountContainer>
                    <AddIcon
                      cursor="pointer"
                      onClick={() =>
                        updateCartProduct(
                          product.cartPageId,
                          1,
                          product.price,
                          product.quantity
                        )
                      }
                    />
                    <ProductAmount>{product.quantity}</ProductAmount>
                    <RemoveIcon
                      cursor="pointer"
                      onClick={() =>
                        updateCartProduct(
                          product.cartPageId,
                          -1,
                          -1 * product.price,
                          product.quantity
                        )
                      }
                    />
                  </ProductAmountContainer>
                  <ProductPrice>
                    $ {product.price * product.quantity}
                  </ProductPrice>
                </PriceDetail>
              </Product>
            ))}
            <Hr />
          </Info>
          <Summary>
            <SummaryTitle>ORDER SUMMARY</SummaryTitle>
            <SummaryItem>
              <SummaryItemText>Subtotal</SummaryItemText>
              <SummaryItemPrice>$ {cart.total}</SummaryItemPrice>
            </SummaryItem>
            <SummaryItem>
              <SummaryItemText>Estimated Shipping</SummaryItemText>
              <SummaryItemPrice>$ +5.90</SummaryItemPrice>
            </SummaryItem>
            <SummaryItem type="total">
              <SummaryItemText>Total</SummaryItemText>
              <SummaryItemPrice>$ {cart.total + 5.9}</SummaryItemPrice>
            </SummaryItem>
            {currentUser ? (
              isTokenValid ? (
                <StripeCheckout
                  name="Aboshaba Store"
                  image="https://media.istockphoto.com/vectors/shopping-bag-with-cart-logo-designillustrator-vector-id1029895828?k=20&m=1029895828&s=612x612&w=0&h=3HonEkELnrH_KEli4TvlFXtuQfwmR-bTgUjW31gIB9s="
                  billingAddress
                  shippingAddress
                  description={`Your Total is $${cart.total}`}
                  amount={cart.total * 100}
                  token={onToken}
                  stripeKey={KEY}>
                  <Button>CHECKOUT</Button>
                </StripeCheckout>
              ) : (
                <Link to={"/login"}>
                  <Button onClick={doLogOut}>LOG IN TO CHECKOUT</Button>
                </Link>
              )
            ) : (
              <Link to={"/login"}>
                <Button onClick={doLogOut}>LOG IN TO CHECKOUT</Button>
              </Link>
            )}
          </Summary>
        </Bottom>
      </Wrapper>
      <Footer />
    </Container>
  );
}
