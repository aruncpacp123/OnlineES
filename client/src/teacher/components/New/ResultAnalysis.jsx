// ResultAnalysis.jsx
import React, { useState, useEffect } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import axios from 'axios';
import './ResultAnalysis.css';

Chart.register(...registerables);

const ResultAnalysis = () => {
    const [examId, setExamId] = useState('');
    const [exams, setExams] = useState([]);
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchExams();
    }, []);

    const fetchExams = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_URL}/exams`);
            console.log(response.data);
            setExams(response.data);
            if (response.data.length > 0) {
                setExamId(response.data[0].exam_id);
            }
        } catch (error) {
            console.error('Error fetching exams:', error);
        }
    };

    const fetchAnalysis = async () => {
        if (!examId) return;
        setLoading(true);
        try {
            const response = await axios.get(`${import.meta.env.VITE_URL}/exam-analysis/${examId}`);
            console.log(response.data)
            setAnalysis(response.data);
        } catch (error) {
            console.error('Error fetching analysis:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (examId) {
            fetchAnalysis();
        }
    }, [examId]);

    const distributionChartData = {
        labels: analysis?.distribution.map(item => `${item.score_range}-${item.score_range + 9}`),
        datasets: [
            {
                label: 'Number of Students',
                data: analysis?.distribution.map(item => item.student_count),
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
            },
        ],
    };

    const passFailChartData = {
        labels: ['Pass', 'Fail'],
        datasets: [
            {
                data: [analysis?.pass_count || 0, analysis?.fail_count || 0],
                backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)'],
                borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="result-analysis-container">
            <div className="header">
                <h1>Exam Result Analysis</h1>
                <div className="exam-selector">
                    <label htmlFor="exam-select">Select Exam:</label>
                    <select
                        id="exam-select"
                        value={examId}
                        onChange={(e) => setExamId(e.target.value)}
                        disabled={loading}
                    >
                        {exams.map(exam => (
                            <option key={exam.exam_id} value={exam.exam_id}>
                                Exam {exam.exam_id}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="loading">Loading analysis...</div>
            ) : analysis ? (
                <>
                    <div className="stats-grid">
                        <div className="stat-card">
                            <h3>Total Students</h3>
                            <p>{analysis.total_students}</p>
                        </div>
                        <div className="stat-card">
                            <h3>Average Score</h3>
                            <p>{analysis.average_score?.toFixed(1)}%</p>
                        </div>
                        <div className="stat-card">
                            <h3>Top Score</h3>
                            <p>{analysis.top_score}%</p>
                        </div>
                        <div className="stat-card">
                            <h3>Lowest Score</h3>
                            <p>{analysis.lowest_score}%</p>
                        </div>
                    </div>

                    <div className="charts-container">
                        <div className="chart-card">
                            <h3>Score Distribution</h3>
                            <div className="chart-wrapper">
                                <Bar
                                    data={distributionChartData}
                                    options={{
                                        responsive: true,
                                        scales: {
                                            y: {
                                                beginAtZero: true,
                                                title: {
                                                    display: true,
                                                    text: 'Number of Students',
                                                },
                                            },
                                            x: {
                                                title: {
                                                    display: true,
                                                    text: 'Score Range',
                                                },
                                            },
                                        },
                                    }}
                                />
                            </div>
                        </div>

                        <div className="chart-card">
                            <h3>Pass/Fail Ratio</h3>
                            <div className="chart-wrapper">
                                <Pie
                                    data={passFailChartData}
                                    options={{
                                        responsive: true,
                                        plugins: {
                                            legend: {
                                                position: 'bottom',
                                            },
                                        },
                                    }}
                                />
                            </div>
                            <div className="pass-fail-stats">
                                <p>Pass: {analysis.pass_count} ({((analysis.pass_count / analysis.total_students) * 100 || 0).toFixed(1)}%)</p>
                                <p>Fail: {analysis.fail_count} ({((analysis.fail_count / analysis.total_students) * 100 || 0).toFixed(1)}%)</p>
                            </div>
                        </div>
                    </div>

                    <div className="top-performers">
                        <h3>Top Performers</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>Rank</th>
                                    <th>Student ID</th>
                                    <th>Score</th>
                                </tr>
                            </thead>
                            <tbody>
                                {analysis.topPerformers.map((student, index) => (
                                    <tr key={student.student_regno}>
                                        <td>{index + 1}</td>
                                        <td>{student.student_regno}</td>
                                        <td>{student.total}%</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            ) : (
                <div className="no-data">No analysis data available</div>
            )}
        </div>
    );
};

export default ResultAnalysis;