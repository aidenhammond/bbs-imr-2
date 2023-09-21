// App.tsx
import React, { useState } from 'react';
import '../../styles/Team/TeamHome.css';
import Sidebar from '../Sidebar';
import TaskDetails from './TaskDetails';
import Task, { TaskFC } from './Task';

const initialTasks: Task[] = [
  {
    id: 1,
    title: 'First Task',
    description: 'This is the first task.',
    status: 'To Do',
    labels: ['Urgent'],
  },
  {
    id: 2,
    title: 'Second Task',
    description: 'This is the second task.',
    status: 'In Progress',
    labels: ['High'],
  },
];

type SidebarItem = {
    title: string;
    action?: () => void;
    dropdown?: SidebarItem[];
  };
  
  const sidebarItems: (
    | { type: 'button'; title: string; path: string }
    | { type: 'dropdown'; title: string; items: { title: string; path: string }[] }
  )[] = [
    {
      type: 'button',
      title: 'Home',
      path: '/home',
    },
    {
      type: 'dropdown',
      title: 'Project Management',
      items: [
        { title: 'Overview', path: '/project/overview' },
        { title: 'Tasks', path: '/project/tasks' },
        { title: 'Calendar', path: '/project/calendar' },
        { title: 'Files', path: '/project/files' },
        { title: 'Reports', path: '/project/reports' },
      ],
    },
    {
      type: 'button',
      title: 'Notifications',
      path: '/notifications',
    },
    {
      type: 'dropdown',
      title: 'Team',
      items: [
        { title: 'Members', path: '/team/members' },
        { title: 'Groups', path: '/team/groups' },
        { title: 'Permissions', path: '/team/permissions' },
      ],
    },
    {
      type: 'dropdown',
      title: 'Settings',
      items: [
        { title: 'Profile', path: '/settings/profile' },
        { title: 'Preferences', path: '/settings/preferences' },
        { title: 'Billing', path: '/settings/billing' },
      ],
    },
  ];
  
  
  


import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import EditTaskForm from './EditTaskForm';

const TeamHome: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isAddingTask, setIsAddingTask] = useState<boolean>(false);
  const [isEditingTask, setIsEditingTask] = useState<boolean>(false);
  const [editedTask, setEditedTask] = useState<Task | null>(null);

  const handleAddTask = (id: number, task: Task) => {
    setTasks([...tasks, task]);
    setIsAddingTask(false);
  };

  const handleEditTask = (id: number, updatedTask: Task) => {
    setTasks(tasks.map((task) => (task.id === id ? updatedTask : task)));
    setIsEditingTask(false);
    setEditedTask(null);
  };

  const handleDeleteTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const handleSelectTask = (task: Task) => {
    setSelectedTask(task);
  };

  const handleOpenEditTask = (task: Task) => {
    setIsEditingTask(true);
    setEditedTask(task);
  };

  const handleCloseEditTask = () => {
    setIsEditingTask(false);
    setEditedTask(null);
  };

  return (
    <div className="app">
      <Sidebar items={sidebarItems} />
      {selectedTask ? (
        <TaskDetails task={selectedTask} onBack={() => setSelectedTask(null)} />
      ) : (
        <div className='team-home-div'>
          <Button variant="contained" onClick={() => setIsAddingTask(true)}>
            Add Task
          </Button>
          <TableContainer className='task-table'>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell>{task.title}</TableCell>
                    <TableCell>{task.description}</TableCell>
                    <TableCell>{task.status}</TableCell>
                    <TableCell>
                      <Button onClick={() => handleSelectTask(task)}>View</Button>
                      <Button onClick={() => handleOpenEditTask(task)}>Edit</Button>
                      <Button onClick={() => handleDeleteTask(task.id)}>Delete</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      )}
      <Dialog open={isEditingTask} onClose={handleCloseEditTask}>
        <DialogTitle>Edit Task</DialogTitle>
        <DialogContent>
          <EditTaskForm task={editedTask!} onSubmit={handleEditTask} onCancel={handleCloseEditTask} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditTask}>Cancel</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={isAddingTask} onClose={() => setIsAddingTask(false)}>
        <DialogTitle>Add Task</DialogTitle>
        <DialogContent>
          <EditTaskForm
            task={{ id: tasks.length + 1, title: '', description: '', status: '' }}
            onSubmit={handleAddTask}
            onCancel={() => setIsAddingTask(false)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsAddingTask(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
  
  export default TeamHome;