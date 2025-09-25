import React, { useEffect, useState } from 'react';

// Define the Issue type to match the backend model
interface Issue {
  id: string;
  title: string;
  description: string | null;
  status: 'todo' | 'in_progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  assignee: string | null;
  createdAt: string;
  updatedAt: string;
}

const App: React.FC = () => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // API se data fetch karne ka function
    const fetchIssues = async () => {
      try {
        const response = await fetch('http://localhost:8000/issues');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data: Issue[] = await response.json();
        setIssues(data);
      } catch (err) {
        setError("Failed to fetch issues. Please ensure the backend server is running.");
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, []);

  if (loading) {
    return <div>Loading issues...</div>;
  }

  if (error) {
    return <div style={{ color: 'red', textAlign: 'center', marginTop: '20px' }}>{error}</div>;
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Issue Tracker</h1>
      {issues.length === 0 ? (
        <p>No issues found. Please create some using the backend API.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2' }}>
              <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>ID</th>
              <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Title</th>
              <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Status</th>
              <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Priority</th>
              <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Assignee</th>
              <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>UpdatedAt</th>
            </tr>
          </thead>
          <tbody>
            {issues.map((issue) => (
              <tr key={issue.id}>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{issue.id.substring(0, 8)}...</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{issue.title}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{issue.status}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{issue.priority}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{issue.assignee || 'N/A'}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{new Date(issue.updatedAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default App;