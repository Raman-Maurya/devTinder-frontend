import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { removeUser } from "../utils/userSlice";

const NavBar = ()=>{
  const user = useSelector((store)=>store.user);   //subscribing to store
 
  console.log(user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const handleLogoClick = (e) => {
    if (!user) {
      e.preventDefault();
      navigate("/login");
    }
  };
   
  const handleLogout = async()=>{
    try{await axios.post(BASE_URL+ "/logout", {}, {
      withCredentials:true,
    })
    dispatch(removeUser());
    return navigate("/login");
  }catch(err){
      console.log(err);
    }
  }

   return(
    <div className="sticky top-0 z-50 backdrop-blur-md bg-white/70 shadow-md">
      <div className="navbar max-w-7xl mx-auto px-4">
        <div className="flex-1">
          <Link to="/login" onClick={handleLogoClick} className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-800 transition-colors">
            <span className="text-2xl font-bold">🚀 Dev Tinder</span>
            <span className="hidden md:inline-block text-sm font-medium bg-indigo-100 text-indigo-800 py-1 px-2 rounded-full">Connect with Developers 💻</span>
          </Link>
        </div>

       
        
        {/* If user is logged in, show navigation options */}
        {user && (
          <div className="flex-none">
            {/* Desktop navigation */}
            <ul className="hidden md:flex items-center space-x-1">
              <li><Link to="/requests" className="nav-link text-gray-700">Requests</Link></li>
              <li><Link to="/premium" className="nav-link text-gray-700">Premium</Link></li>
              <li><Link to="/connections" className="nav-link text-gray-700">Connections</Link></li>
              <li><Link to="/chat" className="nav-link text-gray-700">Chat</Link></li>
            </ul>
            
            {/* Mobile navigation dropdown */}
            <div className="dropdown dropdown-end md:hidden">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle bg-indigo-50 text-indigo-600 hover:bg-indigo-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
                </svg>
              </div>
              <ul tabIndex={0} className="dropdown-content menu menu-sm z-[1] mt-3 w-52 p-2 shadow-lg bg-white rounded-xl">
                <li><Link to="/requests" className="hover:bg-indigo-50">Requests</Link></li>
                <li><Link to="/premium" className="hover:bg-indigo-50">Premium</Link></li>
                <li><Link to="/connections" className="hover:bg-indigo-50">Connections</Link></li>
                <li><Link to="/chat" className="hover:bg-indigo-50">Chat</Link></li>
              </ul>
            </div>
          </div>
        )}
        
        {user && (
          <div className="flex items-center gap-3 ml-4">
            <div className="hidden md:block text-sm font-medium text-gray-700">
              Welcome, <span className="text-indigo-600">{user.firstName}</span>!
            </div>
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar ring-2 ring-indigo-100 hover:ring-indigo-300 transition-all">  
                <div className="w-10 rounded-full">
                  <img
                    alt={`${user.firstName}'s photo`}
                    src={user.photoUrl}
                    className="object-cover" 
                  />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content menu menu-sm z-[1] mt-3 w-56 p-2 shadow-lg bg-white rounded-xl">
                <li className="mb-1">
                  <Link to="/profile" className="flex justify-between items-center hover:bg-indigo-50">
                    <span className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                      Profile
                    </span>
                    <span className="badge bg-indigo-500 text-white border-none">New</span>
                  </Link>
                </li>
                <li>
                  <button onClick={handleLogout} className="flex items-center hover:bg-red-50 text-red-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm11 4a1 1 0 10-2 0v4a1 1 0 102 0V7z" clipRule="evenodd" />
                      <path d="M5 7a1 1 0 011-1h4a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h4a1 1 0 100-2H6z" />
                    </svg>
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export default NavBar;