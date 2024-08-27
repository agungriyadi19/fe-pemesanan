import React from "react";
import { useNavigate } from "react-router-dom";
import { eraseCookie } from '../../utils';
import { Disclosure } from '@headlessui/react';


const NavbarComponent = () => {
  const navigate = useNavigate();

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
    <Disclosure as="nav" className="bg-white shadow-md">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex flex-shrink-0 items-center">
              <h1 className='text-gray-800'>Warmindo</h1>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <button
              className="bg-red-400 hover:bg-red-600 text-white p-2 rounded-lg"
              onClick={handleLogout}
            >
              Keluar
            </button>
          </div>
        </div>
      </div>

    </Disclosure>
  );
};

export default NavbarComponent;
