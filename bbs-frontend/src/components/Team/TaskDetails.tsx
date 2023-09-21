// TaskDetails.tsx
import React from 'react';
import Task from './Task';

type TaskDetailsProps = {
  task: Task;
  onBack: () => void;
};

const TaskDetails: React.FC<TaskDetailsProps> = ({ task, onBack }) => (
  <div className="task-details">
    <button onClick={onBack}>Back</button>
    <h2>{task.title}</h2>
    <p>{task.description}</p>
    <p>Status: {task.status}</p>
    <p>Labels: {task.labels}</p>
  </div>
);

export default TaskDetails;
