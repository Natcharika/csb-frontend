import React, { useState } from "react";
import { Form, Input, Button, Typography, message } from "antd";
import axios from "axios";

const { Link } = Typography;

const Login = ({ onLoginSuccess }) => {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onSubmit = async () => {
    try {
      const response = await axios.post("http://localhost:8788/auth/login", {
        username,
        password,
      });

      if (response && response.data && response.status === 200) {
        const { username, role, level, jwtToken } = response.data;
        localStorage.setItem("username", username);
        localStorage.setItem("role", role);
        localStorage.setItem("level", level);
        localStorage.setItem("jwtToken", jwtToken);
          // if (role === "students") {
          //   const S_id = userInfo.username.startsWith("s") ? userInfo.username.substring(1) : userInfo.username;
          //   // const studentPayload = {
          //   //   S_id: userInfo.username,
          //   //   S_name: userInfo.displayname,
          //   //   S_firstname_en: userInfo.firstname_en,
          //   //   S_lastname_en: userInfo.lastname_en,
          //   //   S_email: userInfo.email,
          //   //   S_account_type: userInfo.account_type,
          //   //   S_status: true,
          //   // };
          //   localStorage.setItem("S_id", userInfo.username)
          //   // window.location.href = "http://localhost:3000/special-project-1/provider";

          // } else if (userInfo.username === "nateep") {
          //   const AdminPayload = {
          //       A_id: userInfo.username,
          //       A_name: userInfo.displayname,
          //       A_firstname_en: userInfo.firstname_en,
          //       A_lastname_en: userInfo.lastname_en,
          //       A_email: userInfo.email,
          //       A_account_type: userInfo.account_type,
          //       A_status: true,

          //   };
          //   await axios.post("http://localhost:8788/admins", AdminPayload);
          //   localStorage.setItem("A_id", userInfo.username);
          //   window.location.href = "http://localhost:3000/exam-management";

          // } else if (userInfo.account_type === "personel") {
          //   const TeacherPayload = {
          //     T_id: userInfo.username,
          //     T_name: userInfo.displayname,
          //     T_firstname_en: userInfo.firstname_en,
          //     T_lastname_en: userInfo.lastname_en,
          //     T_email: userInfo.email,
          //     T_account_type: userInfo.account_type,
          //     T_status: true,
          //   };
          //   await axios.post("http://localhost:8788/teachers", TeacherPayload);
          //   localStorage.setItem("T_id", userInfo.username);
          //   window.location.href = "http://localhost:3000/approve/approve-csb03";
          // }

      }
    } catch (error) {
      console.error("Error logging in:", error);
      setError("Invalid username or password");
      message.error("Invalid username or password");
    }
  };
  
    return (
      <center>
        <div style={{ width: 300, marginTop: "2rem", padding: "2rem", border: "1px solid #ccc", borderRadius: "8px" }}>
          <Form onFinish={onSubmit}>
            <Typography.Title level={4}>ICIT Account Login</Typography.Title>
            <Form.Item name="username" rules={[{ required: true, message: "Please input your username!" }]}>
              <Input
                placeholder="ICIT Account"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Form.Item>
            <Form.Item name="password" rules={[{ required: true, message: "Please input your password!" }]}>
              <Input.Password
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Item>
            <Link
              href="https://account.kmutnb.ac.th/web/recovery/index"
              target="_blank"
              style={{ display: "block", marginBottom: "1rem", color: "#EB6725", fontWeight: "bold" }}
            >
              Forgot ICIT Account Password
            </Link>
            <Button type="primary" htmlType="submit" block>
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
