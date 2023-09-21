import React, { useState } from 'react';
import Task from './Task';
type EditTaskFormProps = {
  task: Task;
  onSubmit: (id: number, updatedTask: Task) => void;
  onCancel: () => void;
};

const EditTaskForm: React.FC<EditTaskFormProps> = ({ task, onSubmit, onCancel }) => {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [status, setStatus] = useState(task.status);
  const [labels, setLabels] = useState(task.labels);

  const handleSubmit = (e: React.FormEvent) => {
   e.preventDefault();
    onSubmit(task.id, { id: task.id, title, description, status, labels });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Title:
        <input type="text" value={title} onChange={e => setTitle(e.target.value)} />
      </label>
      <label>
        Description:
        <textarea value={description} onChange={e => setDescription(e.target.value)} />
      </label>
      <label>
        Status:
        <select value={status} onChange={e => setStatus(e.target.value)}>
          <option value="To Do">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>
      </label>
      <label>
        Labels:
        <select value={status} onChange={e => setLabels([...labels!, e.target.value])}>
          <option value="Nice to have">Nice to have</option>
          <option value="Must have">Must have</option>
          <option value="Infrastructure">Infrastructure</option>
        </select>
      </label>
      <button type="submit">Submit</button>
      <button type="button" onClick={onCancel}>Cancel</button>
    </form>
  );
};

export default EditTaskForm;
