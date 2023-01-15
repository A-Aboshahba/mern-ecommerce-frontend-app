import styled from "styled-components";
import ArrowLeftOutlinedIcon from "@mui/icons-material/ArrowLeftOutlined";
import ArrowRightOutlinedIcon from "@mui/icons-material/ArrowRightOutlined";
import { useState } from "react";
import { sliderItems } from "../data";
import { mobile } from "../responsive";
import { Link } from "react-router-dom";

const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  position: relative;
  overflow: hidden;
  /* ${mobile({ display: "none" })} */
  ${mobile({ height: "400px" })}
`;
const Arrow = styled.div`
  width: 50px;
  height: 50px;
  background-color: #fff7f7;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  bottom: 0;
  left: ${(props) => props.direction === "left" && "10px"};
  right: ${(props) => props.direction === "right" && "10px"};
  margin: auto;
  cursor: pointer;
  opacity: 0.5;
  z-index: 2;
`;
const Wrapper = styled.div`
  height: 100%;
  display: flex;
  transition: all 1.5s ease;
  transform: translateX(${(props) => props.slideIndex * -100}vw);
  ${mobile({ height: "400px" })}
`;
const Slide = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  background-color: #${(props) => props.bg};
  ${mobile({ height: "400px" })}
`;
const ImgContainer = styled.div`
  height: 100%;
  flex: 1;
  ${mobile({ height: "300px", width: "200px", alignitmes: "flex-start" })}
`;
const Image = styled.img`
  height: 80%;
  ${mobile({ height: "300px", width: "200px", alignitmes: "flex-start" })}
`;

const InfoContainer = styled.div`
  padding: 50px;
  flex: 1;
  ${mobile({ padding: "5px", width: "200px" })}
`;
const Title = styled.h1`
  font-size: 70px;
  ${mobile({ fontSize: "19px" })}
`;
const Description = styled.p`
  margin: 50px 0px;
  font-size: 20px;
  font-weight: 500;
  letter-spacing: 3px;
  ${mobile({ fontSize: "14px" })}
`;
const Button = styled.button`
  padding: 10px;
  font-size: 20px;
  background-color: transparent;
  cursor: pointer;
`;
function Slider() {
  const [slideIndex, setSlideIndex] = useState(0);
  function handleClick(direction) {
    if (direction === "right") {
      setSlideIndex(slideIndex < 2 ? slideIndex + 1 : 0);
    } else {
      setSlideIndex(slideIndex > 0 ? slideIndex - 1 : 2);
    }
  }
  return (
    <Container>
      <Arrow direction="left" onClick={() => handleClick("left")}>
        <ArrowLeftOutlinedIcon />
      </Arrow>
      <Wrapper slideIndex={slideIndex}>
        {sliderItems.map((item) => (
          <Slide bg={item.bg} key={item.id}>
            <ImgContainer>
              <Image src={item.img} />
            </ImgContainer>
            <InfoContainer>
              <Title>{item.title}</Title>
              <Description>{item.desc} </Description>
              <Link to="/products">
                <Button>Show Now</Button>
              </Link>
            </InfoContainer>
          </Slide>
        ))}
      </Wrapper>
      <Arrow direction="right" onClick={() => handleClick("right")}>
        <ArrowRightOutlinedIcon />
      </Arrow>
    </Container>
  );
}

export default Slider;
