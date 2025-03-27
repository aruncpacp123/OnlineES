import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";

export default function TeacherLiveDashboard() {
  const { examid } = useParams(); // Extract examId from URL
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wsConnections, setWsConnections] = useState({});

  // Fetch students attempting the exam
  const fetchStudents = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_URL}/teacher/exam/${examid}/students`);
      setStudents(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching students:", err);
      setLoading(false);
    }
  };

  // Initialize WebSocket connections for live video feeds
  const initializeWebSockets = () => {
    const newConnections = {};
    students.forEach((student) => {
      const ws = new WebSocket(`ws://localhost:5000/video/${examid}/${student.user_id}`);
      ws.onopen = () => console.log(`WebSocket opened for student ${student.user_id}`);
      ws.onmessage = (event) => {
        const videoElement = document.getElementById(`video-${student.user_id}`);
        if (videoElement) {
          videoElement.src = URL.createObjectURL(new Blob([event.data], { type: "image/jpeg" }));
        }
      };
      ws.onclose = () => console.log(`WebSocket closed for student ${student.user_id}`);
      ws.onerror = (err) => console.error(`WebSocket error for student ${student.user_id}:`, err);
      newConnections[student.user_id] = ws;
    });
    setWsConnections(newConnections);
  };

  // Cleanup WebSocket connections
  const cleanupWebSockets = () => {
    Object.values(wsConnections).forEach((ws) => ws.close());
  };

  useEffect(() => {
    fetchStudents();
    return () => cleanupWebSockets(); // Cleanup on unmount
  }, [examid]);

  useEffect(() => {
    if (students.length > 0) {
      initializeWebSockets();
    }
  }, [students]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <Card className="bg-white rounded-xl shadow-lg mb-6 border border-gray-200">
          <CardHeader className="bg-gradient-to-r from-indigo-500 to-blue-500 p-6 rounded-t-xl">
            <CardTitle className="text-2xl font-bold text-white flex items-center gap-2">
              <span className="inline-block w-3 h-3 bg-white rounded-full"></span>
              Live Exam Monitoring - Exam ID: {examid}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-gray-600">
              Monitor students attempting the exam in real-time via live camera feeds.
            </p>
          </CardContent>
        </Card>

        {loading ? (
          <p className="text-center text-gray-600 font-mono font-extrabold py-10">LOADING...</p>
        ) : students.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {students.map((student) => (
              <Card
                key={student.user_id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <CardHeader className="bg-indigo-50 p-4">
                  <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <span className="inline-block w-2 h-2 bg-indigo-500 rounded-full"></span>
                    {student.username}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="relative aspect-video bg-gray-200 rounded-lg overflow-hidden">
                    <img
                      id={`video-${student.user_id}`}
                      className="w-full h-full object-cover"
                      alt={`${student.username}'s live feed`}
                    />
                    <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                      Live
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600">No students are currently attempting this exam.</p>
        )}
      </div>
    </div>
  );
}