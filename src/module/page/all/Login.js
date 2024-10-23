import React, { useState } from "react";
import { Form, Input, Button, Typography, message } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../../utils/form/api";
import "../../theme/css/buttons.css";
import "../../theme/css/texts.css";

const { Link } = Typography;

const Login = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const redirectToHome = () => {
    navigate("/");
  };

  if (localStorage.getItem("jwtToken")) {
    redirectToHome();
  }

  const onSubmit = async () => {
    try {
      // const response = await axios.post("http://202.44.40.169:8788/auth/login", {
      //   username,
      //   password,
      // });
      const response = await axios.post("http://localhost:8788/auth/login", {
        username,
        password,
      });

      if (response && response.data && response.status === 200) {
        const { username, role, jwtToken } = response.data;
        let level = role;
        if (role == "teacher") {
          level = await api.getlevel(username);
          if (level.status === 200) {
            level = level.data.level;
          } else {
            level = "teacher";
          }
        }
        console.log("Login success:", username, role, level, jwtToken);

        onLoginSuccess({ username, role, level, jwtToken });
        redirectToHome();
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setError("Invalid username or password");
      message.error("Invalid username or password");
    }
  };

  return (
    <center>
      <div
        // style={{
        //   width: 300,
        //   marginTop: "2rem",
        //   padding: "2rem",
        //   border: "1px solid #ccc",
        //   borderRadius: "8px",
        // }}
        style={{
          margin: "auto",
          padding: 40,
          backgroundColor: "#fff",
          borderRadius: 10,
          maxWidth: 350,
          border: "2px solid #ffd28f", // กำหนดกรอบสีส้มอ่อน
          backgroundColor: "#fff5e6", // พื้นหลังสีส้มอ่อน
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // เพิ่มเงาให้กรอบ
        }}
      >
        <Form onFinish={onSubmit}>
          <Typography.Title level={4}>ICIT Account Login</Typography.Title>
          <Form.Item
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input
              placeholder="ICIT Account"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Item>
          <Link
            href="https://account.kmutnb.ac.th/web/recovery/index"
            target="_blank"
            style={{
              display: "block",
              marginBottom: "1rem",
              color: "#EB6725",
              fontWeight: "bold",
            }}
          >
            <u>Forgot ICIT Account Password</u>
          </Link>
          <Button className="All-button" type="primary" htmlType="submit" block>
            Sign in
          </Button>
          {error && (
            <Typography.Text type="danger" style={{ marginTop: "1rem" }}>
              {error}
            </Typography.Text>
          )}
        </Form>
      </div>
    </center>
  );
};

export default Login;
