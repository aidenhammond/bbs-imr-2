import React from 'react';

type TaskProps = {
  task: Task;
  onSelect: (task: TaskProps['task']) => void;
};

type Task = {
    id: number;
    title: string;
    description: string;
    status: string;
    labels?: string[];
  };

export const TaskFC: React.FC<TaskProps> = ({ task, onSelect }) => {
  return (
    <div onClick={() => onSelect(task)}>
      <h2>{task.title}</h2>
      <p>Status: {task.status}</p>
      <p>Labels: {task.labels}</p>
    </div>
  );
};

export default Task;
