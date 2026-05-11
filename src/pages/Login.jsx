import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("ichchhit6140sharma@gmail.com");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email: email.trim().toLowerCase(),
            password: password.trim(),
          }),
        }
      );

      const data = await res.json();

      console.log("LOGIN RESPONSE:", data);

      if (!res.ok) {
        alert(data.message || "Login failed");
        return;
      }

      localStorage.setItem("token", data.token);

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      // ================= ADMIN =================

      if (data.user.role === "admin") {
        navigate("/admin");
      }

      // ================= NORMAL USER =================

      else {
        navigate("/profiles");
      }
    } catch (error) {
      console.log("FRONTEND LOGIN ERROR:", error);

      alert(
        "Server not connected. Check backend is running."
      );
    }
  };

  return (
    <div style={pageStyle}>
      <form onSubmit={handleLogin} style={formStyle}>
        <h1 style={headingStyle}>NETSTREAM</h1>

        <p style={subHeadingStyle}>
          Unlimited movies, trailers & streaming
        </p>

        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
          required
        />

        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
          required
        />

        <button type="submit" style={btnStyle}>
          Sign In
        </button>

        <p style={registerTextStyle}>
          New here?{" "}

          <span
            style={registerLinkStyle}
            onClick={() => navigate("/register")}
          >
            Create account
          </span>
        </p>
      </form>
    </div>
  );
}

/* ================= STYLES ================= */

const pageStyle = {
  height: "100vh",

  display: "flex",

  justifyContent: "center",

  alignItems: "center",

  background:
    "linear-gradient(to bottom, rgba(0,0,0,0.75), rgba(0,0,0,0.9)), url('https://assets.nflxext.com/ffe/siteui/vlv3/9f0f67d5-0e85-4f56-b57d-1c1f1d233d7f/0f8f3b2f-c4e0-4f4b-a79d-7e7199f2e5a5/IN-en-20240226-popsignuptwoweeks-perspective_alpha_website_large.jpg')",

  backgroundSize: "cover",

  backgroundPosition: "center",

  fontFamily: "Arial, sans-serif",
};

const formStyle = {
  display: "flex",

  flexDirection: "column",

  gap: "18px",

  background: "rgba(0,0,0,0.78)",

  padding: "45px",

  borderRadius: "10px",

  width: "360px",

  backdropFilter: "blur(5px)",
};

const headingStyle = {
  color: "#e50914",

  fontSize: "42px",

  fontWeight: "900",

  marginBottom: "0",

  letterSpacing: "1px",
};

const subHeadingStyle = {
  color: "#d2d2d2",

  marginTop: "-8px",

  marginBottom: "18px",

  fontSize: "15px",
};

const inputStyle = {
  padding: "14px",

  borderRadius: "5px",

  border: "none",

  background: "#333",

  color: "white",

  fontSize: "15px",

  outline: "none",
};

const btnStyle = {
  padding: "14px",

  background: "#e50914",

  color: "white",

  border: "none",

  borderRadius: "5px",

  cursor: "pointer",

  fontWeight: "bold",

  fontSize: "16px",
};

const registerTextStyle = {
  color: "#bbb",

  textAlign: "center",

  fontSize: "14px",
};

const registerLinkStyle = {
  color: "#e50914",

  fontWeight: "bold",

  cursor: "pointer",
};

export default Login; 