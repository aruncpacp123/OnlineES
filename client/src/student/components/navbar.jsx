import React, { useState } from "react";
import { Link ,useNavigate} from 'react-router-dom'
import profile from "@/assets/profile.svg"
export default function Navbar() {
    const navigate = useNavigate();
    const [isDropdownOpen, setDropdownOpen] = useState(false);

    const handleDropdownToggle = () => {
    setDropdownOpen(!isDropdownOpen);
    };
    const logout = ()=>{
        sessionStorage.removeItem("username");
        navigate('/')
    }
    const usernames = JSON.parse(sessionStorage.getItem('username')); // Get usernames from session storage

  return (
    <>
      <nav className=" min-h-14 bg-slate-100 border-2 flex justify-between items-center ">
          <span className='pl-5 font-serif text-lg font-extrabold text-blue-800'>Online Exam</span>
          <div className='flex justify-between items-center mr-16 font-mono text-lg font-extrabold text-gray-600 relative'>
            <div className='m-3 border pl-4 pr-4 bg-slate-200 border-r-orange-700 font-bold text-black'>Welcome {usernames ? usernames.name : 'Guest'}</div>
            <div className="relative">
                <button onClick={handleDropdownToggle} className="hover: focus:outline-none ">
                  <img src={profile} className="w-8 mt-2"></img>
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded shadow-lg z-10">
                    {/* <Link
                      to="/profile"
                      className="block px-4 py-2 hover:bg-blue-100"
                      onClick={() => setDropdownOpen(false)}
                    >Profile</Link> */}
                    <div className="block px-4 py-2 hover:bg-blue-100" onClick={logout}>Logout</div>
                  </div>
                )}
            </div>          
          </div>
      </nav>
    </>
  )
}

          

