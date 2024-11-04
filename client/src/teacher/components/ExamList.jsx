import React from 'react'
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

export default function () {
  return (
    <div>
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
                          <TableRow >
                            <TableCell className="font-medium">1</TableCell>
                            <TableCell>hello</TableCell>
                            <TableCell className="text-right ">
                              <Button className="bg-red-600 mr-12">Delete</Button>
                            </TableCell>
                          </TableRow>
                          <TableRow >
                            <TableCell className="font-medium">2</TableCell>
                            <TableCell>Welcome</TableCell>
                            <TableCell className="text-right ">
                              <Button className="bg-red-600 mr-12">Delete</Button>
                            </TableCell>
                          </TableRow>
                          <TableRow >
                            <TableCell className="font-medium">3</TableCell>
                            <TableCell>Hi</TableCell>
                            <TableCell className="text-right ">
                              <Button className="bg-red-600 mr-12">Delete</Button>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
    </div>
  )
}
