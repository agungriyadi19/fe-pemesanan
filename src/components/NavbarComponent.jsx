import React, { useState } from "react";
import { FaBars } from "react-icons/fa";

const NavbarComponent = () => {
  const [navbarOpen, setNavbarOpen] = useState(false);

  return (
    <div className="font-montserrat">
      <nav className="relative flex flex-wrap items-center justify-between  py-3 bg-white mb-3 z-10 shadow">
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
                  className="px-3 py-2 flex items-center text-md leading-snug text-purple-700 hover:opacity-75"
                  href="/order"
                >
                  <span className="ml-2">Home</span>
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="px-3 py-2 flex items-center text-md leading-snug text-purple-700 hover:opacity-75"
                  href="/menu"
                >
                  <span className="ml-2">Data Menu</span>
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="px-3 py-2 flex items-center text-md leading-snug text-purple-700 hover:opacity-75"
                  href="/user"
                >
                  <span className="ml-2">Data User</span>
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="px-3 py-2 flex items-center text-md leading-snug text-purple-700 hover:opacity-75"
                  href="/settings"
                >
                  <span className="ml-2">Setting</span>
                </a>
              </li>
            </ul>
            <ul className="ml-auto">
              <li>
                <div className="relative inline-block text-left">
                  
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
