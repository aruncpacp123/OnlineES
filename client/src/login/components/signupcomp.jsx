
import React, { useState ,useContext, useEffect} from "react";
import { Button } from "@/components/ui/button"
import {Card,CardContent,CardDescription,CardFooter,CardHeader,CardTitle,} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {Tabs,TabsContent,TabsList,TabsTrigger,} from "@/components/ui/tabs"
import {  Select,  SelectContent,  SelectItem,  SelectTrigger,  SelectValue,} from "@/components/ui/select"
import StudentSignup from "./studentSignup";
import TeacherSignUp from "./teacherSignUp";
function Signupcomp() {
  const colleges = ["CET","TKM","RIT","CUSAT"];

  return (
    <>
    <div className="flex justify-center items-center mt-3">
      <div>
        <Tabs defaultValue="student" className="w-[400px]">
          <TabsList className="grid w-full grid-cols-2 ">
            <TabsTrigger value="student">Student</TabsTrigger>
            <TabsTrigger value="teacher">Teacher</TabsTrigger>
          </TabsList>
          <TabsContent value="student">
            <StudentSignup />
          </TabsContent>
          <TabsContent value="teacher">
            <TeacherSignUp />
          </TabsContent>
        </Tabs>
      </div>
    </div>
    </>
    
  );
}

export default Signupcomp;
