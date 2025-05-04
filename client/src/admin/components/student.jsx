// import React, { useEffect, useState } from "react";
// import {
//   Table,
//   TableBody,
//   TableCaption,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import axios from "axios";

// export function Student() {
//   const [student, setStudent] = useState([]);
//   const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
//   const usernames = JSON.parse(sessionStorage.getItem("username"));
//   const inst_id = usernames?.inst_id;

//   const deleteStudent = async (id) => {
//     if (window.confirm("Are you sure you want to delete this student?")) {
//       try {
//         await axios.post(`${import.meta.env.VITE_URL}/deleteStudent`, { id });
//         fetchStudents();
//       } catch (err) {
//         console.error(err);
//       }
//     }
//   };

//   const fetchStudents = async () => {
//     try {
//       const res = await axios.post(`${import.meta.env.VITE_URL}/getStudents`, { inst_id });
//       setStudent(res.data);
//     } catch (err) {
//       console.error("Error fetching Student Details:", err);
//     }
//   };

//   const handleSort = (key) => {
//     let direction = "asc";
//     if (sortConfig.key === key && sortConfig.direction === "asc") {
//       direction = "desc";
//     }
//     setSortConfig({ key, direction });

//     const sortedStudents = [...student].sort((a, b) => {
//       if (key === "course_name") {
//         return direction === "asc"
//           ? a.course_name.localeCompare(b.course_name)
//           : b.course_name.localeCompare(a.course_name);
//       }
//       if (key === "current_sem") {
//         return direction === "asc"
//           ? a.current_sem - b.current_sem
//           : b.current_sem - a.current_sem;
//       }
//       return 0;
//     });
//     setStudent(sortedStudents);
//   };

//   useEffect(() => {
//     fetchStudents();
//   }, []);

//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       <div className="max-w-6xl mx-auto">
//         <div className="bg-white rounded-xl shadow-lg mb-6 border border-gray-200">
//           <div className="bg-gradient-to-r from-indigo-500 to-blue-500 p-6 rounded-t-xl">
//             <h2 className="text-2xl font-bold text-white flex items-center gap-2">
//               <span className="inline-block w-3 h-3 bg-white rounded-full"></span>
//               Manage Students
//             </h2>
//           </div>
//           {/* <div className="p-6">
//             <p className="text-gray-600">
//               View and manage students for your institution.
//             </p>
//           </div> */}
//         </div>

//         <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
//           <Table className="w-full">
//             <TableCaption className="text-gray-600 py-4">
//               A list of Students
//             </TableCaption>
//             <TableHeader>
//               <TableRow className="bg-gradient-to-r from-indigo-50 to-blue-50 hover:bg-indigo-100 transition-all duration-200">
//                 <TableHead className="w-[100px] text-indigo-700 font-semibold py-3">
//                   No.
//                 </TableHead>
//                 <TableHead className="w-[200px] text-indigo-700 font-semibold py-3">
//                   Register Number
//                 </TableHead>
//                 <TableHead className="w-[200px] text-indigo-700 font-semibold py-3">
//                   Name
//                 </TableHead>
//                 <TableHead className="w-[250px] text-indigo-700 font-semibold py-3">
//                   Email
//                 </TableHead>
//                 <TableHead
//                   className="w-[200px] text-indigo-700 font-semibold py-3 cursor-pointer hover:text-indigo-900"
//                   onClick={() => handleSort("course_name")}
//                 >
//                   <div className="flex items-center gap-1">
//                     Course
//                     {sortConfig.key === "course_name" && (
//                       <span>
//                         {sortConfig.direction === "asc" ? (
//                           <svg
//                             xmlns="http://www.w3.org/2000/svg"
//                             className="w-4 h-4"
//                             fill="none"
//                             viewBox="0 0 24 24"
//                             stroke="currentColor"
//                           >
//                             <path
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                               strokeWidth={2}
//                               d="M5 15l7-7 7 7"
//                             />
//                           </svg>
//                         ) : (
//                           <svg
//                             xmlns="http://www.w3.org/2000/svg"
//                             className="w-4 h-4"
//                             fill="none"
//                             viewBox="0 0 24 24"
//                             stroke="currentColor"
//                           >
//                             <path
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                               strokeWidth={2}
//                               d="M19 9l-7 7-7-7"
//                             />
//                           </svg>
//                         )}
//                       </span>
//                     )}
//                   </div>
//                 </TableHead>
//                 <TableHead
//                   className="w-[150px] text-indigo-700 font-semibold py-3 cursor-pointer hover:text-indigo-900"
//                   onClick={() => handleSort("current_sem")}
//                 >
//                   <div className="flex items-center gap-1">
//                     Semester
//                     {sortConfig.key === "current_sem" && (
//                       <span>
//                         {sortConfig.direction === "asc" ? (
//                           <svg
//                             xmlns="http://www.w3.org/2000/svg"
//                             className="w-4 h-4"
//                             fill="none"
//                             viewBox="0 0 24 24"
//                             stroke="currentColor"
//                           >
//                             <path
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                               strokeWidth={2}
//                               d="M5 15l7-7 7 7"
//                             />
//                           </svg>
//                         ) : (
//                           <svg
//                             xmlns="http://www.w3.org/2000/svg"
//                             className="w-4 h-4"
//                             fill="none"
//                             viewBox="0 0 24 24"
//                             stroke="currentColor"
//                           >
//                             <path
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                               strokeWidth={2}
//                               d="M19 9l-7 7-7-7"
//                             />
//                           </svg>
//                         )}
//                       </span>
//                     )}
//                   </div>
//                 </TableHead>
//                 <TableHead className="text-right text-indigo-700 font-semibold py-3 pr-6">
//                   Actions
//                 </TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {student.map((item, index) => (
//                 <TableRow
//                   key={index}
//                   className="border-b border-gray-100 hover:bg-gray-50 transition-all duration-200"
//                 >
//                   <TableCell className="font-medium text-gray-800 py-3">
//                     {index + 1}
//                   </TableCell>
//                   <TableCell className="text-gray-800 py-3">{item.user_regno}</TableCell>
//                   <TableCell className="text-gray-800 py-3">{item.user_name}</TableCell>
//                   <TableCell className="text-gray-800 py-3 truncate">
//                     {item.user_email}
//                   </TableCell>
//                   <TableCell className="text-gray-800 py-3">{item.course_name}</TableCell>
//                   <TableCell className="text-gray-800 py-3">{item.current_sem}</TableCell>
//                   <TableCell className="text-right py-3 pr-6">
//                     <Button
//                       className="bg-red-500 hover:bg-red-600 text-white text-sm font-medium py-1 px-3 rounded-md shadow-sm transition-all duration-200 hover:scale-105 flex items-center gap-1"
//                       onClick={() => deleteStudent(item.user_id)}
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
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </div>

