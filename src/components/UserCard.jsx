import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { useState, useRef, useEffect } from "react";

const UserCard = ({ user, onCardRemoved }) => {
  const { _id, firstName, lastName, photoUrl, age, gender, about, skills = [] } = user;
  const dispatch = useDispatch();
  
  // Refs and state for swipe functionality
  const cardRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [offsetX, setOffsetX] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState(null);
  const [swipeComplete, setSwipeComplete] = useState(false);
  
  // Constants for swipe thresholds
  const SWIPE_THRESHOLD = 100; // px to determine a successful swipe
  const MAX_ROTATION = 30; // max rotation in degrees

  const handleSendRequest = async (status, userId) => {
    try {
      await axios.post(
        BASE_URL + "/request/send/" + status + "/" + userId,
        {},
        { withCredentials: true }
      );
      
      // Notify parent component that this card is being removed
      if (onCardRemoved) {
        onCardRemoved(userId);
      }
    } catch (err) {
      console.error("Error sending request:", err);
    }
  };
  
  // Touch/Mouse event handlers
  const handleDragStart = (clientX) => {
    setIsDragging(true);
    setStartX(clientX);
  };
  
  const handleDragMove = (clientX) => {
    if (!isDragging) return;
    
    const newOffsetX = clientX - startX;
    setOffsetX(newOffsetX);
    
    // Update swipe direction for visual feedback
    if (newOffsetX > 20) {
      setSwipeDirection("right");
    } else if (newOffsetX < -20) {
      setSwipeDirection("left");
    } else {
      setSwipeDirection(null);
    }
  };
  
  const handleDragEnd = () => {
    if (!isDragging) return;
    
    if (offsetX > SWIPE_THRESHOLD) {
      // Right swipe - Connect
      setSwipeComplete(true);
      setTimeout(() => handleSendRequest("interested", _id), 300);
    } else if (offsetX < -SWIPE_THRESHOLD) {
      // Left swipe - Skip
      setSwipeComplete(true);
      setTimeout(() => handleSendRequest("ignored", _id), 300);
    } else {
      // Reset if swipe was not decisive
      setOffsetX(0);
      setSwipeDirection(null);
    }
    
    setIsDragging(false);
  };
  
  // Mouse event handlers
  const handleMouseDown = (e) => {
    handleDragStart(e.clientX);
  };
  
  const handleMouseMove = (e) => {
    handleDragMove(e.clientX);
  };
  
  const handleMouseUp = () => {
    handleDragEnd();
  };
  
  const handleMouseLeave = () => {
    if (isDragging) {
      handleDragEnd();
    }
  };
  
  // Touch event handlers
  const handleTouchStart = (e) => {
    handleDragStart(e.touches[0].clientX);
  };
  
  const handleTouchMove = (e) => {
    handleDragMove(e.touches[0].clientX);
  };
  
  const handleTouchEnd = () => {
    handleDragEnd();
  };
  
  // Clean up event listeners
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    
    const handleWindowMouseUp = () => {
      if (isDragging) {
        handleDragEnd();
      }
    };
    
    window.addEventListener('mouseup', handleWindowMouseUp);
    
    return () => {
      window.removeEventListener('mouseup', handleWindowMouseUp);
    };
  }, [isDragging]);
  
  // Calculate card styles based on drag state
  const getCardStyle = () => {
    if (!isDragging && !swipeComplete) return {};
    
    const rotation = (offsetX / SWIPE_THRESHOLD) * MAX_ROTATION;
    const rotationClamped = Math.max(Math.min(rotation, MAX_ROTATION), -MAX_ROTATION);
    
    return {
      transform: swipeComplete 
        ? `translateX(${offsetX > 0 ? '120%' : '-120%'}) rotate(${rotationClamped}deg)` 
        : `translateX(${offsetX}px) rotate(${rotationClamped}deg)`,
      transition: swipeComplete ? 'transform 0.5s ease' : 'none'
    };
  };

  return (
    <div 
      className="card-hover-effect w-full max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden animate-fadeIn relative cursor-grab"
      ref={cardRef}
      style={getCardStyle()}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Swipe Indicator Overlays */}
      {swipeDirection === "right" && (
        <div className="absolute inset-0 bg-green-500/20 z-10 flex items-center justify-center">
          <div className="bg-green-500 text-white px-6 py-3 rounded-full font-bold transform -rotate-12 scale-110">
            CONNECT
          </div>
        </div>
      )}
      {swipeDirection === "left" && (
        <div className="absolute inset-0 bg-red-500/20 z-10 flex items-center justify-center">
          <div className="bg-red-500 text-white px-6 py-3 rounded-full font-bold transform rotate-12 scale-110">
            SKIP
          </div>
        </div>
      )}
      
      {/* Swipe Instructions */}
      <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-black/60 text-white text-xs py-1 px-3 rounded-full z-20 whitespace-nowrap">
        Swipe right to connect, left to skip
      </div>

      <div className="relative">
        <img 
          src={photoUrl || "https://via.placeholder.com/400x300?text=No+Photo"} 
          alt={`${firstName}'s profile`}
          className="w-full h-64 object-cover" 
          draggable="false"
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
