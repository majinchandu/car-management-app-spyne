import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
function Protected(props) {
    // const { Component,setworkvalue,workvalue } = props;
    const navigate = useNavigate();
    useEffect(() => {
        let auth = localStorage.getItem('user');
        if (!auth) {
            navigate('/login');
        }
    });
    return (
        <div>
            {props.Component}
        </div>
    )
}
export default Protected;