import React, { useState ,useContext, useEffect} from "react";
import { Button } from "@/components/ui/button"
import {Card,CardContent,CardDescription,CardFooter,CardHeader,CardTitle,} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {Tabs,TabsContent,TabsList,TabsTrigger,} from "@/components/ui/tabs"
import {  Select,  SelectContent,  SelectItem,  SelectTrigger,  SelectValue,} from "@/components/ui/select"
import hide from "../../assets/eye_hide.svg"
import eye from "../../assets/eye.svg"
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function TeacherSignUp() {
    const [formFields,setFormFields] =useState({
        name:'',
        email:'',
        regno:'',
        phone:'',
        password:'',
        gender:'',
        dob:'',
        inst_id:'',
        dept_id:'',
      });
      const [colleges,setColleges] =useState([])
      const [departments,setDepartments] =useState([])
      const gender = ["Male","Female","Others"];
      const [showPassword, setShowPassword] = useState(false);
      const navigate = useNavigate();

      const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
      };

      const submit = async (e) =>{
        e.preventDefault();
        try{
          const res = await axios.post('http://localhost:5000/addTeacher',formFields);
          alert("Teacher Created Successfully");
          navigate('/');
          console.log(res);
        }
        catch(err){
          console.log(err);
        }
      };

      const fetchColleges = async () => {
        try {
          const res = await axios.get('http://localhost:5000/getCollege');
          setColleges(res.data);
        } catch (err) {
          console.error("Error fetching colleges:", err);
        }
      };

      const fetchDepartments= async (id)=>{
        try {
            const res = await axios.post('http://localhost:5000/getDepartments',{
                inst_id:parseInt(id,10)
            });
            setDepartments(res.data);
          } catch (err) {
            console.error("Error fetching colleges:", err);
          }
    };

      useEffect(()=>{
        fetchColleges();
      },[])

  return (
    <>
            <Card>
              <CardHeader>
                <CardDescription className="text-center tracking-widest">
                  TEACHER
                </CardDescription>
                <CardTitle className ="text-center">SIGNUP</CardTitle>
              </CardHeader>
              <form onSubmit={submit}>
                <CardContent className="space-y-2">
                  <div className="space-y-1">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name"  placeholder="Name...." value={formFields.name} onChange={(e)=>{setFormFields((current)=>({...current,name:e.target.value}))}}/>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email"  placeholder="Email...." type="email" value={formFields.email} onChange={(e)=>{setFormFields((current)=>({...current,email:e.target.value}))}}/>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="regno">Register Number</Label>
                    <Input id="regno"  placeholder="Register Number...." value={formFields.regno} onChange={(e)=>{setFormFields((current)=>({...current,regno:e.target.value}))}}/>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="phno">Phone Number</Label>
                    <Input id="phno"  placeholder="Phone...." value={formFields.phone} onChange={(e)=>{setFormFields((current)=>({...current,phone:e.target.value}))}}/>
                  </div>
                  <div className="space-y-1 relative">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password"  className=" " placeholder="password...." type={showPassword ? 'text' : 'password'} value={formFields.password} onChange={(e)=>{setFormFields((current)=>({...current,password:e.target.value}))}}/>
                    <Button className="absolute right-1 top-20 -translate-y-14 bg-white h-10 w-12 hover:bg-white active:bg-white focus:outline-0 focus:ring focus:ring-black" onClick={togglePasswordVisibility} type="button">
                        {showPassword ? <img src={hide} className=""/>: <img src={eye} className=""/>}
                    </Button>
                  </div>
                    <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="gender">Gender</Label>
                        <Select id="gender" onValueChange={(value)=>{setFormFields((current)=>({...current,gender:value}))}}>
                            <SelectTrigger id="gender">
                            <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent position="popper">
                            {
                                gender.map((items,index)=>(
                                <SelectItem value={items} key={index}>{items}</SelectItem>
                                ))
                            }
                            </SelectContent>
                        </Select>
                        
                     </div>
                    <div className="space-y-1">
                        <Label htmlFor="dob">Date Of Birth</Label>
                        <Input id="dob" value={formFields.dob} type="date" onChange={(e)=>{setFormFields((current)=>({...current,dob:e.target.value}))}}/>
                    </div>
                     <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="institution">Institution</Label>
                      <Select id="institution" onValueChange={(value)=>{setFormFields((current)=>({...current,inst_id:parseInt(value,10)}));fetchDepartments(value)}}>
                        <SelectTrigger id="institution">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent position="popper">
                          {
                            colleges.map((items,index)=>(
                              <SelectItem value={String(items.inst_id) } key={index}>{items.inst_name}</SelectItem>
                            ))
                          }
                          
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="course">Department</Label>
                      <Select id="course" onValueChange={(value)=>{setFormFields((current)=>({...current,dept_id:parseInt(value,10)}))}}>
                        <SelectTrigger id="course">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent position="popper">
                          {
                            departments.map((items,index)=>(
                              <SelectItem value={String(items.dept_id)} key={index}>{items.dept_name}</SelectItem>
                            ))
                          }
                        </SelectContent>
                      </Select>
                    </div>
                </CardContent>
                <CardFooter className="justify-center">
                  <Button className="min-w-64" disabled={false}>SIGNUP</Button>
                </CardFooter>
              </form>
            </Card>
    </>
  )
}
