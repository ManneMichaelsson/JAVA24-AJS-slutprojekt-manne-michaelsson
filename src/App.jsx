import React, { useState, useEffect } from 'react';
import { database } from './firebase/firebase';
import { ref, onValue, push, update, remove } from "firebase/database";
import AssignmentForm from './components/AssignmentForm';
import MemberForm from './components/MemberForm';
import AssignmentList from './components/AssignmentList';
import MemberList from './components/MemberList';

function App() {
  const [members, setMembers] = useState([]);
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    const assignmentsRef = ref(database, 'assignments');
    onValue(assignmentsRef, (snapshot) => {
      const data = snapshot.val();
      const assignmentsList = data ? Object.entries(data).map(([id, val]) => ({ id, ...val })) : [];
      setAssignments(assignmentsList);
    });
  }, []);

  const handleAddAssignment = (assignment) => {
    const assignmentsRef = ref(database, 'assignments');
    push(assignmentsRef, assignment)
      .then(() => console.log('Uppgift tillagd!'))
      .catch(error => console.error('Fel vid tillägg:', error));
  };

  const handleUpdateAssignment = (id, updatedFields) => {
    const assignmentRef = ref(database, `assignments/${id}`);
    update(assignmentRef, updatedFields)
      .then(() => console.log("Uppgift uppdaterad!"))
      .catch((error) => console.error("Fel vid uppdatering:", error));
  };

  const deleteAssignment = (id) => {
    const assignmentRef = ref(database, `assignments/${id}`);
    remove(assignmentRef)
      .then(() => console.log("Uppgiften raderad!"))
      .catch((error) => console.error("Fel vid radering av uppgift.", error));
  };

  return (
    <div>
      <div id="addAssignmentsDiv">
        <h1>Lägg till uppgift:</h1>
        <AssignmentForm members={members} onAddAssignment={handleAddAssignment} />
      </div>

      <div id="membersDiv">
        <h1>Lägg till medlem:</h1>
        <MemberForm />
        <MemberList onMembersLoaded={setMembers} /> {/* 👈 Hämtar och sätter */}
      </div>

      <div id="assignmentListDiv">
        <h1>Uppgifter:</h1>
        <AssignmentList
          assignments={assignments}
          members={members}
          onUpdateAssignment={handleUpdateAssignment}
          deleteAssignment={deleteAssignment}
        />
      </div>
    </div>
  );
}

export default App;