import React, { useState , useEffect , useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
const Login = (props) => {

    
    const [email, setemail] = useState("")
    const [password, setpassword] = useState("")
    // const [name, setname] = useState("")
    const [success2, setsuccess2] = useState(props.success)
    const [err, seterr] = useState("")
    const [Message, setMessage] = useState("")
    const Navigate = useNavigate()

    useEffect(() => {
        const authh = localStorage.getItem("user")
        if (authh) {
            Navigate('/userData');
        }
    })

    function isValidEmail(email) {
        return /\S+@\S+\.\S+/.test(email);
      }


    async function handleSubmit(e) {
        e.preventDefault();
        console.log('cbgdguwd');
        console.log(email, password);
        let resulttt = await fetch('https://car-management-app-spyne-backend.onrender.com/loginUser', {  // resulttt ke andar user naam ki uski saari details aajaengi aur uske corresponding unique token aayega 
            method: 'POST',
            body: JSON.stringify({email, password }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        resulttt = await resulttt.json()
        console.log(resulttt, "suraj");
        if (resulttt.auth ) { // agar result mila to chalao  ||    aur comparison kara rhe hai authToken ke basis pe 
            // props.success = true;
            setsuccess2(true);
            console.log('hulk');
            localStorage.setItem("user", JSON.stringify(resulttt)) //storage me uss user ko store kardo dobara se 
            // localStorage.setItem("token", JSON.stringify(resulttt.auth))
            Navigate('/landingPage');
        } else {
            console.log('hulk2');
            alert('please enter correct details')// agar user hi na mila ho toh
        }
        console.log('chandu is a goodboy');

    }

    return (
        <div style={{backgroundImage: `url("https://i.pinimg.com/474x/b3/fb/24/b3fb24b01bb8369921da7516d9a11774.jpg")` , backgroundSize: "cover" , backgroundRepeat: "no-repeat" , height:"100vh"}}>
            <div className="container" >
                <div className="row">
                    <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
                        <div className="card border-0 shadow rounded-3 my-5">
                            <div className="card-body p-4 p-sm-5">
                                <h5 className="card-title text-center mb-5 fw-light fs-2">Sign In</h5>
                                <form onSubmit={handleSubmit}>
                                    <div className="form-floating mb-3">
                                        <input
                                            type="email"
                                            className="form-control"
                                            id="floatingInput"
                                            placeholder="name@example.com"
                                            value={email}
                                            required
                                            onChange={(e) => setemail(e.target.value)}
                                        />
                                        <label htmlFor="floatingInput">Email address</label>
                                    </div>
                                    <div className="form-floating mb-3">
                                        <input
                                            type="password"
                                            className="form-control"
                                            id="floatingPassword"
                                            placeholder="Password"
                                            value={password}
                                            required
                                            onChange={(e) => setpassword(e.target.value)}
                                        />
                                        <label htmlFor="floatingPassword">Password</label>
                                    </div>
                                    <div className="d-grid">
                                        <button
                                            className="btn btn-primary btn-login text-uppercase fw-bold"
                                            type="submit"
                                        >
                                            Sign in
                                        </button>
                                    </div>
                                    <h7>
                                        Don't have an account?{" "}
                                        <Link to="/register" style={{ textDecoration: "none" }}>
                                            Sign Up
                                        </Link>
                                    </h7>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
