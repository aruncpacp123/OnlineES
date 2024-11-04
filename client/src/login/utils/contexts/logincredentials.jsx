import { createContext } from "react";

export const UserContext = createContext({
    id:0,
    email:'',
    name:'',
    regno:'',
    setUserData:() => {},
});
