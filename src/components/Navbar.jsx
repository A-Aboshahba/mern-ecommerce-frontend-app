import React from "react";
import styled from "styled-components";
import SearchIcon from "@mui/icons-material/Search";
import Badge from "@mui/material/Badge";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { mobile } from "../responsive";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logOut } from "../redux/userRedux";
const Container = styled.div`
  height: 60px;
  ${mobile({ height: "50px" })}
`;
const Wrapper = styled.div`
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  ${mobile({ padding: "10px 0px" })}
`;
const Left = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
`;
const Language = styled.span`
  font-size: 14px;
  cursor: pointer;
  ${mobile({ display: "none" })}
`;
const SearchContainer = styled.div`
  border: 0.5px solid lightgray;
  display: flex;
  align-items: center;
  margin-left: 25px;
  padding: 5px;
`;
const Input = styled.input`
  border: none;
  ${mobile({ width: "50px" })}
`;

const Center = styled.div`
  flex: 1;
  text-align: center;
`;
const Logo = styled.h1`
  font-weight: bold;
  cursor: pointer;
  ${mobile({ fontSize: "24px" })}
`;

const Right = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  ${mobile({ flex: 2, justifyContent: "center" })}
`;
const MenuItem = styled.div`
  font-size: 14px;
  cursor: pointer;
  margin-left: 25px;
  ${mobile({ fontSize: "12px", marginLeft: "10px" })}
`;

function Navbar() {
  const quantity = useSelector((state) => state.cart.quantity);
  const currentUser = useSelector((state) => state.user.currentUser);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  function onSignin() {
    navigate("/login");
  }
  function onSignout() {
    dispatch(logOut());
    navigate("/");
  }
  function onRegister() {
    navigate("/register");
  }
  function goHome() {
    navigate("/");
  }
  function logged() {
    if (currentUser) {
      navigate("/cart");
    } else {
      window.alert("You should login first");
      navigate("/login");
    }
  }
  return (
    <Container>
      <Wrapper>
        <Left>
          <Language>EN</Language>
          <SearchContainer>
            <Input />
            <SearchIcon
              fontSize="small"
              style={{ color: "gray", fontSize: 16 }}
            />
          </SearchContainer>
        </Left>
        <Center>
          <Logo onClick={goHome}>ABSHOHBA STORE</Logo>
        </Center>
        <Right>
          {currentUser && <MenuItem onClick={onSignout}>SIGN OUT</MenuItem>}
          {!currentUser && <MenuItem onClick={onRegister}>REGISTER</MenuItem>}
          {!currentUser && <MenuItem onClick={onSignin}>SIGN IN</MenuItem>}
          <Link to={currentUser ? "/cart" : "/login"}>
            <MenuItem>
              <Badge badgeContent={quantity} color="success" onClick={logged}>
                <ShoppingCartOutlinedIcon />
              </Badge>
            </MenuItem>
          </Link>
        </Right>
      </Wrapper>
    </Container>
  );
}

export default Navbar;
