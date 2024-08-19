import React, { useState } from "react";
import { FaBars } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { eraseCookie } from '../utils';

const NavbarComponent = () => {
  const [navbarOpen, setNavbarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  const handleLogout = async () => {
    try {
      eraseCookie('token');
      eraseCookie('role');
      navigate("/login"); 
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="font-montserrat">
      <nav className="relative flex flex-wrap items-center justify-between py-3 bg-white mb-3 z-10 shadow">
        <div className="container mx-auto flex flex-wrap items-center justify-between">
          <div className="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start">
            <a
              className="text-2xl md:text-3xl font-bold leading-relaxed inline-block mr-4 px-2 py-2 whitespace-nowrap text-purple-700"
              href="#pablo"
            >
              Warmindo
            </a>
            <button
              className="text-purple-700 cursor-pointer text-xl leading-none px-3 py-1 border 
                border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none"
              type="button"
              onClick={() => setNavbarOpen(!navbarOpen)}
            >
              <FaBars />
            </button>
          </div>
          <div
            className={
              "lg:flex flex-grow items-center" +
              (navbarOpen ? " flex" : " hidden")
            }
            id="example-navbar-danger"
          >
            <ul className="flex flex-col lg:flex-row list-none lg:ml-auto justify-center items-center ml-auto">
              <li className="nav-item">
                <a
                  className={`px-3 py-2 flex items-center text-md leading-snug text-purple-700 hover:opacity-75 ${
                    currentPath === "/order" ? "active" : ""
                  }`}
                  href="/order"
                >
                  <span className="ml-2">Dasbor</span>
                </a>
              </li>
              <li className="nav-item">
                <a
                  className={`px-3 py-2 flex items-center text-md leading-snug text-purple-700 hover:opacity-75 ${
                    currentPath === "/menu" ? "active" : ""
                  }`}
                  href="/menu"
                >
                  <span className="ml-2">Data Menu</span>
                </a>
              </li>
              <li className="nav-item">
                <a
                  className={`px-3 py-2 flex items-center text-md leading-snug text-purple-700 hover:opacity-75 ${
                    currentPath === "/user" ? "active" : ""
                  }`}
                  href="/user"
                >
                  <span className="ml-2">Data Staff</span>
                </a>
              </li>
              <li className="nav-item">
                <a
                  className={`px-3 py-2 flex items-center text-md leading-snug text-purple-700 hover:opacity-75 ${
                    currentPath === "/settings" ? "active" : ""
                  }`}
                  href="/settings"
                >
                  <span className="ml-2">Pengaturan</span>
                </a>
              </li>
            </ul>
            <ul className="ml-auto">
              <li>
                <div className="relative inline-block text-left">
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white p-2 rounded-lg"
                    onClick={handleLogout}
                  >
                    Keluar
                  </button>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default NavbarComponent;
