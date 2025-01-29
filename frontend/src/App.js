import logo from './logo.svg';
import './App.css';
import Home from './Home';
import {  BrowserRouter as Router, Routes , Route } from 'react-router-dom';
import Login from './Pages/Login';
import RegisterUser from './Pages/RegisterUser';
import LandingPage from './Pages/LandingPage';
import CarDetail from './Pages/CarDetail';
import Protected from './Pages/Protected';
import NotFound404 from './NotFound404';
function App() {
  return (
    <div className="App">
      {/* <h1>hello world</h1> */}
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element = {<RegisterUser />} />
          <Route path="*" element={<NotFound404 />} />
          <Route path = '/landingPage' element = {<Protected Component = {<LandingPage />} />} />
          <Route path = '/carDetail/:carId' element = {<Protected Component = {<CarDetail />} />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
