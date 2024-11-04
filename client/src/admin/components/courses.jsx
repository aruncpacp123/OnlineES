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
  function Edit({item}){
    const [courseFields,setCourseFields] = useState({
        name:item.course_name,
        sem:item.sem_no,
      })
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const updateCourse =async (id)=>{
        
        try 
        {
          const res = await axios.post('http://localhost:5000/updateCourse',{courseFields,id},);
        setIsDialogOpen(false);
        setCourseFields({
            name:'',
            sem:'',
          });
        }catch(err){
            console.error(err);
        }
      }
    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button className="bg-blue-700 mr-10" variant="outline" onClick={() => setIsDialogOpen(true)} >Edit</Button>
            </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Edit Department</DialogTitle>
              <DialogDescription>
                Make changes to Course. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  className="col-span-3" 
                  value={courseFields.name}
                  onChange={(e)=>{setCourseFields((current)=>({...current,name:e.target.value}))}}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="sem" className="text-right">
                    No. of Semesters
                  </Label>
                  <Input
                    id="sem"
                    className="col-span-3" 
                    value={courseFields.sem} 
                    onChange={(e)=>{setCourseFields((current)=>({...current,sem:e.target.value}))}}
                  />
                </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={()=>updateCourse(item.course_id)}>Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
    )
  }
  
export default function Courses() {
  const [courseFields,setCourseFields] = useState({
    name:'',
    dept_name:'',
    sem:'',
  })
  const [courses,setCourses] = useState([]);
  const [departments,setDepartments] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const usernames = JSON.parse(sessionStorage.getItem('username'));
  const inst_id = usernames?.inst_id;

  
  const addCourse =async (e)=>{
    e.preventDefault();
    try 
    {
      const res = await axios.post('http://localhost:5000/addCourse',courseFields);
      console.log(res)
      fetchCourses();
      setIsDialogOpen(false);
      setCourseFields({
        name:'',
        dept_name:'',
        sem:'',
      });
    }catch(err){
        console.error(err);
    }
  }
  
  const deleteCourse = async (id)=>{
    try 
    {
      const res = await axios.post('http://localhost:5000/deleteCourse', {
        id
      });
    fetchCourses();
    }catch(err){
        console.error(err);
    }
  };

  const fetchCourses= async ()=>{
      try {
          const res = await axios.post('http://localhost:5000/getCourses',{inst_id});
          setCourses(res.data);
          console.log(courses)
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

  useEffect(() => {
    fetchCourses();
    fetchDepartments();
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
                  <form onSubmit={addCourse}>
                    <DialogHeader>
                      <DialogTitle className="text-center">Add Course</DialogTitle>
                      <DialogDescription></DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="name" className="text-right">
                            Course Name
                          </Label>
                          <Input
                            id="name"
                            className="col-span-3" 
                            value={courseFields.name} 
                            onChange={(e)=>{setCourseFields((current)=>({...current,name:e.target.value}))}}
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="sem" className="text-right">
                            No. of Semesters
                          </Label>
                          <Input
                            id="sem"
                            className="col-span-3" 
                            value={courseFields.sem} 
                            onChange={(e)=>{setCourseFields((current)=>({...current,sem:e.target.value}))}}
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="department" className="text-right">
                            Department
                          </Label>
                          <Select id="department" className="col-span-3" onValueChange={(value)=>{setCourseFields((current)=>({...current,dept_name:value}))}} >
                            <SelectTrigger id="department" className="col-span-3" >
                            <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent position="popper">
                            {
                                departments.map((items,index)=>(
                                <SelectItem value={items.dept_name} key={index}>{items.dept_name}</SelectItem>
                                ))
                            }
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
                    <TableHead className="w-[200px]">No.</TableHead>
                    <TableHead className="w-[300px]">Name</TableHead>
                    <TableHead className="w-[200px]">Semester</TableHead>

                    <TableHead className="w-[500px]">Department</TableHead>
                    <TableHead className="">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody >
                        {
                            courses.map((item,index)=>(
                            <TableRow key={index}>
                              <TableCell className="font-medium">{index+1}</TableCell>
                              <TableCell>{item.course_name}</TableCell>
                              <TableCell>{item.sem_no}</TableCell>
                              
                              <TableCell>{item.dept_name}</TableCell>
                              <TableCell className="text-right ">
                                <Edit item={item} />
                                <Button className="bg-red-600 mr-12" onClick={(e)=>deleteCourse(item.course_id)}>Delete</Button>
                              </TableCell>
                            </TableRow>
                            ))
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
