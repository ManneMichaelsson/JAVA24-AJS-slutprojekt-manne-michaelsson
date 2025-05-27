import React, { useState } from 'react';

function AssignmentForm({ members, onAddAssignment }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('UX');  // Sätter defaultvärde till "UX"
  const [assignedTo, setAssignedTo] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const newAssignment = {
      createdAt: Date.now(),
      status: "Ny",
      title,
      category,
      assignedTo: ""
    };
    onAddAssignment(newAssignment);
    setTitle('');
    setCategory('UX');     // Reset till default igen
    setAssignedTo('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Rubrik"
        value={title}
        onChange={e => setTitle(e.target.value)}
        required
      />

      <select value={category} onChange={e => setCategory(e.target.value)} required>
        <option value="UX">UX</option>
        <option value="frontend">Frontend</option>
        <option value="backend">Backend</option>
      </select>

      <button type="submit">Lägg till uppgift</button>
    </form>
  );
}


export default AssignmentForm;
