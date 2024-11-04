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
    const updateDepartment =async (id)=>{
        
        try 
        {
          const res = await axios.post('http://localhost:5000/updateDepartment', {
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
              <DialogTitle>Edit Department</DialogTitle>
              <DialogDescription>
                Make changes to Department Name. Click save when you're done.
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
  
export default function Departments() {
  const [name,setName] = useState("");
  const [departments,setDepartments] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const usernames = JSON.parse(sessionStorage.getItem('username'));
  const inst_id = usernames?.inst_id;

  
  const addDepartment =async (e)=>{
    e.preventDefault();
    try 
    {
      const res = await axios.post('http://localhost:5000/addDepartment', {
        name,
        inst_id
      });
    fetchDepartments();
    setIsDialogOpen(false);
    setName('');
    }catch(err){
        console.error(err);
    }
  }
  
  const deleteDepartment = async (id)=>{
    try 
    {
      const res = await axios.post('http://localhost:5000/deleteDepartment', {
        id
      });
    fetchDepartments();
    }catch(err){
        console.error(err);
    }
  };

  const fetchDepartments= async ()=>{
      try {
          const res = await axios.post('http://localhost:5000/getDepartments',{inst_id});
          setDepartments(res.data);
          console.log(departments)
        } catch (err) {
          console.error("Error fetching colleges:", err);
        }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);
  
  
  return (
    <div className=''>
        <div className="flex justify-end mr-5">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen} >
                <DialogTrigger asChild className="w-[150px]">
                  <Button variant="outline" className="mr-5 bg-slate-600 text-white mt-5" onClick={() => setIsDialogOpen(true)}>
                    ADD
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <form onSubmit={addDepartment}>
                    <DialogHeader>
                      <DialogTitle className="text-center">Add Department</DialogTitle>
                      <DialogDescription></DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-2 py-6 px-5">
                      <div className="grid grid-cols-6 items-center gap-4">
                        <Label htmlFor="name" className="text-left col-span-1">Name</Label>
                        <Input
                          id="name"
                          className="col-span-5"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
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
                <TableCaption>A list of Departments.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">No.</TableHead>
                    <TableHead className="w-[1000px]">Name</TableHead>
                    <TableHead className="">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody >
                        {
                            departments.map((item,index)=>(
                            <TableRow key={index}>
                              <TableCell className="font-medium">{index+1}</TableCell>
                              <TableCell>{item.dept_name}</TableCell>
                              <TableCell className="text-right ">
                                <Edit item={item} />
                                <Button className="bg-red-600 mr-12" onClick={(e)=>deleteDepartment(item.dept_id)}>Delete</Button>
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
