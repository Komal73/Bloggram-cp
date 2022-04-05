import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiAuth } from "../../services/models/AuthModel";
import toast from "react-hot-toast";
import {
  Button,
  Card,
  CardContent,
  TextField,
  useMediaQuery,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { AuthShapes } from "../common/Shapes";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const PREFIX = "BlogGram-";

  const navigate = useNavigate();

  const onSubmit = (event) => {
    setIsLoading(true);
    localStorage.setItem(`${PREFIX}Email`, email);
    // event.preventDefault();

    const body = {
      email: email,
      password: password,
    };

    console.log(body);

    apiAuth.post(body, "signin").then((res) => {
      console.log(res);
      setIsLoading(false);

      if (res.status === "200") {
        localStorage.setItem(`${PREFIX}Token`, res.token);
        localStorage.setItem(`${PREFIX}UserId`, res.userId);
        localStorage.setItem(`${PREFIX}name`, res.name);
        // sucessNotify("Login succesfulll");
        toast.success("Login successfuly");
        navigate("/dashboard/home");
      } else {
        toast.error(res.message);
      }
    });
  };

  const matches = useMediaQuery("(min-width:600px)");

  return (
    <React.Fragment>
      <AuthShapes />
      <div className="container h-100 p-5 d-flex justify-content-center align-items-center">
        <Card>
          <CardContent sx={{ padding: 4 }}>
            <h3 className="text my-3 text-center">Login</h3>
            <TextField
              label="Email"
              variant="standard"
              sx={{ minWidth: matches ? 450 : 200 }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <br />
            <TextField
              label="Password"
              variant="standard"
              sx={{ minWidth: matches ? 450 : 200 }}
              className="mt-4"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
            />
            <div className="text-center mt-4">
              {isLoading ? (
                <LoadingButton
                  loading
                  loadingIndicator="Loading..."
                  variant="outlined"
                  size="small"
                >
                  Loading
                </LoadingButton>
              ) : (
                <Button onClick={onSubmit} variant="outlined" size="small">
                  Login
                </Button>
              )}
            </div>
            <div className="text-center mt-5">
              Don't have an account? then <Link to="/signup">Signup</Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </React.Fragment>
  );
};

export default Login;
