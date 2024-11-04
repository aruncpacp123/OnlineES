import React from 'react'
import { useNavigate } from 'react-router-dom';
export default function StudentHome() {
  const navigate = useNavigate();

    const logout = ()=>{
        sessionStorage.removeItem("username");
        navigate('/')
    }
  const usernames = JSON.parse(sessionStorage.getItem('username'));
  console.log(usernames)
  return (
    <div><div className="block px-4 py-2 hover:bg-blue-100" onClick={logout}>Logout</div></div>
  )
}
