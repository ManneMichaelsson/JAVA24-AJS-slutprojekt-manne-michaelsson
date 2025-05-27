// src/components/MemberList.jsx
import React, { useState, useEffect } from 'react';
import { database } from '../firebase/firebase';
import { ref, onValue } from 'firebase/database';

function MemberList({ onMembersLoaded }) {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const membersRef = ref(database, 'members');
    onValue(membersRef, (snapshot) => {
      const data = snapshot.val();
      const membersList = data ? Object.entries(data).map(([id, val]) => ({ id, ...val })) : [];
      setMembers(membersList);
      if (onMembersLoaded) {
        onMembersLoaded(membersList);
      }
    });
  }, []);

  return (
    <div>
      <h2>Medlemmar:</h2>
      <ul>
        {members.map((member) => (
          <li key={member.id}>
            {member.name} ({member.roles.join(', ')})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MemberList;
