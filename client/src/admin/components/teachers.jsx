import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Teachers({ value }) {
  const [teacher, setTeacher] = useState([]);

  const fetchTeachers = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_URL}/getTeachers`, {
        params: {
          sub_id: value,
        },
      });
      if (res.data?.message) {
        console.log(res.data);
      } else {
        setTeacher(res.data);
      }
    } catch (err) {
      console.error("Error fetching Teachers:", err);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, [value]); // Added value as a dependency to refetch if it changes

  return (
    <div className="flex flex-wrap gap-2 ">
      {teacher.length > 0 ? (
        teacher.map((item, index) =>
          item?.user_name ? (
            <span
              key={index}
              className="bg-teal-50 text-teal-800 text-sm font-medium px-2.5 py-1 rounded-md shadow-sm mr-2"
            >
              {item.user_name}
            </span>
          ) : (
            <span
              key={index}
              className="bg-gray-100 text-gray-600 text-sm font-medium px-2.5 py-1 rounded-md shadow-sm mr-2"
            >
              No Teacher Assigned
            </span>
          )
        )
      ) : (
        <span className="bg-gray-100 text-gray-600 text-sm font-medium px-2.5 py-1 rounded-md shadow-sm">
          No Teacher Assigned
        </span>
      )}
    </div>
  );
}