import axios from 'axios';

const greetUser = async (name: string) => {
  console.log(`Hello ${name}`);
};

const sayByeToUser = async (name: string) => {
  console.log(`Bye ${name}, thanks for stopping by!`);
};

const fetchTodoById = async (todoId: any) => {
  try {
    // const todoId = parseInt(id);
    if (typeof todoId !== 'number') {
      console.log(`Stopped midway`);
      return;
    }

    const response = await axios.get(`https://jsonplaceholder.typicode.com/todos/${todoId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = response.data !== undefined ? response.data : 'Failed to fetch';
    console.log(data);
  } catch (error) {
    throw error;
  }
};
export { greetUser, sayByeToUser, fetchTodoById };
