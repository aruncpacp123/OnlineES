import React, { useEffect, useState } from 'react'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
  import { Button } from "@/components/ui/button"
  import { Input } from "@/components/ui/input"
  import { Label } from "@/components/ui/label"
  import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
  import {  Select,  SelectContent,  SelectItem,  SelectTrigger,  SelectValue,} from "@/components/ui/select"
  import axios from 'axios'
import { Outlet } from 'react-router-dom'
import Teachers from './teachers'
import Assign from './Assign'
  
  
export default function Subjects() {
  const [subjectFields,setSubjectFields] = useState({
    name:'',
    course_id:'',
    sem:'',
  })
  const [departments,setDepartments] = useState([]);
  const [courses,setCourses] = useState([]);
  const [subjects,setSubjects] = useState([]);
  const [teacher,setTeacher] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const usernames = JSON.parse(sessionStorage.getItem('username'));
  const inst_id = usernames?.inst_id;
  const totalSemesters =8
  const addSubject =async (e)=>{
    e.preventDefault();
    try 
    {
      const res = await axios.post('http://localhost:5000/addSubject',subjectFields);
      console.log(res)
      setIsDialogOpen(false);
      fetchSubjects();
      setSubjectFields({
        name:'',
        course_id:'',
        sem:'',
      });
    }catch(err){
        console.error(err);
    }
  }
  
  const deleteSubject = async (id)=>{
    try 
    {
      const res = await axios.post('http://localhost:5000/deleteSubject', {
        id
      });
    fetchSubjects();
    }catch(err){
        console.error(err);
    }
  };
  const fetchSubjects= async ()=>{
    try {
        const res = await axios.post('http://localhost:5000/getSubjects',{inst_id});
        setSubjects(res.data);
      } catch (err) {
        console.error("Error fetching Courses:", err);
      }
};
  const fetchCourses= async (dept_id)=>{
      try {
          const res = await axios.post('http://localhost:5000/fetchCourses',{dept_id});
          setCourses(res.data);
        } catch (err) {
          console.error("Error fetching Courses:", err);
        }
  };
  const fetchDepartments= async ()=>{
    try {
        const res = await axios.post('http://localhost:5000/getDepartments',{inst_id});
        setDepartments(res.data);
      } catch (err) {
        console.error("Error fetching Departments:", err);
      }
};
const fetchTeachers= async (sub_id)=>{
  try {
      const res = await axios.post('http://localhost:5000/getTeachers',{sub_id});
      if(res.data.length >0){
        setTeacher(res.data.teacher_id);
      }
      else
        setTeacher([]);
    } catch (err) {
      console.error("Error fetching Departments:", err);
    }
};
  useEffect(() => {
    fetchDepartments();
    fetchSubjects();
  }, []);
  
  
  return (
    <div className=''>
        <div className="flex justify-end mr-5">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen} className="min-w-96">
                <DialogTrigger asChild className='w-[150px]'>
                  <Button variant="outline" className="mr-5 bg-slate-600 text-white mt-5" onClick={() => setIsDialogOpen(true)}>
                    ADD
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <form onSubmit={addSubject}>
                    <DialogHeader>
                      <DialogTitle className="text-center">Add Subject</DialogTitle>
                      <DialogDescription></DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="name" className="text-center">
                            Subject Name
                          </Label>
                          <Input
                            id="name"
                            className="col-span-3" 
                            value={subjectFields.name} 
                            onChange={(e)=>{setSubjectFields((current)=>({...current,name:e.target.value}))}}
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="department" className="text-center">
                            Department
                          </Label>
                          <Select id="department" className="col-span-3" onValueChange={(value)=>{fetchCourses(parseInt(value,10))}} >
                            <SelectTrigger id="department" className="col-span-3" >
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
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="course" className="text-center">Course</Label>
                          <Select id="course"  onValueChange={(value)=>{setSubjectFields((current)=>({...current,course_id:parseInt(value,10)}))}}>
                            <SelectTrigger id="course" className="col-span-3">
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent position="popper">
                              {
                                courses.map((items,index)=>(
                                  <SelectItem value={String(items.course_id)} key={index}>{items.course_name}</SelectItem>
                                ))
                              }

                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="semester" className="text-center">Semester</Label>
                          <Select id="semester" onValueChange={(value)=>setSubjectFields((current)=>({...current,sem:parseInt(value,10)}))}>
                            <SelectTrigger id="semester" className="col-span-3">
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent position="popper">
                                {Array.from({ length: totalSemesters }, (_, index) => (
                                    <SelectItem value={String(index + 1)} key={index}> {index + 1} </SelectItem>
                                ))}                          
                            </SelectContent>
                          </Select>
                        </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit">SUBMIT</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
            </Dialog>
        </div>
        <div className='mt-5 m-7'>
            <Table className="">
                <TableCaption>A list of Courses.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">No.</TableHead>
                    <TableHead className="w-[300px]">Name</TableHead>
                    <TableHead className="w-[100px]">Semester</TableHead>
                    <TableHead className="w-[300px]">Course</TableHead>
                    <TableHead className="w-[300px]">Teachers</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody >
                        {
                            subjects.map((item,index)=>{
                            // fetchTeachers(item.subject_id);
                            return <TableRow key={index}>
                              <TableCell className="font-medium">{index+1}</TableCell>
                              <TableCell>{item.subject_name}</TableCell>
                              <TableCell>{item.course_sem}</TableCell>
                              
                              <TableCell>{item.course_name}</TableCell>
                              <TableCell> <Teachers value={item.subject_id}/> </TableCell>

                              <TableCell className="text-right ">
                                <Assign sub_id={item.subject_id} dept_id={item.dept_id} sub_name={item.subject_name} />
                                
                                {/* <Button className="bg-blue-600 mr-6" >Edit</Button> */}
                                
                                <Button className="bg-red-600 mr-6" onClick={(e)=>deleteSubject(item.subject_id)}>Delete</Button>
                              </TableCell>
                            </TableRow>
})
                        }
                </TableBody>
                
            </Table>
        </div>
        {/* <div className="flex justify-center mr-5">
            <Button className="bg-green-400" >ADD</Button>
        </div> */}
        <Outlet />
    </div>
    
  )
}
