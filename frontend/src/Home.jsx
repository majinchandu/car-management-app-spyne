import React from 'react';
import { Link } from 'react-router-dom';
// import 'bootstrap/dist/css/bootstrap.min.css';

const Home = () => {
  const containerStyle = {
    // backgroundImage: 'url("https://images.unsplash.com/photo-1506748686214-e9df14d4d9d9")',
    backgroundImage: 'url("https://i.pinimg.com/736x/65/00/a9/6500a980e727b2c471eaf55d6870002f.jpg")',
    backgroundSize: 'cover',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  };

  const headingStyle = {
    color: '#ffffff',
    fontSize: '48px',
    marginBottom: '50px',
    textShadow: '10px 10px 30px #000000'
  };

  const buttonStyle = {
    width: '200px',
    height: '60px',
    fontSize: '24px',
    margin: '10px'
  };

  return (
    <div style={containerStyle}>
      <h1 style={headingStyle}>Car Management Application</h1>
      <div>
        <Link to = '/login'><button type="button" className="btn btn-primary" style={buttonStyle}>Login</button></Link>
        <Link to = '/register' ><button type="button" className="btn btn-warning" style={buttonStyle}>SignUp</button></Link>
      </div>
    </div>
  );
};
 