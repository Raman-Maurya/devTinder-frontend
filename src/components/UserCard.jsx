import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";

const UserCard = ({ user }) => {
  const { _id, firstName, lastName, photoUrl, age, gender, about, skills = [] } = user;
  const dispatch = useDispatch();

  const handleSendRequest = async (status, userId) => {
    try {
      const res = await axios.post(
        BASE_URL + "/request/send/" + status + "/" + userId,
        {},
        { withCredentials: true }
      );
      dispatch(removeUserFromFeed(userId));
    } catch (err) {
      console.error("Error sending request:", err);
    }
  };

  return (
    <div className="card-hover-effect w-full max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden animate-fadeIn">
      <div className="relative">
        <img 
          src={photoUrl || "https://via.placeholder.com/400x300?text=No+Photo"} 
          alt={`${firstName}'s profile`}
          className="w-full h-64 object-cover" 
        />
        <div className="absolute bottom-0 left-0 right-0 px-6 py-4 bg-gradient-to-t from-black/70 to-transparent">
          <h2 className="text-2xl font-bold text-white mb-1">
            {firstName} {lastName}
            {gender && (
              <span className="ml-2 text-sm bg-indigo-600 text-white px-2 py-1 rounded-full">
                {gender}
              </span>
            )}
          </h2>
          {age && <p className="text-gray-200 text-sm">Age: {age}</p>}
        </div>
      </div>
      
      <div className="p-6">
        {about && (
          <div className="mb-4">
            <h3 className="text-gray-700 font-medium mb-2">About</h3>
            <p className="text-gray-600">{about}</p>
          </div>
        )}
        
        {skills && skills.length > 0 && (
          <div className="mb-4">
            <h3 className="text-gray-700 font-medium mb-2">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs font-medium rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex justify-between mt-6 pt-4 border-t border-gray-100">
          <button
            className="flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            onClick={() => handleSendRequest("ignored", _id)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Skip
          </button>
          
          <button
            className="flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            onClick={() => handleSendRequest("interested", _id)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
            Connect
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;