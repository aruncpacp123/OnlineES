import React ,{useContext} from 'react';
import { useLocation } from 'react-router-dom';
import { UserContext } from '@/login/utils/contexts/userContext';
export default function Home2() {
    const location = useLocation();
    const id = location.state?.id; 
     // Access `id` safely from `location.state`
     const { user} = useContext(UserContext);
     const usernames = JSON.parse(sessionStorage.getItem('username')); // Get usernames from session storage
     console.log(usernames)
    return (
        <>
            <div>Welcome {id ? id : 'Guest'}</div>
            <div><br />Welcome {user ? user.username: 'Guest'}</div>
            <div><br />Welcome {usernames ? usernames.id : 'Guest'}</div> {/* Render username from session */}

        </>
    );
}


