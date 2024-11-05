import React,{useContext, useEffect, useState} from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {  Select,  SelectContent,  SelectItem,  SelectTrigger,  SelectValue,} from "@/components/ui/select"
import {Dialog,DialogContent,DialogDescription,DialogFooter,DialogHeader,DialogTitle,DialogTrigger,} from "@/components/ui/dialog"
import axios from 'axios'
// import { ExamContext } from '../utils/contexts'
export default function ExamForm() {
    // const {exam} = useContext(ExamContext);
    const usernames = JSON.parse(sessionStorage.getItem('username'));
    const user_id = usernames?.id;
    // const { add,step1,step2,setStep1} = useContext(UserContext);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [subjects,setSubjects] = useState([]);
    const [formFields,setFormFields] = useState({
        exam_name:'',
        subject_id:'',
        description:'',
        starting:'',
        ending:'',
        duration:'',
        subjective:'',
        objective:'',
        teacher:user_id
    })

    const fetchSubjects= async ()=>{
        try {
            const res = await axios.post('http://localhost:5000/fetchSubjects',{user_id});
            setSubjects(res.data);
          } catch (err) {
            console.error("Error fetching Courses:", err);
          }
    };

    const createExam = async (e)=>{
        e.preventDefault();
        console.log(typeof(formFields.subject_id))
// setStep1(true)
        try{
            const res = await axios.post('http://localhost:5000/createExam',formFields);
            console.log(res.data)
        }catch(err){
            console.error(err)
        }
    };
    useEffect(()=>{
        fetchSubjects();
    },[])
  return (
    <div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button className="bg-blue-700 mr-10" variant="outline" onClick={() => setIsDialogOpen(true)} >Create</Button>
            </DialogTrigger>
          <DialogContent className="sm:max-w-full lg:max-w-[1000px]  ">
            <form onSubmit={createExam}>
                <DialogHeader>
                  <DialogTitle className="text-center">Create Exam</DialogTitle>
                  <DialogDescription>
                    {/* Make changes to Course. Click save when you're done. */}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-8 py-4">
                  <div className="grid grid-cols-6 ml-9 mr-9 items-center gap-4">
                    <Label htmlFor="name" className="text-right col-span-1">
                       Exam Name
                    </Label>
                    <Input
                      id="name"
                      className="col-span-5" 
                      placeholder="Enter Exam Name"
                      value={formFields.exam_name}
                      onChange={(e)=>{setFormFields((current)=>({...current,exam_name:e.target.value}))}}
                    />
                  </div>
                  <div className="grid grid-cols-6 ml-9 mr-9 items-center gap-4">
                      <Label htmlFor="subject" className="text-right col-span-1">
                        Subject
                      </Label>
                      <Select id="subject" onValueChange={(value)=>{setFormFields((current)=>({...current,subject_id:parseInt(value,10)}))}}>
                        <SelectTrigger id="subject" className="col-span-5" >
                        <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent position="popper">
                        {
                            subjects.map((items,index)=>(
                            <SelectItem value={String(items.subject_id)} key={index}>{items.subject_name}</SelectItem>
                            ))
                        }
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-6 ml-9 mr-9 items-center gap-4">
                        <Label htmlFor="decription" className="text-right col-span-1">
                           Description
                        </Label>
                        <Textarea 
                            id="description"
                            className="col-span-5" 
                            placeholder="Enter Exam Description"
                            value={formFields.description}
                            onChange={(e)=>{setFormFields((current)=>({...current,description:e.target.value}))}}
                        />
                    </div>
                    <div className="grid grid-cols-6 ml-9 mr-9 items-center gap-4">
                        <Label htmlFor="starting" className="text-right col-span-1">
                           Starting Date & Time
                        </Label>
                        <Input
                            id="starting"
                            className="col-span-2" 
                            type="datetime-local"
                            value={formFields.starting}
                            onChange={(e)=>{setFormFields((current)=>({...current,starting:e.target.value}))}}

                        />
                        <Label htmlFor="ending" className="text-right col-span-1">
                           Ending Date & Time
                        </Label>
                        <Input
                            id="ending"
                            className="col-span-2" 
                            type="datetime-local"
                            value={formFields.ending}
                            onChange={(e)=>{setFormFields((current)=>({...current,ending:e.target.value}))}}
                        />
                    </div>
                    <div className="grid grid-cols-6 ml-9 mr-9 items-center gap-4 relative ">
                        <Label htmlFor="duration" className="text-right col-span-1">
                           Duration
                        </Label>
                        <Input id="duration" className="col-span-5" placeholder="Enter Exam Duration" type="number"
                            value={formFields.duration}
                            onChange={(e)=>{setFormFields((current)=>({...current,duration:e.target.value}))}}
                        />
                        <span className='absolute ml-[800px] '>Minutes</span>
                    </div>
                    <div className="grid grid-cols-6 ml-9 mr-9 items-center gap-4">
                        <Label htmlFor="subjective" className="text-right col-span-1">
                           Subjective Number
                        </Label>
                        <Input
                            id="subjective"
                            className="col-span-2" 
                            placeholder="Enter No. of Questions in Subjective Section"
                            type="number"
                            value={formFields.subjective}
                            onChange={(e)=>{setFormFields((current)=>({...current,subjective:e.target.value}))}}

                        />
                        <Label htmlFor="objective" className="text-right col-span-1">
                           Objective Number
                        </Label>
                        <Input
                            id="objective"
                            className="col-span-2" 
                            placeholder="Enter No. of Questions in Objective Section"
                            type="number"
                            value={formFields.objective}
                            onChange={(e)=>{setFormFields((current)=>({...current,objective:e.target.value}))}}
                        />
                    </div>
                </div> 
                <DialogFooter className="">
                  <Button type="submit" >Save changes</Button>
                </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
    </div>
  )
}
