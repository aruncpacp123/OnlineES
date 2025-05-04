// import React, { useEffect, useState } from 'react';
// import {
//   Table,
//   TableBody,
//   TableCaption,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import axios from 'axios';

// export function Student() {
//   const [student, setStudent] = useState([]);
//   const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' }); // Track sorting state
//   const usernames = JSON.parse(sessionStorage.getItem('username'));
//   const dept_id = usernames?.department;

//   const fetchStudents = async () => {
//     try {
//       const res = await axios.post(`${import.meta.env.VITE_URL}/getStudentsByDepartment`, { dept_id });
//       setStudent(res.data);
//     } catch (err) {
//       console.error("Error fetching Student Details:", err);
//     }
//   };

//   useEffect(() => {
//     fetchStudents();
//   }, []);

//   // Sorting function
//   const sortData = (key) => {
//     let direction = 'asc';
//     if (sortConfig.key === key && sortConfig.direction === 'asc') {
//       direction = 'desc';
//     }

//     const sortedArray = [...student].sort((a, b) => {
//       if (key === 'course_name') {
//         return direction === 'asc'
//           ? a.course_name.localeCompare(b.course_name)
//           : b.course_name.localeCompare(a.course_name);
//       }
//       if (key === 'current_sem') {
//         return direction === 'asc'
//           ? a.current_sem - b.current_sem
//           : b.current_sem - a.current_sem;
//       }
//       return 0;
//     });

//     setStudent(sortedArray);
//     setSortConfig({ key, direction });
//   };

//   // Helper to display sort arrow
//   const getSortArrow = (key) => {
//     if (sortConfig.key === key) {
//       return sortConfig.direction === 'asc' ? ' ↑' : ' ↓';
//     }
//     return ' ↕'; // Default arrow indicating sortable column
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       {/* Header Section */}
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-3xl font-bold text-gray-800">Students Management</h1>
//       </div>

//       {/* Table Section */}
//       <div className="bg-white rounded-xl shadow-lg p-6">
//         <Table>
//           <TableCaption className="text-gray-600 mb-4">A list of students in your department.</TableCaption>
//           <TableHeader>
//             <TableRow className="bg-gray-50">
//               <TableHead className="w-[100px] font-semibold text-gray-700">#</TableHead>
//               <TableHead className="w-[230px] font-semibold text-gray-700">Register Number</TableHead>
//               <TableHead className="w-[200px] font-semibold text-gray-700">Name</TableHead>
//               <TableHead className="w-[250px] font-semibold text-gray-700">Email</TableHead>
//               <TableHead
//                 className="w-[200px] font-semibold text-gray-700 cursor-pointer hover:text-indigo-600 transition duration-200"
//                 onClick={() => sortData('course_name')}
//               >
//                 Course{getSortArrow('course_name')}
//               </TableHead>
//               <TableHead
//                 className="font-semibold text-gray-700 cursor-pointer hover:text-indigo-600 transition duration-200"
//                 onClick={() => sortData('current_sem')}
//               >
//                 Semester{getSortArrow('current_sem')}
//               </TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {student.map((item, index) => (
//               <TableRow key={index} className="hover:bg-gray-50 transition duration-200">
//                 <TableCell className="font-medium text-gray-800">{index + 1}</TableCell>
//                 <TableCell className="text-gray-800">{item.user_regno}</TableCell>
//                 <TableCell className="text-gray-800">{item.user_name}</TableCell>
//                 <TableCell className="text-gray-800">{item.user_email}</TableCell>
//                 <TableCell className="text-gray-800">{item.course_name}</TableCell>
//                 <TableCell className="text-gray-800">{item.current_sem}</TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </div>
//     </div>
//   );
// }
import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axios from 'axios';
import { User, Mail, BookOpen, ChevronUp, ChevronDown, GraduationCap } from 'lucide-react';

export function Student() {
  const [student, setStudent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const usernames = JSON.parse(sessionStorage.getItem('username'));
  const dept_id = usernames?.department;

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await axios.post(`${import.meta.env.VITE_URL}/getStudentsByDepartment`, { dept_id });
      setStudent(res.data);
    } catch (err) {
      console.error("Error fetching Student Details:", err);
    } finally {
      setLoading(false);
    }
  };

  const sortData = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }

    const sortedArray = [...student].sort((a, b) => {
      if (key === 'course_name') {
        return direction === 'asc'
          ? a.course_name.localeCompare(b.course_name)
          : b.course_name.localeCompare(a.course_name);
      }
      if (key === 'current_sem') {
        return direction === 'asc'
          ? a.current_sem - b.current_sem
          : b.current_sem - a.current_sem;
      }
      return 0;
    });

    setStudent(sortedArray);
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'asc' ? (
        <ChevronUp className="h-4 w-4 ml-1" />
      ) : (
        <ChevronDown className="h-4 w-4 ml-1" />
      );
    }
    return <span className="inline-block w-4 h-4 ml-1"></span>;
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
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <GraduationCap className="h-8 w-8" />
              Student Management
            </h1>
            <p className="text-blue-100 mt-2">
              View and manage all students in your department
            </p>
          </div>
        </div>

        {/* Student Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow className="hover:bg-gray-50">
                <TableHead className="w-12 text-gray-600 font-semibold">#</TableHead>
                <TableHead className="text-gray-600 font-semibold">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    Student
                  </div>
                </TableHead>
                <TableHead className="text-gray-600 font-semibold">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-1" />
                    Email
                  </div>
                </TableHead>
                <TableHead
                  className="text-gray-600 font-semibold cursor-pointer hover:text-blue-600 transition-colors"
                  onClick={() => sortData('course_name')}
                >
                  <div className="flex items-center">
                    <BookOpen className="h-4 w-4 mr-1" />
                    Course
                    {getSortIcon('course_name')}
                  </div>
                </TableHead>
                <TableHead
                  className="text-gray-600 font-semibold cursor-pointer hover:text-blue-600 transition-colors"
                  onClick={() => sortData('current_sem')}
                >
                  Semester
                  {getSortIcon('current_sem')}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                      <p className="text-gray-600">Loading student data...</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : student.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-64 text-center text-gray-500">
                    No students found in your department
                  </TableCell>
                </TableRow>
              ) : (
                student.map((item, index) => (
                  <TableRow key={index} className="hover:bg-gray-50 transition-colors">
                    <TableCell className="font-medium text-gray-700">{index + 1}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{item.user_name}</span>
                        <span className="text-sm text-gray-500">{item.user_regno}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-700 truncate max-w-[200px]">
                      {item.user_email}
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
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Stats Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-500">Total Students</h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">
              {student.length}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-500">Courses</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {[...new Set(student.map(s => s.course_name))].length}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-500">Semesters</h3>
            <p className="text-3xl font-bold text-purple-600 mt-2">
              {[...new Set(student.map(s => s.current_sem))].length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}