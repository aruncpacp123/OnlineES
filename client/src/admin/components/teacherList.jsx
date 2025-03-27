import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import axios from "axios";

export function TeacherList() {
  const [teachers, setTeachers] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const usernames = JSON.parse(sessionStorage.getItem("username"));
  const inst_id = usernames?.inst_id;

  const deleteTeacher = async (id) => {
    if (window.confirm("Are you sure you want to delete this teacher?")) {
      try {
        await axios.post(`${import.meta.env.VITE_URL}/deleteTeacher`, { id });
        fetchTeachers();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const fetchTeachers = async () => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_URL}/fetchTeachers`, { inst_id });
      setTeachers(res.data);
    } catch (err) {
      console.error("Error fetching Teacher Details:", err);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg mb-6 border border-gray-200">
          <div className="bg-gradient-to-r from-teal-500 to-cyan-500 p-6 rounded-t-xl">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <span className="inline-block w-3 h-3 bg-white rounded-full"></span>
              Manage Teachers
            </h2>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
          <Table className="w-full">
            <TableCaption className="text-gray-600 py-4">
              A list of Teachers
            </TableCaption>
            <TableHeader>
              <TableRow className="bg-gradient-to-r from-teal-50 to-cyan-50 hover:bg-teal-100 transition-all duration-200">
                <TableHead className="w-[100px] text-teal-700 font-semibold py-3">
                  No.
                </TableHead>
                <TableHead className="w-[200px] text-teal-700 font-semibold py-3">
                  Name
                </TableHead>
                <TableHead className="w-[250px] text-teal-700 font-semibold py-3">
                  Email
                </TableHead>
                <TableHead className="w-[150px] text-teal-700 font-semibold py-3">
                  Phone Number
                </TableHead>
                <TableHead className="w-[200px] text-teal-700 font-semibold py-3">
                  Department
                </TableHead>
                <TableHead className="w-[200px] text-center text-teal-700 font-semibold py-3 pr-6">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teachers.map((item, index) => (
                <TableRow
                  key={index}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-all duration-200"
                >
                  <TableCell className="font-medium text-gray-800 py-3">
                    {index + 1}
                  </TableCell>
                  <TableCell className="text-gray-800 py-3">{item.user_name}</TableCell>
                  <TableCell className="text-gray-800 py-3 truncate">
                    {item.user_email}
                  </TableCell>
                  <TableCell className="text-gray-800 py-3">
                    {item.user_phno || "Not provided"}
                  </TableCell>
                  <TableCell className="text-gray-800 py-3">{item.dept_name}</TableCell>
                  <TableCell className="w-[200px] text-right py-3 pr-6">
                    <Button
                      className="bg-red-500 hover:bg-red-600 text-white text-sm font-medium py-1 px-3 rounded-md shadow-sm transition-all duration-200 hover:scale-105 flex items-center gap-1"
                      onClick={() => deleteTeacher(item.user_id)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {teachers.length === 0 && (
          <p className="text-center text-gray-600 mt-6">No teachers found.</p>
        )}
      </div>
    </div>
  );
}
// import React, { useEffect, useState } from "react";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import axios from "axios";

// export function TeacherList() {
//   const [teachers, setTeachers] = useState([]);
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const usernames = JSON.parse(sessionStorage.getItem("username"));
//   const inst_id = usernames?.inst_id;

//   const deleteTeacher = async (id) => {
//     if (window.confirm("Are you sure you want to delete this teacher?")) {
//       try {
//         await axios.post(`${import.meta.env.VITE_URL}/deleteTeacher`, { id });
//         fetchTeachers();
//       } catch (err) {
//         console.error(err);
//       }
//     }
//   };

//   const fetchTeachers = async () => {
//     try {
//       const res = await axios.post(`${import.meta.env.VITE_URL}/fetchTeachers`, { inst_id });
//       setTeachers(res.data);
//     } catch (err) {
//       console.error("Error fetching Teacher Details:", err);
//     }
//   };

//   useEffect(() => {
//     fetchTeachers();
//   }, []);

//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       <div className="max-w-6xl mx-auto">
//         <Card className="bg-white rounded-xl shadow-lg mb-6 border border-gray-200">
//           <CardHeader className="bg-gradient-to-r from-teal-500 to-cyan-500 p-6 rounded-t-xl">
//             <CardTitle className="text-2xl font-bold text-white flex items-center gap-2">
//               <span className="inline-block w-3 h-3 bg-white rounded-full"></span>
//               Manage Teachers
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="p-6 flex justify-between items-center">
//             <p className="text-gray-600">
//               View and manage teachers for your institution.
//             </p>
//             <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//               <DialogTrigger asChild>
//                 <Button
//                   className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-all duration-300 hover:scale-105"
//                   onClick={() => setIsDialogOpen(true)}
//                 >
//                   + Add Teacher
//                 </Button>
//               </DialogTrigger>
//               <DialogContent className="sm:max-w-[600px] bg-white rounded-xl shadow-lg">
//                 <DialogHeader>
//                   <DialogTitle className="text-2xl font-semibold text-gray-800">
//                     Add New Teacher
//                   </DialogTitle>
//                   <DialogDescription className="text-gray-600">
//                     This feature is coming soon! Enter teacher details to add them.
//                   </DialogDescription>
//                 </DialogHeader>
//                 <div className="grid gap-6 py-6">
//                   <div className="space-y-2">
//                     <Label htmlFor="name" className="text-gray-700 font-medium">
//                       Name
//                     </Label>
//                     <Input
//                       id="name"
//                       className="border-gray-300 focus:ring-teal-500 focus:border-teal-500 rounded-md"
//                       disabled
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="email" className="text-gray-700 font-medium">
//                       Email
//                     </Label>
//                     <Input
//                       id="email"
//                       type="email"
//                       className="border-gray-300 focus:ring-teal-500 focus:border-teal-500 rounded-md"
//                       disabled
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="phone" className="text-gray-700 font-medium">
//                       Phone Number
//                     </Label>
//                     <Input
//                       id="phone"
//                       className="border-gray-300 focus:ring-teal-500 focus:border-teal-500 rounded-md"
//                       disabled
//                     />
//                   </div>
//                 </div>
//                 <DialogFooter>
//                   <Button
//                     className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-all duration-300"
//                     disabled
//                   >
//                     Add Teacher
//                   </Button>
//                 </DialogFooter>
//               </DialogContent>
//             </Dialog>
//           </CardContent>
//         </Card>

//         {teachers.length > 0 ? (
//           <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//             {teachers.map((teacher, index) => (
//               <Card
//                 key={teacher.user_id}
//                 className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-teal-200"
//               >
//                 <CardHeader className="bg-gradient-to-r from-teal-50 to-cyan-50 p-4 border-b border-gray-100">
//                   <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
//                     <span className="w-2 h-2 bg-teal-500 rounded-full shadow-sm"></span>
//                     {teacher.user_name}
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className="p-4 space-y-3">
//                   <div className="flex items-center gap-2">
//                     <span className="text-sm font-medium text-gray-600">Email:</span>
//                     <span className="text-sm text-gray-800 truncate">{teacher.user_email}</span>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <span className="text-sm font-medium text-gray-600">Phone:</span>
//                     <span className="text-sm text-gray-800">{teacher.user_phno || "Not provided"}</span>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <span className="text-sm font-medium text-gray-600">Department:</span>
//                     <span className="text-sm text-gray-800">{teacher.dept_name}</span>
//                   </div>
//                   <div className="flex justify-end gap-2 pt-2">
//                     <Button
//                       className="bg-red-500 hover:bg-red-600 text-white text-sm font-medium py-1.5 px-4 rounded-md shadow-sm transition-all duration-200 hover:scale-105 flex items-center gap-1"
//                       onClick={() => deleteTeacher(teacher.user_id)}
//                     >
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         className="w-4 h-4"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                         stroke="currentColor"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
//                         />
//                       </svg>
//                       Delete
//                     </Button>
//                   </div>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         ) : (
//           <p className="text-center text-gray-600">No teachers found.</p>
//         )}
//       </div>
//     </div>
//   );
// }