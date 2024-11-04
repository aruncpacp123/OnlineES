
import React, { useState } from "react";
import Navbar from "../components/navbar";
import { Button } from "@/components/ui/button"
import {Card,CardContent,CardDescription,CardFooter,CardHeader,CardTitle,} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {Tabs,TabsContent,TabsList,TabsTrigger,} from "@/components/ui/tabs"
import {  Select,  SelectContent,  SelectItem,  SelectTrigger,  SelectValue,} from "@/components/ui/select"
import Signupcomp from "../components/signupcomp";
// import { UserContext } from "../utils/contexts/logincredentials";
function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const colleges = ["CET","TKM","RIT","CUSAT"];
  // const [userData,setUserData]=useState({
  //   id:1,
  //   email:'aruncpacp10@gmail.com',
  //   name:'arun',
  //   regno:"123",
  // })
  
  return (
    <>
      <div>
        <Navbar />
      </div>
      <div >
        {/* <UserContext.Provider value={{...userData,setUserData}}> */}
          <Signupcomp/>
        {/* </UserContext.Provider > */}
      </div>
      </>
    
  );
}

export default SignUp;
