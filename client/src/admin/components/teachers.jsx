import React, { useEffect,useState } from 'react'
import axios from 'axios';
export default function Teachers({value}) {
  const [teacher,setTeacher] = useState([]);
    const fetchTeachers= async ()=>{
        try {
            const res = await axios.get('http://localhost:5000/getTeachers',{
                params:{
                    sub_id:value
                }
            });
            if(res.data?.message){
              console.log(res.data)
            }
            else
              setTeacher(res.data);
          } catch (err) {
            console.error("Error fetching Teachers:", err);
          }
      };

    useEffect(()=>{
        fetchTeachers();
    },[])
  return (
    <>
    {
        teacher.map((item)=>(item?.user_name ? item.user_name + " , " :"No teacher Assigned"))
    }
    </>
  )
}
