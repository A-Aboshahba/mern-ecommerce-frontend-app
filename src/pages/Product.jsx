import styled from "styled-components";
import Navbar from "../components/Navbar";
import Announcement from "../components/Announcement";
import Footer from "../components/Footer";
import Newsletter from "../components/Newsletter";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { mobile } from "../responsive";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { publicRequest } from "../requestMethods";
import { addProduct, updateProduct } from "../redux/cartRedux";
import { useDispatch, useSelector } from "react-redux";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import axios from "axios";
import HighlightOffTwoToneIcon from "@mui/icons-material/HighlightOffTwoTone";
const Container = styled.div``;

const Wrapper = styled.div`
  padding: 50px;
  display: flex;
  ${mobile({ padding: "10px", flexDirection: "column" })}
`;

const ImgContainer = styled.div`
  flex: 1;
`;

const Image = styled.img`
  width: 100%;
  height: 90vh;
  object-fit: cover;
  ${mobile({ height: "40vh" })}
`;

const InfoContainer = styled.div`
  flex: 1;
  padding: 0px 50px;
  ${mobile({ padding: "10px" })}
`;

const Title = styled.h1`
  font-weight: 200;
`;

const Desc = styled.p`
  margin: 20px 0px;
`;

const Price = styled.span`
  font-weight: 100;
  font-size: 40px;
`;

const FilterContainer = styled.div`
  width: 50%;
  margin: 30px 0px;
  display: flex;
  justify-content: space-between;
  ${mobile({ width: "100%" })}
`;

const Filter = styled.div`
  display: flex;
  align-items: center;
`;

const FilterTitle = styled.span`
  font-size: 20px;
  font-weight: 200;
`;

const FilterColor = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: ${(props) =>
    props.selected === props.color ? "2px solid red" : "0.5px solid black"};
  background-color: ${(props) => props.color};
  margin: 0px 5px;
  cursor: pointer;
`;

const FilterSize = styled.select`
  margin-left: 10px;
  padding: 5px;
`;

const FilterSizeOption = styled.option``;

const AddContainer = styled.div`
  width: 50%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  ${mobile({ width: "100%" })}
`;

const AmountContainer = styled.div`
  display: flex;
  align-items: center;
  font-weight: 700;
`;

const Amount = styled.span`
  width: 30px;
  height: 30px;
  border-radius: 10px;
  border: 1px solid teal;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0px 5px;
`;

const Button = styled.button`
  padding: 15px;
  border: 2px solid teal;
  background-color: white;
  cursor: pointer;
  font-weight: 500;
  &:hover {
    background-color: #f8f4f4;
  }
`;

export default function Product() {
  window.scrollTo(0, 0);
  const cart = useSelector((state) => state.cart);
  const currentUser = useSelector((state) => state.user.currentUser);
  const [addError, setAddError] = useState(null);
  const location = useLocation();
  const id = location.pathname.split("/")[2];
  const [product, setProduct] = useState({});
  const [color, setColor] = useState("");
  const [size, setSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch();
  const handleQuantity = (type) => {
    if (type === "dec") {
      if (quantity === 0) {
        setQuantity(0);
      } else {
        setQuantity(quantity - 1);
      }
    } else {
      setQuantity(quantity + 1);
    }
  };
  const chooseColor = (color) => {
    setAddError(null);
    setColor(color);
  };
  const chooseSize = (size) => {
    setAddError(null);
    setSize(size);
  };
  const handleClick = async () => {
    if (color && size) {
      product.cartPageId = product._id + color + size;
      let alreadyThere = false;
      cart.products.forEach((cartProduct) => {
        if (cartProduct.cartPageId === product.cartPageId) {
          alreadyThere = true;
        }
      });
      if (alreadyThere) {
        dispatch(
          updateProduct({
            cartPageId: product.cartPageId,
            add_or_remove: quantity,
            price: product.price * quantity,
          })
        );
        if (currentUser) {
          const update_Product_Form_Local_To_Db = await axios.put(
            `${process.env.REACT_APP_BASE_URL}/api/carts/${currentUser._id}`,
            {
              cartId: cart.cartId,
              cartPageId: product.cartPageId,
              quantity: quantity,
              price: product.price,
            },
            {
              headers: {
                token: `Bearer ${currentUser.accessToken}`,
              },
            }
          );
        }
      } else {
        dispatch(
          addProduct({
            ...product,
            cartPageId: product._id + color + size,
            quantity,
            color,
            size,
          })
        );
        if (currentUser) {
          const add_Product_Form_Local_To_Db = await axios.put(
            `${process.env.REACT_APP_BASE_URL}/api/carts/product/${currentUser._id}`,
            {
              cartId: cart.cartId,
              products: {
                ...product,
                cartPageId: product._id + color + size,
                color,
                size,
                quantity,
              },
              quantity: 1,
              total: quantity * product.price,
            },
            {
              headers: {
                token: `Bearer ${currentUser.accessToken}`,
              },
            }
          );
        }
      }
    } else {
      setAddError(true);
    }
  };
  useEffect(() => {
    const getProduct = async () => {
      const res = await publicRequest.get(`/products/find/` + id);
      setProduct(res.data);
    };
    getProduct();
  }, [id]);
  return (
    <div>
      <Container>
        <Navbar />
        <Announcement />
        <Wrapper>
          <ImgContainer>
            <Image
              src={
                process.env.REACT_APP_BASE_URL +
                "/images/products/" +
                product.img
              }
            />
          </ImgContainer>
          <InfoContainer>
            <Title>{product.title}</Title>
            <Desc>{product.desc}</Desc>
            <Price>{product.price}</Price>
            <FilterContainer>
              <Filter>
                <FilterTitle>Color:</FilterTitle>
                {product.color?.map((c) => (
                  <FilterColor
                    color={c}
                    key={c}
                    selected={color}
                    onClick={() => chooseColor(c)}
                  />
                ))}
                <HighlightOffTwoToneIcon
                  cursor="pointer"
                  onClick={() => setColor("")}
                />
              </Filter>
              <Filter>
                <FilterTitle>Size:</FilterTitle>
                <FilterSize onChange={(e) => chooseSize(e.target.value)}>
                  <option value="" label="size:"></option>
                  {product.size?.map((s) => (
                    <FilterSizeOption cursor="pointer" key={s}>
                      {s}
                    </FilterSizeOption>
                  ))}
                </FilterSize>
              </Filter>
            </FilterContainer>
            <AddContainer>
              <AmountContainer>
                <AddIcon
                  cursor="pointer"
                  onClick={() => handleQuantity("inc")}
                />
                <Amount>{quantity}</Amount>
                <RemoveIcon
                  cursor="pointer"
                  onClick={() => handleQuantity("dec")}
                />
              </AmountContainer>
              <Button onClick={handleClick}>Add To Cart</Button>
              {addError && (
                <Stack sx={{ width: "100%" }} spacing={2}>
                  <Alert severity="error">
                    Please make sure to specify color and size.
                  </Alert>
                </Stack>
              )}
            </AddContainer>
          </InfoContainer>
        </Wrapper>
        <Newsletter />
        <Footer />
      </Container>
    </div>
  );
}
