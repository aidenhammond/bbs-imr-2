import React, { useContext } from 'react';
import "../styles/LoginAndRegister.css"
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import { useState } from 'react';
import { storeToken } from './Security';
import { useAuth } from '../AuthContext';
import { useNavigate } from "react-router-dom"

const LoginAndRegister: React.FC = () => {
  const {login} = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setRoleId } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        const response = await fetch("http://localhost:8000/user/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            alert("Invalid email or password.")
            throw new Error("Invalid email or password.");
        }
  
        const data = await response.json();
        // Save the token and handle redirection or user interface update
        await storeToken(data.token);
        if (data.role_id) {
          setRoleId(data.role_id);
        }
        // handle when token not found
        login(data.token);
        navigate('/')
    } 
    catch (error) {
        console.error("Error logging in:", error);
        // Show an error message to the user
    }
  };


  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
        const response = await fetch("http://localhost:8000/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
          body: JSON.stringify({ email, password }),
        });
        if (!response.ok) {
          alert("Invalid email or password.")
          throw new Error("Error registering user.");
        }
  
        const data = await response.json();
        console.log("User registered successfully:", data);
        login(data.token)
        // Handle redirection or user interface update after successful registration
        navigate('/')
      } catch (error) {
        console.error("Error registering user:", error);
        // Show an error message to the user
      }
  
  };


    return (
      <div className={"container"}>
        <LoginForm handleLogin={handleLogin} email={email} setEmail={setEmail} password={password} setPassword={setPassword}/>
        <RegisterForm handleRegister={handleRegister} email={email} setEmail={setEmail} password={password} setPassword={setPassword}/>
      </div>
    );
  };


export default LoginAndRegister;