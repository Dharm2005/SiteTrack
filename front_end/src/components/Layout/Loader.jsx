// Loader.jsx
import React from "react";

const Loader = ({ message = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 h-screen">
      {/* Outer Ring */}
      <div className="w-20 h-20 border-4 border-transparent text-blue-400 text-4xl animate-spin flex items-center justify-center border-t-blue-400 rounded-full">
        {/* Inner Ring */}
        <div className="w-16 h-16 border-4 border-transparent text-red-400 text-2xl animate-spin flex items-center justify-center border-t-red-400 rounded-full"></div>
      </div>

      {/* Message */}
      <p className="text-gray-700 text-lg font-medium">{message}</p>
    </div>
  );
};

export default Loader;