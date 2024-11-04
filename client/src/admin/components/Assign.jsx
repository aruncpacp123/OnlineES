import React, { useEffect, useState } from 'react'
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
export default function Assign({sub_id,dept_id,sub_name}) {
    const [id,setId] = useState(0);
    const [teachers,setTeachers] = useState([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const fetchTeachers= async ()=>{
        try {
            const res = await axios.get(`http://localhost:5000/fetchTeachers/${dept_id}`);
            if(res.data.length >0){
              setTeachers(res.data);
            }
            else
              setTeachers([]);
          } catch (err) {
            console.error("Error fetching Teachers:", err);
          }
      };
    const assignTeacher =async ()=>{
        
        try 
        {
          const res = await axios.post('http://localhost:5000/assignTeacher', {
            sub_id,
            id
          });
        setIsDialogOpen(false);
        setId(0);
        }catch(err){
            console.error(err);
        }
      }
      useEffect(()=>{
        fetchTeachers();
      },[])
    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button className="bg-green-600 mr-10" variant="outline" onClick={() => setIsDialogOpen(true)} >Assign</Button>
            </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Assign Teacher</DialogTitle>
              <DialogDescription>
                Assign teachers to specific subject
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Subject Name
                </Label>
                <Input
                  id="name"
                  className="col-span-3" 
                  value={sub_name}
                  readOnly
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="department" className="text-center">
                  Teachers
                </Label>
                <Select id="department" className="col-span-3" onValueChange={(value)=>{setId(parseInt(value,10))}} >
                  <SelectTrigger id="department" className="col-span-3" >
                  <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                  {
                      teachers.map((items,index)=>(
                      <SelectItem value={String(items.user_id)} key={index}>{items.user_name}</SelectItem>
                      ))
                  }
                  </SelectContent>
                </Select>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={()=>assignTeacher()}>Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
    )
}
