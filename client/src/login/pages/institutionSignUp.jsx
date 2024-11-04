
import React, { useState } from "react";
import Navbar from "../components/navbar";
import { Button } from "@/components/ui/button"
import {Card,CardContent,CardDescription,CardFooter,CardHeader,CardTitle,} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {Tabs,TabsContent,TabsList,TabsTrigger,} from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import axios from "axios";
import InstRegister2 from "../components/InstRegister2";
function Institution() {
  const [formFields,setFormFields] =useState({
    name:'',
    email:'',
    address:'',
    phone:'',
  })
  const [data,setData] = useState()
  const [step2,setStep2] = useState(false);
  const isDisabled = !formFields.name || !formFields.email || !formFields.address || !formFields.phone;
  const submit = async (e) =>{
    e.preventDefault();
    try{
      const res = axios.post('http://localhost:5000/addInstitution',formFields)
      .then((res)=>{
        alert("institution Created Successfully");
        setStep2(true);
        setData(res.data);
      })
      .catch((err)=>console.log(err))
    }
    catch(err){
      console.log(err);
    }
    
  };
  return (
    <>
    <div>
      <Navbar />
    </div>
    {
      step2?<InstRegister2 value={data}/>:
    <div className="flex justify-center items-center mt-20">
      <div>
        <Tabs defaultValue="institution" className="w-[400px]">
          <TabsList className="grid w-full grid-cols-1">
            <TabsTrigger value="institution" className="border border-black">REGISTER</TabsTrigger>
          </TabsList>
          <TabsContent value="institution">
            <Card>
              <CardHeader>
                <CardDescription className="text-center tracking-widest">
                  INSTITUTION
                </CardDescription>
                {/* <CardTitle className ="text-center">SIGNUP</CardTitle> */}
              </CardHeader>
              <form onSubmit={submit}>
                <CardContent className="space-y-2">
                  <div className="space-y-1">
                    <Label htmlFor="name">Institution Name</Label>
                    <Input id="name"  placeholder="Name...." value={formFields.name} onChange={(e)=>{setFormFields((current)=>({...current,name:e.target.value}))}}/>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="address">Address</Label>
                    <Textarea id="address" placeholder="Type your Address here." value={formFields.address} onChange={(e)=>{setFormFields((current)=>({...current,address:e.target.value}))}}/>
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="email">Institution Email</Label>
                    <Input id="email"  placeholder="Email...." value={formFields.email} onChange={(e)=>{setFormFields((current)=>({...current,email:e.target.value}))}}/>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="phno">Phone Number</Label>
                    <Input id="phno"  placeholder="Phone...." value={formFields.phone} onChange={(e)=>{setFormFields((current)=>({...current,phone:e.target.value}))}}/>
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
    }
    </>
    
  );
}

export default Institution;


