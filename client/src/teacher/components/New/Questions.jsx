import React from 'react'
import { Tabs,TabsContent,TabsList,TabsTrigger,} from "@/components/ui/tabs"
import Exam from './Exam'
import Objective from './Objective'
import Subjective from './Subjective'
export default function Questions() {
  return (
    <div className="flex border-t-0 border-t-slate-800">
        <Tabs defaultValue="exam" className="min-w-full ">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="exam">Exam</TabsTrigger>
            <TabsTrigger value="quiz">Objective</TabsTrigger>
            <TabsTrigger value="subjective">Subjective</TabsTrigger>
          </TabsList>
          <TabsContent value="exam">                 
            <Exam />
          </TabsContent>
          <TabsContent value="quiz">                 
            <Objective/>
          </TabsContent>
          <TabsContent value="subjective">                 
            <Subjective/>
          </TabsContent>
        </Tabs>
    </div>
  )
}
