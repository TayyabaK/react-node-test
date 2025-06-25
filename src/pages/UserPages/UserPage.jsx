// ✅ Synchronized UserPage.js
import React, { useState, useEffect } from 'react';
import UserSidebar from './UserSidebar';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState('');
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    deadline: '',
    progress: 0,
    status: 'incomplete',
  });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('loggedInUser'));
    setLoggedInUser(storedUser?.name || 'Unknown User');
    const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    setTasks(storedTasks);
  }, []);

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!newTask.title.trim() || !newTask.description.trim()) return;

    const taskId = Date.now().toString();

    const newTaskItem = {
      _id: taskId,
      title: newTask.title,
      description: newTask.description,
      priority: newTask.priority.toLowerCase(),
      status: newTask.progress === 100 ? 'complete' : 'incomplete',
      progress: newTask.progress,
      dueDate: newTask.deadline,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      assignedTo: loggedInUser,
    };

    const updatedTasks = [...tasks, newTaskItem];
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    window.dispatchEvent(
      new StorageEvent('storage', {
        key: 'tasks',
        newValue: JSON.stringify(updatedTasks),
      })
    );
    window.dispatchEvent(new Event('tasksUpdated'));
    toast.success('Task added successfully!', { icon: '✅' });
    setNewTask({
      title: '',
      description: '',
      priority: 'medium',
      deadline: '',
      progress: 0,
      status: 'incomplete',
    });
  };

  const handleDeleteTask = (taskId) => {
    const updatedTasks = tasks.filter((task) => task._id !== taskId);
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    window.dispatchEvent(
      new StorageEvent('storage', {
        key: 'tasks',
        newValue: JSON.stringify(updatedTasks),
      })
    );
    window.dispatchEvent(new Event('tasksUpdated'));
    toast.error('Task removed successfully!', { icon: '🗑️' });
  };

  const updateProgress = (taskId, progress) => {
    const updatedTasks = tasks.map((task) =>
      task._id === taskId
        ? {
            ...task,
            progress: parseInt(progress),
            status: progress === '100' ? 'complete' : 'incomplete',
          }
        : task
    );
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    window.dispatchEvent(
      new StorageEvent('storage', {
        key: 'tasks',
        newValue: JSON.stringify(updatedTasks),
      })
    );
    window.dispatchEvent(new Event('tasksUpdated'));
  };

  return (
    <div className='flex min-h-screen bg-gray-100'>
      <UserSidebar />
      <div className='flex-1 p-6'>
        <ToastContainer position='top-right' autoClose={3000} hideProgressBar />
        <h1 className='text-4xl font-bold text-center mb-6'>
          🎯 User Task Management
        </h1>

        <form
          onSubmit={handleCreateTask}
          className='space-y-4 bg-white p-6 rounded-lg shadow-md max-w-xl mx-auto'>
          <input
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            placeholder='Task Title'
            className='w-full p-3 border rounded'
            required
          />
          <textarea
            value={newTask.description}
            onChange={(e) =>
              setNewTask({ ...newTask, description: e.target.value })
            }
            placeholder='Task Description'
            className='w-full p-3 border rounded'
            required
          />
          <div className='flex gap-4'>
            <select
              value={newTask.priority}
              onChange={(e) =>
                setNewTask({ ...newTask, priority: e.target.value })
              }
              className='w-full p-3 border rounded'>
              <option value='high'>🔥 High</option>
              <option value='medium'>⚡ Medium</option>
              <option value='low'>✅ Low</option>
            </select>
            <input
              type='date'
              value={newTask.deadline}
              onChange={(e) =>
                setNewTask({ ...newTask, deadline: e.target.value })
              }
              className='w-full p-3 border rounded'
              required
            />
          </div>
          <button
            type='submit'
            className='bg-blue-600 text-white w-full p-3 rounded'>
            Add Task
          </button>
        </form>

        <div className='mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {tasks.map((task) => (
            <div
              key={task._id}
              className='bg-white p-4 rounded shadow border-l-4 border-blue-500'>
              <h3 className='text-xl font-bold'>{task.title}</h3>
              <p>{task.description}</p>
              <p className='text-sm'>Priority: {task.priority}</p>
              <p className='text-sm'>Assigned to: {task.assignedTo}</p>
              <p className='text-sm'>Deadline: {task.dueDate}</p>
              <input
                type='range'
                min='0'
                max='100'
                value={task.progress}
                onChange={(e) => updateProgress(task._id, e.target.value)}
                className='w-full'
              />
              <button
                onClick={() => handleDeleteTask(task._id)}
                className='w-full mt-2 p-2 bg-red-600 text-white rounded'>
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserPage;
