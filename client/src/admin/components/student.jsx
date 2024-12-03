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

  import axios from 'axios'
  function Edit({item}){
    const [name,setName] = useState(item.dept_name);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const updateStudent =async (id)=>{
        
        try 
        {
          const res = await axios.post(`${import.meta.env.VITE_URL}/updateDepartment`, {
            name,
            id
          });
        setIsDialogOpen(false);
        setName('');
        }catch(err){
            console.error(err);
        }
      }
    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button className="bg-blue-700 mr-10" variant="outline" onClick={() => setIsDialogOpen(true)} >Edit</Button>
            </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Student</DialogTitle>
              <DialogDescription>
                Make changes to Student Details. Click save when you're done.
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
                  value={name} 
                  onChange={(e) => {setName(e.target.value);}}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={()=>updateDepartment(item.dept_id)}>Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
    )
  }
  
export function Student() {
  const [name,setName] = useState("");
  const [departments,setDepartments] = useState([]);
  const [student,setStudent] = useState([])
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const usernames = JSON.parse(sessionStorage.getItem('username'));
  const inst_id = usernames?.inst_id;
  
  const deleteStudent = async (id)=>{
    try 
    {
      const res = await axios.post(`${import.meta.env.VITE_URL}/deleteStudent`, {
        id
      });
    fetchStudents();
    }catch(err){
        console.error(err);
    }
  };

  const fetchStudents= async ()=>{
      try {
          const res = await axios.post(`${import.meta.env.VITE_URL}/getStudents`,{inst_id});
          setStudent(res.data);
        } catch (err) {
          console.error("Error fetching Student Details:", err);
        }
  };

  useEffect(() => {
    fetchStudents();
  }, []);
  
  
  return (
    <div className=''>
        <div className="flex justify-end mr-5">
            
        </div>
        <div className='mt-5 m-7'>
            <Table className="">
                <TableCaption>A list of Students.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">No.</TableHead>
                    <TableHead className="w-[230px]">Register Number.</TableHead>
                    <TableHead className="w-[200px]">Name</TableHead>
                    <TableHead className="w-[200px]">Email.</TableHead>
                    {/* <TableHead className="w-[200px]">Date of Birth.</TableHead> */}
                    <TableHead className="">Course</TableHead>
                    <TableHead className="">Semester</TableHead>
                    <TableHead className="">Actions</TableHead>

                  </TableRow>
                </TableHeader>
                <TableBody >
                        {
                            student.map((item,index)=>(
                            <TableRow key={index}>
                              <TableCell className="font-medium">{index+1}</TableCell>
                              <TableCell>{item.user_regno}</TableCell>
                              <TableCell>{item.user_name}</TableCell>
                              <TableCell>{item.user_email}</TableCell>
                              {/* <TableCell>{item.user_dob}</TableCell> */}
                              
                              <TableCell>{item.course_name}</TableCell>
                              <TableCell>{item.current_sem}</TableCell>
                              <TableCell className="text-right ">
                                {/* <Edit item={item} /> */}
                                <Button className="bg-red-600 mr-12" onClick={(e)=>deleteStudent(item.user_id)}>Delete</Button>
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
    </div>
    
  )
}
