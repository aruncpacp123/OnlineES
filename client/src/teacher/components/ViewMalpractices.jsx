import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { AlertCircle, User, Users, EyeOff, Clock, AlertTriangle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function ViewMalpractices({ examDetails,setList }) {
  const [malpractices, setMalpractices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMalpractices = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_URL}/malpractice/${examDetails.user_regno}/${examDetails.exam_id}`
      );
      setMalpractices(response.data.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch malpractice data');
      setLoading(false);
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMalpractices();
  }, [examDetails]);

  const getMalpracticeIcon = (type) => {
    switch (type) {
      case 'NO_FACE':
        return <User className="h-5 w-5 text-red-500" />;
      case 'MULTIPLE_FACES':
        return <Users className="h-5 w-5 text-orange-500" />;
      case 'UNAUTHORIZED_PERSON':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getMalpracticeTitle = (type) => {
    switch (type) {
      case 'NO_FACE':
        return 'No Face Detected';
      case 'MULTIPLE_FACES':
        return 'Multiple Persons Detected';
      case 'UNAUTHORIZED_PERSON':
        return 'Unauthorized Person';
      default:
        return 'Malpractice Detected';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-6 w-6 text-red-500" />
              <span>Malpractice Incidents</span>
            </CardTitle>
            <div className="text-sm text-gray-500">
              Student: {examDetails.user_name} ({examDetails.user_regno})
            </div>
          </CardHeader>

          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            ) : error ? (
              <div className="text-center text-red-500 py-8">{error}</div>
            ) : malpractices.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                No malpractice incidents recorded for this student
              </div>
            ) : (
              <div className="space-y-4">
                {malpractices.map((incident, index) => (
                  <Card key={index} className="border-l-4 border-red-500">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="mt-1">
                          {getMalpracticeIcon(incident.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium">
                              {getMalpracticeTitle(incident.type)}
                            </h3>
                            <span className="text-sm text-gray-500">
                              {new Date(incident.created_at).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {incident.type === 'NO_FACE' && 'No face was detected during the exam.'}
                            {incident.type === 'MULTIPLE_FACES' && 'Multiple faces were detected in the camera view.'}
                            {incident.type === 'UNAUTHORIZED_PERSON' && 'The detected face did not match the registered student.'}
                          </p>
                          {incident.image_path && (
                            <div className="mt-3">
                              <img
                                src={`${import.meta.env.VITE_STORAGE_URL}/${incident.image_path}`}
                                alt="Malpractice evidence"
                                className="rounded-md border w-full max-w-xs"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>

          <CardFooter className="flex justify-end">
            <Button variant="outline" onClick={() => setList(true)}>
                {/* onClick={() => window.history.back()} */}
              Back to List
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}