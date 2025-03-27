import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import axios from 'axios';
import { useParams } from 'react-router-dom';

export default function Subjective() {
  const { examid } = useParams();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [newQuestion, setNewQuestion] = useState({
    question_title: '',
    mark: '',
  });

  // Fetch subjective questions
  const fetchQuestions = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_URL}/exams/${examid}/subjective/questions`);
      setQuestions(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching subjective questions:', err);
      setLoading(false);
    }
  };

  // Add new question
  const addQuestion = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_URL}/exams/${examid}/subjective/questions`, newQuestion);
      setAddDialogOpen(false);
      setNewQuestion({ question_title: '', mark: '' });
      fetchQuestions();
    } catch (err) {
      console.error('Error adding question:', err);
    }
  };

  // Update question
  const updateQuestion = async () => {
    try {
      await axios.put(`${import.meta.env.VITE_URL}/exams/${examid}/subjective/questions/${selectedQuestion.question_id}`, selectedQuestion);
      setEditDialogOpen(false);
      fetchQuestions();
    } catch (err) {
      console.error('Error updating question:', err);
    }
  };

  // Delete question
  const deleteQuestion = async (questionId) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      try {
        await axios.delete(`${import.meta.env.VITE_URL}/exams/${examid}/subjective/questions/${questionId}`);
        fetchQuestions();
      } catch (err) {
        console.error('Error deleting question:', err);
      }
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [examid]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Manage Subjective Questions</h1>
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300">
              + Add Question
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] bg-white rounded-xl shadow-lg">
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold text-gray-800">Add New Question</DialogTitle>
              <DialogDescription className="text-gray-600">Enter the details for the new subjective question.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-6">
              <div className="space-y-2">
                <Label htmlFor="question_title" className="text-gray-700 font-medium">Question</Label>
                <Input
                  id="question_title"
                  value={newQuestion.question_title}
                  onChange={(e) => setNewQuestion({ ...newQuestion, question_title: e.target.value })}
                  className="border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mark" className="text-gray-700 font-medium">Mark</Label>
                <Input
                  id="mark"
                  type="number"
                  value={newQuestion.mark}
                  onChange={(e) => setNewQuestion({ ...newQuestion, mark: e.target.value })}
                  className="border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={addQuestion}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-300"
              >
                Add Question
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Questions List */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <p className="col-span-full text-center text-gray-600 font-mono font-extrabold py-10">LOADING...</p>
        ) : questions.length > 0 ? (
          questions.map((question) => (
            <Card
              key={question.question_id}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-indigo-200 overflow-hidden"
            >
              <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4">
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <span className="inline-block w-2 h-2 bg-purple-500 rounded-full"></span>
                  {question.question_title}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 text-gray-700">
                  <span className="w-6 h-6 flex items-center justify-center rounded-full bg-purple-500 text-white text-sm font-semibold">
                    M
                  </span>
                  <p className="text-gray-700">
                    <span className="font-medium">Mark:</span> {question.mark}
                  </p>
                </div>
              </CardContent>
              <CardFooter className="p-4 bg-gray-50 flex justify-end space-x-3 border-t border-gray-100">
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1.5 px-4 rounded-lg shadow-sm transition-all duration-200 hover:scale-105"
                  onClick={() => {
                    setSelectedQuestion(question);
                    setEditDialogOpen(true);
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Edit
                </Button>
                <Button
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold py-1.5 px-4 rounded-lg shadow-sm transition-all duration-200 hover:scale-105"
                  onClick={() => deleteQuestion(question.question_id)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4 mr-1"
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
              </CardFooter>
            </Card>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-600">No subjective questions found for this exam.</p>
        )}
      </div>

      {/* Edit Dialog */}
      {selectedQuestion && (
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="sm:max-w-[600px] bg-white rounded-xl shadow-lg">
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold text-gray-800">Edit Question</DialogTitle>
              <DialogDescription className="text-gray-600">Update the subjective question details below.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-6">
              <div className="space-y-2">
                <Label htmlFor="edit_question_title" className="text-gray-700 font-medium">Question</Label>
                <Input
                  id="edit_question_title"
                  value={selectedQuestion.question_title}
                  onChange={(e) => setSelectedQuestion({ ...selectedQuestion, question_title: e.target.value })}
                  className="border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_mark" className="text-gray-700 font-medium">Mark</Label>
                <Input
                  id="edit_mark"
                  type="number"
                  value={selectedQuestion.mark}
                  onChange={(e) => setSelectedQuestion({ ...selectedQuestion, mark: e.target.value })}
                  className="border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={updateQuestion}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-300"
              >
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}