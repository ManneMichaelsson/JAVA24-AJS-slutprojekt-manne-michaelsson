import React, { useState } from 'react';
import { ref, push } from "firebase/database";
import { database } from '../firebase/firebase';

function MemberForm() {
  const [name, setName] = useState('');
  const [selectedRoles, setSelectedRoles] = useState([]);

  const roles = ["ux", "frontend", "backend"]; // allt små bokstäver

const handleRoleChange = (e) => {
  const role = e.target.value.toLowerCase();  // gör alltid lowercase
  if (e.target.checked) {
    setSelectedRoles([...selectedRoles, role]);
  } else {
    setSelectedRoles(selectedRoles.filter(r => r !== role));
  }
};

const handleSubmit = (e) => {
  e.preventDefault();

  if (!name.trim()) {
    alert("Ange ett namn");
    return;
  }

  if (selectedRoles.length === 0) {
    alert("Välj minst en roll");
    return;
  }

  const membersRef = ref(database, 'members');

  // Gör alla roller lowercase även här för säkerhets skull
  const normalizedRoles = selectedRoles.map(r => r.toLowerCase());

  push(membersRef, {
    name: name.trim(),
    roles: normalizedRoles
  })
  .then(() => {
    console.log("Ny medlem tillagd:", name);
    setName('');
    setSelectedRoles([]);
  })
  .catch(error => {
    console.error("Fel vid tillägg av medlem:", error);
  });
};

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="text" 
        placeholder="Namn" 
        value={name} 
        onChange={e => setName(e.target.value)} 
        required 
      />

      <div>
        {roles.map(role => (
          <label key={role} style={{ marginRight: '10px' }}>
            <input 
              type="checkbox" 
              value={role} 
              checked={selectedRoles.includes(role)} 
              onChange={handleRoleChange} 
            />
            {role}
          </label>
        ))}
      </div>

      <button type="submit">Lägg till medlem</button>
    </form>
  );
}

export default MemberForm;
