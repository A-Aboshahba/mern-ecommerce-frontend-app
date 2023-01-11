import styled from "styled-components";
import { mobile } from "../responsive";
import Announcement from "../components/Announcement";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
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
  width: 40%;
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
  flex-wrap: wrap;
`;

const Input = styled.input`
  flex: 1;
  min-width: 40%;
  margin: 20px 10px 0px 0px;
  padding: 10px;
`;

const Agreement = styled.span`
  font-size: 12px;
  margin: 20px 0px;
`;

const Button = styled.button`
  width: 40%;
  border: none;
  padding: 15px 20px;
  background-color: teal;
  color: white;
  cursor: pointer;
`;

export default function Register() {
  window.scrollTo(0, 0);
  const firstName = useRef();
  const lastName = useRef();
  const username = useRef();
  const email = useRef();
  const password = useRef();
  const passwordAgain = useRef();
  const navigate = useNavigate();
  const onChange = () => {
    passwordAgain.current.setCustomValidity("");
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (passwordAgain.current.value !== password.current.value) {
      passwordAgain.current.setCustomValidity("Passwords dont match!");
      return;
    } else {
      console.log("HERREE");
      const user = {
        name: firstName.current.value + " " + lastName.current.value,
        password: password.current.value,
        username: username.current.value,
        email: email.current.value,
      };
      try {
        await publicRequest.post("/auth/register", {
          ...user,
        });
        navigate("/login");
      } catch (err) {
        console.log(err);
      }
    }
  };
  return (
    <div>
      <Announcement />
      <Navbar />
      <Container>
        <Wrapper>
          <Title>CREATE AN ACCOUNT</Title>
          <Form onSubmit={handleSubmit}>
            <Input placeholder="First name" required ref={firstName} />
            <Input placeholder="Last name" required ref={lastName} />
            <Input placeholder="username" required ref={username} />
            <Input placeholder="email" type="email" required ref={email} />
            <Input
              placeholder="password"
              type="password"
              required
              ref={password}
              minLength="4"
              onChange={onchange}
            />
            <Input
              placeholder="confirm password"
              required
              type="password"
              minLength="4"
              ref={passwordAgain}
              onChange={onChange}
            />
            <Agreement>
              By creating an account, I consent to the processing of my personal
              data in accordance with the <b>PRIVACY POLICY</b>
            </Agreement>
            <Button type="submit">CREATE</Button>
          </Form>
        </Wrapper>
      </Container>
      <Footer />
    </div>
  );
}
