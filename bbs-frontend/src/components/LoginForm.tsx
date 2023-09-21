import React, { useState } from "react";
import "../styles/LoginAndRegister.css";

interface LoginFormProps {
    handleLogin: (e: React.FormEvent) => Promise<void>;
    email: string;
    setEmail: (email: string) => void;
    password: string;
    setPassword: (password: string) => void;
  }

const LoginForm: React.FC<LoginFormProps> = (props: LoginFormProps) => {
  const {handleLogin, email, setEmail, password, setPassword} = props
  return (
    <div className={"form-container"}>
      <div className={"form-box"}>
        <h2 className={"form-title"}>Login</h2>
        <form onSubmit={handleLogin}>
          <div className={"form-group"}>
            <label className={"form-label"}>Email</label>
            <input
              className={"form-control"}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className={"form-group"}>
            <label className={"form-label"}>Password</label>
            <input
              className={"form-control"}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button className={"submit-button"} type="submit">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
