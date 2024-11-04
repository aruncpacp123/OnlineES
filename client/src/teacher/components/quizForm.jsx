import React,{useState} from 'react'
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
  } from "@/components/ui/tabs"
  import { Button } from "@/components/ui/button"
  import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useNavigate } from 'react-router-dom'
import {Card,CardContent,CardDescription,CardFooter,CardHeader,CardTitle,} from "@/components/ui/card"
import {  Select,  SelectContent,  SelectItem,  SelectTrigger,  SelectValue,} from "@/components/ui/select"

export default function QuizForm() {
    const [formFields,setFormFields] =useState({
        name:'',
        email:'',
        regno:'',
        phone:'',
        password:'',
        gender:'',
        dob:'',
        inst_id:'',
      })
      const isDisabled = !formFields.name || !formFields.email || !formFields.regno || !formFields.phone || !formFields.password || !formFields.gender || !formFields.dob;
      const gender = ["Male","Female","Others"];
      const [showPassword, setShowPassword] = useState(false);
      const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
      };
      const submit = async (e) =>{
        e.preventDefault();
        try{
          const res = await axios.post('http://localhost:5000/addInstAdmin',formFields);
          alert("Admin Created Successfully");
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
        <Tabs defaultValue="institution" className="w-[700px]">
          <TabsList className="grid w-full grid-cols-1">
            <TabsTrigger value="institution" className="border border-black">QUIZ</TabsTrigger>
          </TabsList>
          <TabsContent value="institution">
            <Card>
              <CardHeader>
                <CardDescription className="text-center tracking-widest">
                  {/* INSTITUTION */}
                </CardDescription>
                {/* <CardTitle className ="text-center">SIGNUP</CardTitle> */}
              </CardHeader>
              <form >
              {Array.from({ length: 8 }, (_, index) => (
                                <CardContent className="space-y-2">
                                <div className="space-y-1">
                                  <Label htmlFor="name">Question</Label>
                                  <Input id="name"  placeholder="Name...." value={formFields.name} onChange={(e)=>{setFormFields((current)=>({...current,name:e.target.value}))}}/>
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
                                   <CardFooter className="justify-center">
                                      <Button className="min-w-64 mt-8" disabled={isDisabled}>SIGNUP</Button>
                                  </CardFooter>
                              </CardContent>
                            ))} 
                
                
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
    </>
  )
}
