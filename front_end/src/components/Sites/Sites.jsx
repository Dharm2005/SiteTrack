import React, { useState, useMemo, useEffect } from "react";
import Site from "./Site";
import {SitesSkeleton} from "../index";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function Sites() {
  const allSites = useSelector((state) => state.site.sites);
  const { user } = useSelector((state) => state.auth);
  const isLoading = useSelector((state) => state.site.loading); // Assuming you have loading state in Redux

  // Filter states
  const [activeFilter, setActiveFilter] = useState("all");
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [showContent, setShowContent] = useState(false);

  // Handle initial load animation
  useEffect(() => {
    if (allSites !== undefined) {
      const timer = setTimeout(() => {
        setIsInitialLoad(false);
        setShowContent(true);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [allSites]);

  // Filter sites based on selected filter
  const filteredSites = useMemo(() => {
    if (!allSites) return [];

    switch (activeFilter) {
      case "active":
        return allSites.filter((site) => !site.isCompleted);
      case "completed":
        return allSites.filter((site) => site.isCompleted);
      case "all":
      default:
        return allSites;
    }
  }, [allSites, activeFilter]);

  // Count sites by status
  const siteCounts = useMemo(() => {
    if (!allSites) return { all: 0, active: 0, completed: 0 };

    return {
      all: allSites.length,
      active: allSites.filter((site) => !site.isCompleted).length,
      completed: allSites.filter((site) => site.isCompleted).length,
    };
  }, [allSites]);

  const filterOptions = [
    { key: "all", label: "All", count: siteCounts.all },
    { key: "active", label: "Active", count: siteCounts.active },
    { key: "completed", label: "Completed", count: siteCounts.completed },
  ];

  // Show loading state
  if (isLoading || isInitialLoad) {
    return <SitesSkeleton />;
  }


  return (
    <div className="min-h-screen bg-gray-50 py-8 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section with Filter */}
        <div
          className={`mb-8 flex items-center justify-between transition-all duration-700 transform ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}
        >
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">All Sites</h2>
            <p className="text-gray-600">
              {filteredSites?.length
                ? `${filteredSites.length} sites found`
                : "No sites available"}
            </p>
          </div>

          {/* Filter Menu */}
          <div className="flex items-center space-x-2 bg-gray-100 rounded-xl p-2">
            {filterOptions.map((option, index) => (
              <button
                key={option.key}
                onClick={() => setActiveFilter(option.key)}
                className={`
                  relative px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center space-x-3 transform
                  ${activeFilter === option.key
                    ? "bg-white text-gray-800 shadow-lg scale-105"
                    : "text-gray-600 hover:text-gray-800 hover:bg-white/50 hover:scale-102"
                  }
                `}
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: showContent ? 'slideInFromRight 0.5s ease-out forwards' : 'none'
                }}
              >
                <div className="flex items-center space-x-2">
                  {option.key === "all" && (
                    <svg
                      className="w-4 h-4 opacity-70 transition-transform duration-200"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                      />
                    </svg>
                  )}
                  {option.key === "active" && (
                    <div className="w-2 h-2 rounded-full bg-current animate-pulse opacity-70"></div>
                  )}
                  {option.key === "completed" && (
                    <svg
                      className="w-4 h-4 opacity-70 transition-transform duration-200"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      />
                    </svg>
                  )}
                  <span>{option.label}</span>
                </div>
                <span
                  className={`
                    w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center transition-all duration-300
                    ${activeFilter === option.key
                      ? option.key === "all"
                        ? "bg-purple-500 text-white scale-110"
                        : option.key === "active"
                          ? "bg-blue-500 text-white scale-110"
                          : "bg-green-500 text-white scale-110"
                      : "bg-gray-400 text-white"
                    }
                  `}
                >
                  {option.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Sites Grid */}
        {filteredSites && filteredSites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-fr">
            {filteredSites.map((site, index) => (
              <div
                key={site._id}
                className={`w-full transition-all duration-500 transform ${showContent ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-95'
                  }`}
                style={{
                  animationDelay: `${index * 150}ms`,
                  animation: showContent ? 'slideInUp 0.6s ease-out forwards' : 'none'
                }}
              >
                <div className="hover:scale-105 transition-transform duration-300 ease-out">
                  <Site
                    key={site._id}
                    id={site._id}
                    name={site.siteName}
                    location={site.location}
                    image={site.siteImage}
                    managerId={site.manager}
                    createdAt={site.createdAt}
                    isCompleted={site.isCompleted}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State with Animation */
          <div
            className={`flex flex-col items-center justify-center py-16 transition-all duration-700 transform ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}
          >
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4 transform transition-all duration-500 hover:scale-110">
              <svg
                className="w-12 h-12 text-gray-400 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2 animate-fadeIn">
              {activeFilter === "all"
                ? "No sites found"
                : `No ${activeFilter} sites found`}
            </h3>
            <p className="text-gray-500 text-center max-w-md animate-fadeIn">
              {activeFilter === "all"
                ? "There are no sites to display at the moment."
                : `There are no ${activeFilter} sites to display.`}
            </p>
            {user.role === "admin" && activeFilter === "all" && (
              <Link
                to="/add-site"
                className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 animate-slideInUp"
              >
                Add First Site
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes slideInFromRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-slideInUp {
          animation: slideInUp 0.6s ease-out;
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }

        .hover\\:scale-102:hover {
          transform: scale(1.02);
        }
      `}</style>
    </div>
  );
}

export default Sites;