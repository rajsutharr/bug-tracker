import axios from 'axios';

// Use localhost for better compatibility with most CORS configurations
const API = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
});

// 1. Fetch all issues
export const getIssues = async () => {
  const response = await API.get('/issues/');
  return response.data;
};

// 2. Create a new issue
export const createIssue = async (issueData) => {
  const response = await API.post('/issues/', issueData);
  return response.data;
};

/**
 * 3. Update an issue (Day 8-11 Fix)
 * If the card "snaps back," it's often because the backend rejects the 'id'.
 * This version strips the ID out to ensure the backend only gets the data it needs to change.
 */
export const updateIssue = async (issueId, updateData) => {
  // We remove 'id' from the data sent to the body because FastAPI 
  // usually takes the ID from the URL path, not the request body.
  const { id, ...dataToSend } = updateData; 
  
  const response = await API.put(`/issues/${issueId}`, dataToSend);
  return response.data;
};

// 4. Delete an issue
export const deleteIssue = async (issueId) => {
  const response = await API.delete(`/issues/${issueId}`);
  return response.data;
};