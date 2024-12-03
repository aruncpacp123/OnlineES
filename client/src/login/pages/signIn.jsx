import React, { useContext, useEffect, useState } from "react";
import Navbar from "../components/navbar";
import { Button } from "@/components/ui/button";
import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tabs, TabsContent, TabsList, TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
// import { useUser } from "../utils/user";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../utils/contexts/userContext";
function SignIn() {
  const [regno, setRegNo] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [institution, setInstitution] = useState("");
  const [college, setCollege] = useState([]);
  const [error, setError] = useState("");
  const [id, setId] = useState("");
  // const { setUser } = useUser();
  const navigate = useNavigate();
  const { login } = useContext(UserContext);
  const usernames = JSON.parse(sessionStorage.getItem('username'));
  
  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const res = await axios.get('http://localhost:5000/getCollege');
        setCollege(res.data);
      } catch (err) {
        console.error("Error fetching colleges:", err);
      }
    };
    fetchColleges();

    if (usernames) {
      if (usernames.user_type === "admin") {
          navigate('/admin'); // Navigate to admin route if user is admin
      } else if(usernames.user_type === "teacher"){
          navigate('/teacher'); // Navigate to home or default route for non-admin users
      }else if(usernames.user_type === "student"){
        navigate('/student'); // Navigate to home or default route for non-admin users
      }else{
        navigate('/')
      }
    }
  }, []);

  const loginAll = async (userType, e) => {
    e.preventDefault();
    try {
      const res = await axios.post('Login', {
        regno,
        email,
        password,
        type: userType,
        institution,
      });
      setEmail("");
      setPassword("");
      setCollege("");
      setRegNo("");
      if (userType === "admin") {
        if(res.data?.message)
          setError(res.data.message);
        else{
          // login({id:res.data.id,username:"arun"});//data context
          // navigate('/admin', { state: { id: res.data.id} });//state passing
          sessionStorage.setItem('username', JSON.stringify({ id: res.data.user_id, name:res.data.user_name , email:res.data.user_email,inst_id:res.data.inst_id,user_type:"admin" }));//session
          navigate('/admin');

        }
      }
      else if (userType === "teacher") {
        if(res.data?.message)
          setError(res.data.message);
        else{
          sessionStorage.setItem('username', JSON.stringify({ id: res.data.user_id, name:res.data.user_name , email:res.data.user_email,inst_id:res.data.inst_id,user_type:"teacher",department:res.data.dept_id }));//session
          navigate('/teacher');

        }
      }
      else if (userType === "student") {
        if(res.data?.message)
          setError(res.data.message);
        else{
          sessionStorage.setItem('username', JSON.stringify({ id: res.data.user_id, name:res.data.user_name , email:res.data.user_email,inst_id:res.data.inst_id,user_type:"student",regno:res.data.user_regno,course:res.data.course_id,sem:res.data.current_sem }));//session
          navigate('/student');

        }
      }
    } catch (err) {
      setError('Login failed. Please try again.');
      console.error(err);
    }
  };
  return (
    <>
      <Navbar />
      <div className="flex justify-center items-center mt-32">
        <div>
          <Tabs defaultValue="student" className="w-[400px]">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="student">Student</TabsTrigger>
              <TabsTrigger value="teacher">Teacher</TabsTrigger>
              <TabsTrigger value="admin">Admin</TabsTrigger>
            </TabsList>
            {/* Student Login */}
            <TabsContent value="student">
              <Card>
                <form onSubmit={(e) => loginAll("student", e)}>
                  <CardHeader>
                    <CardDescription className="text-center tracking-widest">
                      STUDENT
                    </CardDescription>
                    <CardTitle className="text-center">LOGIN</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="space-y-1">
                      <Label htmlFor="regno">Register Number</Label>
                      <Input
                        id="regno"
                        value={regno}
                        placeholder="TVE23MCA..."
                        onChange={(e) => { setError(""); setRegNo(e.target.value); }}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        value={password}
                        type="password"
                        placeholder="Password..."
                        onChange={(e) => { setError(""); setPassword(e.target.value); }}
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="justify-center">
                    <Button type="submit" className="min-w-28">Login</Button>
                  </CardFooter>
                  <div className="text-center mb-5 text-red-800 font-mono">{error}</div>
                </form>
              </Card>
            </TabsContent>

            {/* Teacher Login */}
            <TabsContent value="teacher">
              <Card>
                <form onSubmit={(e) => loginAll("teacher", e)}>
                  <CardHeader>
                    <CardDescription className="text-center tracking-widest">
                      TEACHER
                    </CardDescription>
                    <CardTitle className="text-center">LOGIN</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="space-y-1">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        value={email}
                        placeholder="Email..."
                        onChange={(e) => { setError(""); setEmail(e.target.value); }}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        value={password}
                        type="password"
                        placeholder="Password..."
                        onChange={(e) => { setError(""); setPassword(e.target.value); }}
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="justify-center">
                    <Button type="submit" className="min-w-28">Login</Button>
                  </CardFooter>
                  <div className="text-center mb-5 text-red-800 font-mono">{error}</div>
                </form>
              </Card>
            </TabsContent>

            {/* Admin Login */}
            <TabsContent value="admin">
              <Card>
                <form onSubmit={(e) => loginAll("admin", e)}>
                  <CardHeader>
                    <CardDescription className="text-center tracking-widest">
                      ADMIN
                    </CardDescription>
                    <CardTitle className="text-center">LOGIN</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid w-full items-center gap-4">
                      <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          value={email}
                          placeholder="Email..."
                          onChange={(e) => { setError(""); setEmail(e.target.value); }}
                        />
                      </div>
                      <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="password">Password</Label>
                        <Input
                          id="password"
                          value={password}
                          type="password"
                          placeholder="Password..."
                          onChange={(e) => { setError(""); setPassword(e.target.value); }}
                        />
                      </div>
                      <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="institution">Institution</Label>
                        <Select id="institution" onValueChange={(value) => {setInstitution(value);}}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent position="popper">
                            {
                              college.length > 0 ? (
                                  college.map((item) => (
                                    <SelectItem value={String(item.inst_id)} key={item.inst_id}>
                                      {item.inst_name}
                                    </SelectItem>
                                  ))
                                ) : (
                                  <SelectItem disabled value="np">No institutions available</SelectItem>
                                )}
                            
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="justify-center">
                    <Button type="submit" className="min-w-28">Login</Button>
                  </CardFooter>
                </form>
                <div className="text-center mb-5 text-red-800 font-mono">{error}</div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}

export default SignIn;
