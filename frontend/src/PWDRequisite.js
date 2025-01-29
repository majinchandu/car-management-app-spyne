import { ImCross } from "react-icons/im";
import { FaCheck } from "react-icons/fa"
const PWDRequisite = (props) => {
    return (
        <div className="message vagabond "  >
            <p style={{fontWeight:"500"}} className={props.capsLetterFlag}>Must contain 1 Capital Letter {props.oneCheck ? <FaCheck /> : <ImCross />} </p>
            <p style={{fontWeight:"500"}} className={props.numberFlag}>Must contain number {props.twoCheck ? <FaCheck /> : <ImCross />} </p>
            <p style={{fontWeight:"500"}} className={props.pwdLengthFlag}>Must be 8 Chars long {props.threeCheck ? <FaCheck /> : <ImCross />}</p>
            <p style={{fontWeight:"500"}} className={props.specialCharFlag}> Must contain special character {props.fourCheck ? <FaCheck /> : <ImCross />} </p>
        </div>
    );
};

export default PWDRequisite;