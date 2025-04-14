import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addFeed, removeUserFromFeed } from "../utils/feedSlice";
import { useEffect, useState } from "react";
import UserCard from "./UserCard";

const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const getFeed = async () => {
    setLoading(true);
    try {
      const res = await axios.get(BASE_URL + "/feed", {
        withCredentials: true,
      });
      dispatch(addFeed(res?.data?.data));
      setCurrentCardIndex(0);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching feed:", err);
      setError("Could not load developer profiles. Please try again later.");
      setLoading(false);
    }
  };

  useEffect(() => {
    getFeed();
  }, []);

  // Handle card removal and show next card
  const handleCardRemoved = (userId) => {
    setIsTransitioning(true);
    
    // Short delay to allow the swipe animation to complete
    setTimeout(() => {
      // Remove the user from the feed in Redux
      dispatch(removeUserFromFeed(userId));
      setIsTransitioning(false);
    }, 300);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600">Finding developers for you...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] px-4">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded w-full max-w-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
        <button 
          onClick={getFeed} 
          className="mt-4 btn-primary"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!feed || feed.length <= 0) {
    return (
      <div className="page-container">
        <div className="max-w-md mx-auto text-center py-16 px-4 sm:py-24">
          <svg className="h-24 w-24 text-indigo-200 mx-auto mb-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">No developers found</h2>
          <p className="text-gray-600 mb-8">We've run out of developer profiles to show you. Check back soon or update your preferences.</p>
          <button 
            onClick={getFeed} 
            className="btn-primary"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container py-8">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-8">Find Your Developer Match</h1>
      <div className="max-w-md mx-auto relative h-[520px]">
        {/* Card stack with positioning to ensure cards are centered */}
        <div className="absolute inset-0 flex items-center justify-center">
          {feed.length > 0 && !isTransitioning && (
            <UserCard 
              key={feed[0]._id} 
              user={feed[0]} 
              onCardRemoved={handleCardRemoved} 
            />
          )}
        </div>
      </div>
      
      {/* Card counter */}
      <div className="mt-6 text-center text-gray-500">
        <span>{feed.length} developer{feed.length !== 1 ? 's' : ''} left</span>
      </div>
    </div>
  );
};

export default Feed;
