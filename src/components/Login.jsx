import { useState } from "react";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
const Login = () => {

    //create state
    const[emailId, setEmailId] = useState("");
    const[password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const[firstName, setFirstName] = useState("");
    const[isLoginForm, setIsLoginForm] = useState(false)

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const[error,setError] = useState("");

  const handleSignup = async () => {
    try {
      const res = await axios.post(BASE_URL + "/signup", {
        firstName,
        emailId,
        password,
      },{withCredentials:true} )
      dispatch(addUser(res.data.data));
      navigate("/");
      return navigate(0);
    } catch (err) {
      setError(err?.response?.data);

      console.log(err);
      
    }
  }

const handleLogin = async ()=>{
   try{ 
    const res = await axios.post(BASE_URL+"/login",{
        emailId,
        password,
    },{withCredentials:true});
    //console.log(res.data);
    dispatch(addUser(res.data));
    navigate("/");
      return navigate(0);
}catch(err){
  setError(err?.response?.data);
        console.log(err);
    }
}

    return (
        <div className="flex justify-center my-10">
        <div className="card bg-primary text-primary-content w-96 ">
        <div className="card-body">
          <h2 className="card-title justify-center">{isLoginForm? "Login":"Sign Up"}</h2>
          <div>
      {!isLoginForm && (    <label className="form-control w-full max-w-xs my-3">
  <input type="text" value={firstName} placeholder="Enter firstname" className="input input-bordered w-full max-w-xs"
  onChange={(e)=>setFirstName(e.target.value)} />
</label>)}
          <label className="form-control w-full max-w-xs my-3">
  <input type="text" value={emailId} placeholder="Enter Email" className="input input-bordered w-full max-w-xs"
  onChange={(e)=>setEmailId(e.target.value)} />
</label>
<label className="form-control w-full max-w-xs my-3 relative">
      <input
        type={showPassword ? "text" : "password"}
        value={password}
        placeholder="Enter password"
        className="input input-bordered w-full max-w-xs pr-10"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        type="button"
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </label>

          </div>
          <p className="text-red-900"> {error}</p>
          <div className="card-actions justify-center">
            <button className="btn" onClick={isLoginForm? handleLogin:handleSignup}>{isLoginForm ? "Login":"Sign up"}</button>
          </div>
          <p className="m-auto cursor-pointer" onClick={()=>setIsLoginForm((value)=>!value)}> 
            {isLoginForm ? "New User? SignUp here": 
            "Existing User? Login here"}</p>
        </div>
      </div>
      </div>
    )
}
export default Login;