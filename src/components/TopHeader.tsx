import { useAuth } from "../hooks/AuthProvider";
import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ROUTE_PATHS } from "../router/routePaths";
import { useToast } from "../hooks/useToast";
import RedButton from "./RedButton";

const TopHeader = () => {
  const { users, logout } = useAuth();
  const navigate = useNavigate();
  const { successToast, errorToast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate(ROUTE_PATHS.LOGIN);
      successToast("Logged out!");
    } catch (error) {
      console.log(error);
      errorToast("Failed to log out");
    }
  };

  return (
    <header className="p-3 shadow bg-stone-50 sticky top-0 z-50">
      <div className="w-[90%] mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Logo" className="w-[45px] h-[45px]" />
          <h2 className="text-xl sm:text-2xl font-bold">SUNIB Hall</h2>
        </div>
        <nav className="hidden lg:block">
          <ul className="flex gap-6">
            <li>
              <NavLink
                to={ROUTE_PATHS.HOME}
                className="font-semibold px-2 hover:text-gray-600 duration-200"
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/teammates"
                className="font-semibold px-2 hover:text-gray-600 duration-200"
              >
                My Team
              </NavLink>
            </li>
            <li>
              <NavLink
                to={ROUTE_PATHS.COMPETITION}
                className="font-semibold px-2 hover:text-gray-600 duration-200"
              >
                Competitions
              </NavLink>
            </li>
            <li>
              <NavLink
                to={ROUTE_PATHS.FIND}
                className="font-semibold px-2 hover:text-gray-600 duration-200"
              >
                Find Teammates
              </NavLink>
            </li>
            <li>
              <NavLink
                to={`${ROUTE_PATHS.PROFILE}?id=${users?.user_id}`}
                className="font-semibold px-2 hover:text-gray-600 duration-200"
              >
                Your Profile
              </NavLink>
            </li>
            {users?.role === "admin" && (
              <li>
                <NavLink
                  to={ROUTE_PATHS.VIEW_FINALIZED}
                  className="font-semibold px-2 hover:text-gray-600 duration-200"
                >
                  View Finalized
                </NavLink>
              </li>
            )}
          </ul>
        </nav>

        {/* Desktop Logout */}
        <div className="hidden lg:block">
          <RedButton label="Logout" onClick={handleLogout} />
        </div>

        {/* Mobile Hamburger Button (SVG) */}
        <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden p-2">
          {isOpen ? (
            // X icon
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-7 h-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            // Hamburger icon
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-7 h-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="lg:hidden bg-white border-t py-4 px-6 mt-2 animate-fadeIn">
          <ul className="flex flex-col gap-4">
            <li className="flex justify-center">
              <NavLink
                to={ROUTE_PATHS.HOME}
                className="font-semibold block"
                onClick={() => setIsOpen(false)}
              >
                Home
              </NavLink>
            </li>
            <li className="flex justify-center">
              <NavLink
                to="/teammates"
                className="font-semibold block"
                onClick={() => setIsOpen(false)}
              >
                Teammates List
              </NavLink>
            </li>
            <li className="flex justify-center">
              <NavLink
                to={ROUTE_PATHS.COMPETITION}
                className="font-semibold block"
                onClick={() => setIsOpen(false)}
              >
                Competitions
              </NavLink>
            </li>
            <li className="flex justify-center">
              <NavLink
                to={ROUTE_PATHS.FIND}
                className="font-semibold block"
                onClick={() => setIsOpen(false)}
              >
                Find
              </NavLink>
            </li>
            <li className="flex justify-center">
              <NavLink
                to={`${ROUTE_PATHS.PROFILE}?id=${users?.user_id}`}
                className="font-semibold block"
                onClick={() => setIsOpen(false)}
              >
                Your Profile
              </NavLink>
            </li>
            {users?.role === "admin" && (
              <li className="flex justify-center">
                <NavLink
                  to={ROUTE_PATHS.VIEW_FINALIZED}
                  className="font-semibold block"
                  onClick={() => setIsOpen(false)}
                >
                  View Finalized
                </NavLink>
              </li>
            )}
            
            {/* Mobile Logout */}
            <div className="pt-4 flex justify-center">
              <RedButton label="Logout" onClick={handleLogout} extendedClassName="w-full md:w-1/2"/>
            </div>
          </ul>
        </div>
      )}
    </header>
  );
};

export default TopHeader;
