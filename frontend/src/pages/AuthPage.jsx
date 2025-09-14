import { useState } from "react";
import API from "../api";

export default function AuthPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    if (isRegister) {
      // Register API
      const res = await API.post("/auth/register/", form);
      console.log("Register response:", res.data);
      alert("Registration successful! Please login.");
      setIsRegister(false);
      setForm({ name: "", email: "", password: "" });
    } else {
      // Login API
      const res = await API.post("/auth/login/", {
        email: form.email,
        password: form.password,
      });
      console.log("Login response:", res.data);
      
      // Save JWT token in localStorage
      localStorage.setItem("token", res.data.token);
      alert("Login successful!");
      
      // TODO: redirect to dashboard / profile page
    }
  } catch (err) {
    console.error(err.response || err);
    alert(err.response?.data?.error || "Error occurred");
  }
};

  const containerStyle = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px'
  };

  const cardStyle = {
    position: 'relative',
    width: '400px',
    height: '500px',
    backgroundColor: 'white',
    borderRadius: '20px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
    overflow: 'hidden'
  };

  const slidingPanelStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '200%',
    height: '100%',
    display: 'flex',
    transition: 'transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
    transform: isRegister ? 'translateX(-50%)' : 'translateX(0%)'
  };

  const panelStyle = {
    width: '50%',
    padding: '60px 40px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: 'white'
  };

  const titleStyle = {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '30px',
    textAlign: 'center'
  };

  const inputStyle = {
    width: '100%',
    padding: '15px',
    marginBottom: '20px',
    border: '2px solid #e1e1e1',
    borderRadius: '10px',
    fontSize: '16px',
    outline: 'none',
    transition: 'border-color 0.3s ease',
    backgroundColor: '#f8f9fa'
  };

  const inputFocusStyle = {
    borderColor: '#667eea'
  };

  const buttonStyle = {
    width: '100%',
    padding: '15px',
    backgroundColor: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginTop: '10px'
  };

  const buttonHoverStyle = {
    backgroundColor: '#5a6fd8',
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)'
  };

  const linkStyle = {
    textAlign: 'center',
    marginTop: '20px',
    color: '#666'
  };

  const linkButtonStyle = {
    color: '#667eea',
    fontWeight: 'bold',
    cursor: 'pointer',
    textDecoration: 'none',
    transition: 'color 0.3s ease'
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={slidingPanelStyle}>
          {/* Login Panel */}
          <div style={panelStyle}>
            <h2 style={titleStyle}>Welcome Back</h2>
            
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              style={inputStyle}
              value={form.email}
              onChange={handleChange}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#e1e1e1'}
              required
            />
            
            <input
              type="password"
              name="password"
              placeholder="Password"
              style={inputStyle}
              value={form.password}
              onChange={handleChange}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#e1e1e1'}
              required
            />
            
            <button
              onClick={handleSubmit}
              style={buttonStyle}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#5a6fd8';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#667eea';
                e.target.style.transform = 'translateY(0px)';
                e.target.style.boxShadow = 'none';
              }}
            >
              Sign In
            </button>
            
            <div style={linkStyle}>
              Don't have an account?{" "}
              <span
                style={linkButtonStyle}
                onClick={() => setIsRegister(true)}
                onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
              >
                Create Account
              </span>
            </div>
          </div>

          {/* Register Panel */}
          <div style={panelStyle}>
            <h2 style={titleStyle}>Create Account</h2>
            
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              style={inputStyle}
              value={form.name}
              onChange={handleChange}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#e1e1e1'}
              required
            />
            
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              style={inputStyle}
              value={form.email}
              onChange={handleChange}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#e1e1e1'}
              required
            />
            
            <input
              type="password"
              name="password"
              placeholder="Password"
              style={inputStyle}
              value={form.password}
              onChange={handleChange}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#e1e1e1'}
              required
            />
            
            <button
              onClick={handleSubmit}
              style={buttonStyle}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#5a6fd8';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#667eea';
                e.target.style.transform = 'translateY(0px)';
                e.target.style.boxShadow = 'none';
              }}
            >
              Create Account
            </button>
            
            <div style={linkStyle}>
              Already have an account?{" "}
              <span
                style={linkButtonStyle}
                onClick={() => setIsRegister(false)}
                onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
              >
                Sign In
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}