import React,{useState} from 'react'
import { Button } from "@/components/ui/button"
import {Card,CardContent,CardDescription,CardFooter,CardHeader,CardTitle,} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {Tabs,TabsContent,TabsList,TabsTrigger,} from "@/components/ui/tabs"
import {  Select,  SelectContent,  SelectItem,  SelectTrigger,  SelectValue,} from "@/components/ui/select"
import axios from "axios";
import Institution from '../pages/institutionSignUp'
import image from "../../assets/react.svg"
import show from "../../assets/eye_open.svg"
import hide from "../../assets/eye_hide.svg"
import eye from "../../assets/eye.svg"
import { useNavigate } from 'react-router-dom'

export default function InstRegister2({value}) {
    const [formFields,setFormFields] =useState({
        name:'',
        email:'',
        regno:'',
        phone:'',
        password:'',
        gender:'',
        dob:'',
        inst_id:value.id,
      })
      const navigate = useNavigate();
      const isDisabled = !formFields.name || !formFields.email || !formFields.regno || !formFields.phone || !formFields.password || !formFields.gender || !formFields.dob;
      const gender = ["Male","Female","Others"];
      const [showPassword, setShowPassword] = useState(false);
      const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
      };
      const submit = async (e) =>{
        e.preventDefault();
        try{
          const res = await axios.post(`${import.meta.env.VITE_URL}/addInstAdmin`,formFields);
          alert("Admin Created Successfully");
          navigate('/')
          console.log(res);
        }
        catch(err){
          console.log(err);
        }
      };
  return (
    <>
    <div className="flex justify-center items-center mt-20">
      <div>
        <Tabs defaultValue="institution" className="w-[400px]">
          <TabsList className="grid w-full grid-cols-1">
            <TabsTrigger value="institution" className="border border-black">ADMIN CREATION</TabsTrigger>
          </TabsList>
          <TabsContent value="institution">
            <Card>
              <CardHeader>
                <CardDescription className="text-center tracking-widest">
                  {/* INSTITUTION */}
                </CardDescription>
                {/* <CardTitle className ="text-center">SIGNUP</CardTitle> */}
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
                        <Select id="gender" onValueChange={(value)=>{setFormFields((current)=>({...current,gender:value}));console.log(formFields.gender)}}>
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
                        <Label htmlFor="institution">Institution Name</Label>
                        <Input id="institution" value={value.name} contentEditable={false} className="font-bold" onChange={(e)=>{}}/>
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="dob">Date Of Birth</Label>
                        <Input id="dob" value={formFields.dob} type="date" onChange={(e)=>{setFormFields((current)=>({...current,dob:e.target.value}))}}/>
                    </div>
                </CardContent>
                <CardFooter className="justify-center">
                  <Button className="min-w-64" disabled={isDisabled}>SIGNUP</Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
    </>
  )
}