//         {student.length === 0 && (
//           <p className="text-center text-gray-600 mt-6">No students found.</p>
//         )}
//       </div>
//     </div>
//   );
// }
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
import axios from "axios";
import { User, Mail, BookOpen, School, Trash2, ChevronUp, ChevronDown } from "lucide-react";

export function Student() {
  const [student, setStudent] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [loading, setLoading] = useState(true);
  const usernames = JSON.parse(sessionStorage.getItem("username"));
  const inst_id = usernames?.inst_id;

  const deleteStudent = async (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        await axios.post(`${import.meta.env.VITE_URL}/deleteStudent`, { id });
        fetchStudents();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await axios.post(`${import.meta.env.VITE_URL}/getStudents`, { inst_id });
      setStudent(res.data);
    } catch (err) {
      console.error("Error fetching Student Details:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    const sortedStudents = [...student].sort((a, b) => {
      if (key === "course_name") {
        return direction === "asc"
          ? a.course_name.localeCompare(b.course_name)
          : b.course_name.localeCompare(a.course_name);
      }
      if (key === "current_sem") {
        return direction === "asc"
          ? a.current_sem - b.current_sem
          : b.current_sem - a.current_sem;
      }
      return 0;
    });
    setStudent(sortedStudents);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                  <User className="h-8 w-8" />
                  Student Management
                </h1>
                <p className="text-blue-100 mt-2">
                  View and manage all students in your institution
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <p className="text-white font-medium">
                  Total Students: <span className="text-yellow-300">{student.length}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Student Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow className="hover:bg-gray-50">
                <TableHead className="w-20 text-gray-600 font-semibold">
                  No.
                </TableHead>
                <TableHead className="text-gray-600 font-semibold">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    Student
                  </div>
                </TableHead>
                <TableHead className="text-gray-600 font-semibold">
                  <div className="flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    Email
                  </div>
                </TableHead>
                <TableHead
                  className="text-gray-600 font-semibold cursor-pointer hover:text-blue-600 transition-colors"
                  onClick={() => handleSort("course_name")}
                >
                  <div className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4" />
                    Course
                    {sortConfig.key === "course_name" && (
                      sortConfig.direction === "asc" ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )
                    )}
                  </div>
                </TableHead>
                <TableHead
                  className="text-gray-600 font-semibold cursor-pointer hover:text-blue-600 transition-colors"
                  onClick={() => handleSort("current_sem")}
                >
                  <div className="flex items-center gap-1">
                    <School className="h-4 w-4" />
                    Semester
                    {sortConfig.key === "current_sem" && (
                      sortConfig.direction === "asc" ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )
                    )}
                  </div>
                </TableHead>
                <TableHead className="text-right text-gray-600 font-semibold">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                      <p className="text-gray-600">Loading student data...</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : student.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-64 text-center text-gray-500">
                    No students found in your institution
                  </TableCell>
                </TableRow>
              ) : (
                student.map((item, index) => (
                  <TableRow key={index} className="hover:bg-gray-50 transition-colors">
                    <TableCell className="font-medium text-gray-700">
                      {index + 1}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{item.user_name}</span>
                        <span className="text-sm text-gray-500">{item.user_regno}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-700">
                      <div className="truncate max-w-[200px]">{item.user_email}</div>
                    </TableCell>
                    <TableCell className="text-gray-700">
                      <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                        {item.course_name}
                      </span>
                    </TableCell>
                    <TableCell className="text-gray-700">
                      <span className="px-2 py-1 bg-purple-50 text-purple-700 rounded-full text-sm">
                        Semester {item.current_sem}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteStudent(item.user_id)}
                        className="flex items-center gap-1 hover:scale-105 transition-transform"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Empty State */}
        {!loading && student.length === 0 && (
          <div className="mt-8 text-center">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <User className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-700">No students found</h3>
            <p className="text-gray-500 mt-1">
              There are currently no students registered in your institution
            </p>
          </div>
        )}
      </div>
    </div>
  );
}