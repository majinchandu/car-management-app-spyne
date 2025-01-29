import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PWDRequisite from '../PWDRequisite'
const RegisterUser = () => {

    const [name, setname] = useState("")
    const [email, setemail] = useState("")
    const [password, setpassword] = useState("")
    const navigate = useNavigate();
    const [Error, setError] = useState("")
    const [Error2, setError2] = useState(null)
    const [bool1, setbool1] = useState(false)
    const [bool2, setbool2] = useState(false)
    const [pwdRequiste, setPWDRequisite] = useState(false);
    const [checks, setChecks] = useState({
        capsLetterCheck: false,
        numberCheck: false,
        pwdLengthCheck: false,
        specialCharCheck: false,
    });

    const handleOnChange = (e) => {
        setpassword(e.target.value);
    };

    const handleOnFocus = () => {
        setPWDRequisite(true);
    };

    const handleOnBlur = () => {
        setPWDRequisite(false);
    };

    const handleOnKeyUp = (e) => {
        const { value } = e.target;
        const capsLetterCheck = /[A-Z]/.test(value);
        const numberCheck = /[0-9]/.test(value);
        const pwdLengthCheck = value.length >= 8;
        const specialCharCheck = /[!@#$%^&*]/.test(value);
        setChecks({
            capsLetterCheck,
            numberCheck,
            pwdLengthCheck,
            specialCharCheck,
        });
    };

    function isValidEmail(email) {
        return /\S+@\S+\.\S+/.test(email);
    }


    const validate = (e) => { // dont let first character to be a space 
        if (/^\s/.test(e.target.value))
            e.target.value = '';
        setname(e.target.value);
    };

    const handleEmail = event => {
        if (!isValidEmail(event.target.value)) {
            setbool1(false);
            if (email == "")
                setError('');
            else
                setError("Email is invalid");
        } else {
            setError(null);
            setbool1(true);
        }

        setemail(event.target.value);
    };

    async function collectData(e) {
        if (bool1 && checks.capsLetterCheck &&
            checks.numberCheck &&
            checks.pwdLengthCheck &&
            checks.specialCharCheck && email && name && password) {

            e.preventDefault() // ye bhai humesha daalna iski wajah se code nhi chalega kyunki ispe mai ghanto tak atka rha tha ding ding
            let resultt = await fetch('https://car-management-app-spyne-backend.onrender.com/registerUser', { // connecting frontend with backend
                method: 'POST',// method post hai
                body: JSON.stringify({ email, password, name }),//connecting frontend and backend , jo idhar se data jaaye wo backend me store hojaye aur firr backend me jaake wo data mongoDB me store hojayee
                // ye name ,email,password wala data backend ki body me jaake store ho rha hai
                headers: {
                    'Content-Type': 'application/json'// ratlo
                }
            });
            resultt = await resultt.json()//converting result to json format
            console.log(resultt);
            if (resultt.message) {
                alert('user already exists');
                navigate('/loginUser');
            }
            else {
                localStorage.setItem("user", JSON.stringify(resultt));//user naam ka variable banao localstorage me jisme tum nye user ko store karlo localstorage me
                alert('new user  created successfully')
                navigate('/landingPage')
            }
        }
        else {
            alert("please enter correct details first");
            e.preventDefault()
            // navigate('/');
        }

    }

    return (
        <div style={{ backgroundImage: `url("https://i.pinimg.com/474x/73/93/91/73939130e8f6bdc984881bfb8e34c22c.jpg")`, backgroundSize: "cover", backgroundRepeat: "no-repeat", height: "100vh" }}>
            <div class="container" >
                <div class="row">
                    <div class="col-sm-9 col-md-7 col-lg-5 mx-auto">
                        <div class="card border-0 shadow rounded-3 my-5">
                            <div class="card-body p-4 p-sm-5">
                                <h5 class="card-title text-center mb-5 fw-light fs-2">Sign Up</h5>
                                <form onSubmit={collectData}>
                                    <div class="form-floating mb-3">
                                        <input type="text" class="form-control" id="floatingInput" placeholder="Your Name" value={name} onChange={validate} />
                                        <label for="floatingInput">Name</label>
                                    </div>
                                    <div class="form-floating mb-3">
                                        <input type="email" class="form-control" id="floatingInput" placeholder="name@example.com" value={email} onChange={handleEmail} />
                                        <label for="floatingInput">Email address</label>
                                    </div>
                                    <div class="form-floating mb-3">
                                        <input type="password" class="form-control" id="floatingPassword" placeholder="Password" value={password} onChange={handleOnChange} onFocus={handleOnFocus} onBlur={handleOnBlur} onKeyUp={handleOnKeyUp} />
                                        <label for="floatingPassword">Password</label>
                                    </div>
                                    {pwdRequiste ? (
                                        <PWDRequisite
                                            capsLetterFlag={checks.capsLetterCheck ? "valid" : "invalid"}
                                            numberFlag={checks.numberCheck ? "valid" : "invalid"}
                                            pwdLengthFlag={checks.pwdLengthCheck ? "valid" : "invalid"}
                                            specialCharFlag={checks.specialCharCheck ? "valid" : "invalid"}
                                            oneCheck={checks.capsLetterCheck}
                                            twoCheck={checks.numberCheck}
                                            threeCheck={checks.pwdLengthCheck}
                                            fourCheck={checks.specialCharCheck}
                                        />
                                    ) : null}
                                    <div class="form-check mb-3">
                                        <input class="form-check-input" type="checkbox" value="" id="rememberPasswordCheck" />
                                        <div class="d-grid">
                                            <button class="btn btn-danger btn-login text-uppercase fw-bold" type="submit" onClick={collectData}>Sign
                                                Up</button>
                                        </div>
                                    </div>
                                    <h7>
                                        Have an account?{" "}
                                        <Link to="/login" style={{ textDecoration: "none" }}>
                                            Sign In
                                        </Link>
                                    </h7>
                                    {/* <h7> Dont , have an account? <Link to='/signup' style={{ textDecoration: "none" }}>Sign Up</Link></h7> */}
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RegisterUser
