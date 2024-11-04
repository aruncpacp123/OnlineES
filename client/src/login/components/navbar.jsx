
import { Link} from 'react-router-dom'

export default function Navbar() {
  return (
    <>
      <nav className="min-h-14 bg-slate-100 border-2 flex justify-between items-center ">
          <span className='pl-5 font-serif text-lg font-extrabold text-blue-800'>Online Exam</span>
          <ul className='flex justify-between items-center mr-16 font-mono text-lg font-extrabold text-gray-600'>
            <li className='m-3'><Link to="/login">Login</Link> </li>
            <li className='m-3'><Link to="/Register">Register</Link></li>
            <li className='m-3'><Link to="/InstRegister">Institution</Link></li>
          </ul>
      </nav>
    </>
  )
}