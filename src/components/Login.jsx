import { useState } from "react";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

const Login = () => {
    // Create state
    const [emailId, setEmailId] = useState("raman@gmail.com");
    const [password, setPassword] = useState("Raman@123");
    const [showPassword, setShowPassword] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [isLoginForm, setIsLoginForm] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [error, setError] = useState("");

    const handleSignup = async () => {
        if (!firstName || !emailId || !password) {
            setError("Please fill in all fields");
            return;
        }
        
        setIsLoading(true);
        try {
            const res = await axios.post(BASE_URL + "/signup", {
                firstName,
                emailId,
                password,
            }, { withCredentials: true });
            dispatch(addUser(res.data.data));
            navigate("/");
            return navigate(0);
        } catch (err) {
            // Handle error response properly to ensure we only store strings
            if (typeof err?.response?.data === 'object' && err?.response?.data?.message) {
                setError(err.response.data.message);
            } else if (typeof err?.response?.data === 'string') {
                setError(err.response.data);
            } else {
                setError("An error occurred during signup. Please try again.");
            }
            console.log(err);
        } finally {
            setIsLoading(false);
        }
    }

    const handleLogin = async () => {
        if (!emailId || !password) {
            setError("Please fill in all fields");
            return;
        }
        
        setIsLoading(true);
        try {
            const res = await axios.post(BASE_URL + "/login", {
                emailId,
                password,
            }, { withCredentials: true });
            dispatch(addUser(res.data));
            navigate("/");
            return navigate(0);
        } catch (err) {
            // Handle error response properly to ensure we only store strings
            if (typeof err?.response?.data === 'object' && err?.response?.data?.message) {
                setError(err.response.data.message);
            } else if (typeof err?.response?.data === 'string') {
                setError(err.response.data);
            } else {
                setError("An error occurred during login. Please try again.");
            }
            console.log(err);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex justify-center items-center min-h-[80vh] px-4 py-12 animate-fadeIn">
            <div className="card w-full max-w-md overflow-hidden bg-white">
                <div className="p-8 md:p-10">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-indigo-600 mb-2">
                            {isLoginForm ? "Welcome Back" : "Join Dev Tinder"}
                        </h2>
                        <p className="text-gray-600">
                            {isLoginForm ? "Sign in to your account" : "Create your developer profile"}
                        </p>
                    </div>

                    <div className="space-y-6">
                        {!isLoginForm && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="firstName">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    id="firstName"
                                    value={firstName}
                                    placeholder="Enter your name"
                                    className="input-field w-full"
                                    onChange={(e) => setFirstName(e.target.value)}
                                />
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={emailId}
                                placeholder="Enter your email"
                                className="input-field w-full"
                                onChange={(e) => setEmailId(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    value={password}
                                    placeholder="Enter password"
                                    className="input-field w-full pr-10"
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        )}

                        <button
                            className={`w-full btn-primary py-3 flex justify-center items-center ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            onClick={isLoginForm ? handleLogin : handleSignup}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing...
                                </>
                            ) : (
                                isLoginForm ? "Sign In" : "Create Account"
                            )}
                        </button>
                    </div>

                    <div className="mt-8 text-center">
                        <button
                            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium transition-colors"
                            onClick={() => {
                                setIsLoginForm((value) => !value);
                                setError("");
                            }}
                        >
                            {isLoginForm ?
                                "New to Dev Tinder? Create an account" :
                                "Already have an account? Sign in"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;