//Imports
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

  //hämta assignments från databsen
  useEffect(() => {
    //referens till plats "assignments" i databasen
    const assignmentsRef = ref(database, 'assignments');
    //lyssnar på förändring i databasen
    onValue(assignmentsRef, (snapshot) => {
      //hämtar en snapshot av "assignments" i databsen och sparar i data
      const data = snapshot.val();
      //gör om data till en array i grupp [ID, objeket i databasen], om data är tom så skapas en tom array
      const assignmentsList = data ? Object.entries(data).map(([id, val]) => ({ id, ...val })) : [];
      //Uppdaterar state med listan så att de visas på hemsidan
      setAssignments(assignmentsList);
    });
  }, []);

  //Metod för att lägga till en ny uppgift i databasen. 
  const handleAddAssignment = (assignment) => {
    const assignmentsRef = ref(database, 'assignments');
    push(assignmentsRef, assignment)
      .then(() => console.log('Uppgift tillagd'))
      .catch(error => console.error('Fel vid tillägg:', error));
  };

  //Metod för att uppdatera en uppgift i databasen. 
  const handleUpdateAssignment = (id, updatedFields) => {
    const assignmentRef = ref(database, `assignments/${id}`);
    update(assignmentRef, updatedFields)
      .then(() => console.log("Uppgift uppdaterad!"))
      .catch((error) => console.error("Fel vid uppdatering:", error));
  };

  //tar bort en uppgift i databasen
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
        <MemberList onMembersLoaded={setMembers} />
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