import axios from 'axios';
import { TaskFunction } from '../registry/registry.js';

const greetUser: TaskFunction = async (name: string) => {
  console.log(`Hello ${name}`);
};

const sayByeToUser: TaskFunction = async (name: string) => {
  console.log(`Bye ${name}, thanks for stopping by!`);
};

const fetchTodoById: TaskFunction = async (id: any) => {
  try {
    const todoId = typeof id !== 'number' ? parseInt(id) : id;

    const response = await axios.get(`https://jsonplaceholder.typicode.com/todos/${todoId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = response.data !== undefined ? response.data : 'Failed to fetch';
    console.log(data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Axios error
      if (error.response) {
        // Server responded with a status other than 2xx
        console.error('Error response from server:', error.response.data);
        throw new Error(`Server Error: ${error.response.status}`);
      } else if (error.request) {
        // Request was made but no response received
        console.error('No response received:', error.message);
        throw new Error('No response received from server');
      } else {
        // Other errors
        console.error('Error setting up the request:', error.message);
        throw new Error(`Request Error: ${error.message}`);
      }
    } else {
      // Non-Axios error
      console.error('An unknown error occurred:', error);
      throw new Error('An unknown error occurred');
    }
  }
};

const dataName: TaskFunction = async (params: { name: string }) => {
  console.log(params.name);
};

export { greetUser, sayByeToUser, fetchTodoById, dataName };
