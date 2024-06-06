import React, { useEffect, useState } from "react";
import { Box, Button, TextField, Typography, Container } from "@mui/material";
import { styled } from "@mui/system";
import SwipeableViews from "react-swipeable-views";
import { useNavigate } from "react-router-dom";

const FormContainer = styled(Box)(({ theme }) => ({
  backgroundColor: "#fff",
  borderRadius: 10,
  boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)",
  padding: theme.spacing(4),
  maxWidth: 400,
  margin: "auto",
}));

const LoginForm = ({ toggleForm, setOpen, setMsg }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!email || !password) {
      s;
      setOpen(true);
      setMsg("All fields are required");
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/user/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        navigate("/");
      } else {
        setOpen(true);
        setMsg(data.message || "Login failed");
      }
    } catch (error) {
      setOpen(true);
      setMsg("Something went wrong");
      console.log(error);
    }
  };

  return (
    <>
      <Typography
        variant="h5"
        gutterBottom
        textAlign={"center"}
        fontWeight={700}
      >
        Login
      </Typography>
      <TextField
        label="Email Address"
        fullWidth
        margin="normal"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        label="Password"
        type="password"
        fullWidth
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleSubmit}
      >
        Login
      </Button>
      <Typography variant="body2" align="center" style={{ marginTop: "16px" }}>
        Not a member? <Button onClick={() => toggleForm(1)}>Signup now</Button>
      </Typography>
      <Typography marginTop={1} color={"GrayText"} textAlign={"center"}>For Demo use demo@gmail.com Psd : demo</Typography>
    </>
  );
};

const SignupForm = ({ toggleForm, setOpen, setMsg }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!email || !password || !confirmPassword) {
      setOpen(true);
      setMsg("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setOpen(true);
      setMsg("Passwords do not match");
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        navigate("/");
      } else {
        setOpen(true);
        setMsg(data.message || "Register failed");
      }
    } catch (error) {
      setOpen(true);
      setMsg("Something went wrong");
      console.log(error);
    }
  };

  return (
    <>
      <Typography
        variant="h5"
        gutterBottom
        textAlign={"center"}
        fontWeight={700}
      >
        Signup
      </Typography>
      <TextField
        label="Email Address"
        fullWidth
        margin="normal"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        label="Password"
        type="password"
        fullWidth
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <TextField
        label="Confirm Password"
        type="password"
        fullWidth
        margin="normal"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleSubmit}
      >
        Signup
      </Button>
      <Typography variant="body2" align="center" style={{ marginTop: "16px" }}>
        Already a member?{" "}
        <Button onClick={() => toggleForm(0)}>Login now</Button>
      </Typography>
    </>
  );
};

const Login = ({ setOpen, setMsg }) => {
  const [formIndex, setFormIndex] = useState(0);

  return (
    <Box
      sx={{
        background:
          "-webkit-linear-gradient(left, #003366,#004080,#0059b3, #0073e6)",
      }}
    >
      <Container>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
        >
          <FormContainer>
            <SwipeableViews index={formIndex} onChangeIndex={setFormIndex}>
              <Box>
                <LoginForm
                  toggleForm={setFormIndex}
                  setOpen={setOpen}
                  setMsg={setMsg}
                />
              </Box>
              <Box>
                <SignupForm
                  toggleForm={setFormIndex}
                  setOpen={setOpen}
                  setMsg={setMsg}
                />
              </Box>
            </SwipeableViews>
          </FormContainer>
        </Box>
      </Container>
    </Box>
  );
};

export default Login;
