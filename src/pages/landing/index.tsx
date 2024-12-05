import heroImage from "@/assets/images/hero-image.png";
import logo from "@/assets/images/logo-full.png";
import { Button, Flex, Image, Typography } from "antd";
import { Link } from "react-router-dom";
import "./landing-styles.css";
const { Title, Text } = Typography;

const Landing = () => {
  return (
    <Flex vertical className="landing-wrapper" wrap>
      <Flex className="top-navbar" justify="space-between" align="center" wrap>
        <img src={logo} alt="AidMi Logo" className="logo" />
        <Flex gap="small" className="nav-links">
          <Button variant="text" color="default" className="nav-item">
            Home
          </Button>
          <Button variant="text" color="default" className="nav-item">
            Services
          </Button>
          <Button variant="text" color="default" className="nav-item">
            About
          </Button>
          <Button variant="text" color="default" className="nav-item">
            Contact
          </Button>
        </Flex>
        <Flex gap="middle">
          <Link to="/register">
            <Button
              className="rounded-2xl"
              type="primary"
              iconPosition="end"
              name="Sign Up"
            >
              Sign Up
            </Button>
          </Link>
          <Link to="/login">
            <Button
              className="rounded-2xl"
              type="default"
              iconPosition="end"
              name="Login"
            >
              Login
            </Button>
          </Link>
        </Flex>
      </Flex>
      <img src={heroImage} className="hero-image" />

      <Flex flex={"1 1 auto"} vertical className="hero-section" gap="large">
        <Title className="hero-title">
          AidMi - Your First Step to Mental Wellness
        </Title>
        <Text className="hero-sub-title">
          Efficient, effective, and tailored to you. With our 'pre-consult'
          system, you provide essential information that empowers your
          healthcare professional to offer personalized care and connect you to
          the right specialists, right from the start.
        </Text>
        <Link to="/login">
          <Button
            className="rounded-2xl"
            type="primary"
            variant="outlined"
            name="Start a consultation"
          >
            Start a consultation
          </Button>
        </Link>
      </Flex>
    </Flex>
  );
};

export default Landing;
