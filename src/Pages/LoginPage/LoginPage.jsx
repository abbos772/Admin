import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './Login.css'
const LoginPage = () => {
  const [number, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const loginSubmit = (e) => {
    e.preventDefault();
    setLoading(true); 

    const formData = new FormData();
    formData.append("phone_number", number);
    formData.append("password", password);

    fetch("https://realauto.limsa.uz/api/auth/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        phone_number: number,
        password: password,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Error: ${res.status} - ${res.statusText}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log(data);
        const token = data?.data?.tokens?.accessToken?.token;
    
        if (token) {
          localStorage.setItem("tokenchik", token);
          toast.success("Login successful!");
          navigate("/admin/Buyurtmalar");
        } else {
          throw new Error("Token not found in response.");
        }
      })
      .catch((err) => {
        console.error(err.message);
        toast.error("Login failed: " + err.message);
      })
      .finally(() => {
        setLoading(false);
      });
    }    

  return (
    <>
    <div className="login_flex">
      <form onSubmit={loginSubmit}>
        <h3>Kirish</h3>
        <input
          className="inp"
          type="text"
          placeholder="Login"
          value={number}
          onChange={(e) => setLogin(e.target.value)}
          disabled={loading} 
        />
        <input
        className="inp"
          type="password"
          placeholder="Parol"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading} 
        />
        <button className="btn" type="submit" disabled={loading}>
          {loading ? "Loading..." : "Kirish"}
        </button>
      </form>
     
    </div>
     <ToastContainer position="top-right" autoClose={3000} />
     </>
  );
};

export default LoginPage;
