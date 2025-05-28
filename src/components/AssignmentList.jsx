import React, { useState } from 'react';

function AssignmentList({ assignments, members, onUpdateAssignment, deleteAssignment }) {
  const [filterMember, setFilterMember] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [sortField, setSortField] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  const labelNew = "Ny";
  const labelOngoing = "Pågående";
  const labelDone = "Färdig";

  //Metod för att kolla vilken färg som div till assignment ska ha beroende på status på assignment
  function CheckStatusColor(assignment) {
    if (assignment.status === labelNew) return "white";
    if (assignment.status === labelOngoing) return "yellow";
    if (assignment.status === labelDone) return "lightgreen";
    return "white";
  }

  //funktion för att ta bort en assignment, om status på assignment är "färdig" så syns knappen och kör deleteAssignment metoden med ID som input
  function RemoveAssignmentButton({ assignment }) {
    if (assignment.status === labelDone) {
      return <button onClick={() => deleteAssignment(assignment.id)}>Radera</button>;
    }
    return null;
  }

  //Funktion för att uppdatera assignment från status "pågående" till status "färdig", skapar en kopia av nuvarande assignment och ändrar status och uppdaterar databasen
  function MakeAssignmentDone({ assignment, onUpdateAssignment }) {
    if (assignment.status === labelOngoing) {
      const markAsDone = () => {
        onUpdateAssignment(assignment.id, { ...assignment, status: labelDone });
      };
      return <button onClick={markAsDone}>Färdig</button>;
    }
    return null;
  }

  //funktion för att ta fram vilka medlemmar som har samma roll som assignment-kategorin. Om assignment.category och member.role är samma så skapas en knapp som kan köra metoden "assignToMember"
  function AssignMemberButtons({ assignment }) {
    //om assignment inte är tilldelad till någon körs nedan
    if (!assignment.assignedTo || assignment.assignedTo === "") {

        //member.roles är array med eventuella roller som [Frontend, Backend, UX]. 
        // Här skapas ett objekt relevantMembers där man söker genom varje role i array, för varje role kollar den om role.toLowerCase() är lika med assignment.category.toLowerCase(). 
        // Om minst en role är samma som assignment.category så returnerar den true, annars false. 
      const relevantMembers = members.filter(member =>
        member.roles.some(role => role.toLowerCase() === assignment.category.toLowerCase())
      );

      //metod när man klickar på knappen, så uppdateras databasen med en ny tilldelad medlem
      const assignToMember = (memberId) => {
        onUpdateAssignment(assignment.id, {
          ...assignment,
          assignedTo: memberId,
          status: labelOngoing,
        });
      };

      //Skriver ut knapp för varje medlem som har samma role som assignment-category
      return (
        <div>
          <p>Tilldela till:</p>
          {relevantMembers.map((member) => (
            <button key={member.id} onClick={() => assignToMember(member.id)} style={{ margin: '5px' }}>
              {member.name}
            </button>
          ))}
        </div>
      );
    }
    return null;
  }

  //filtrering för assignments
  const filteredAndSortedAssignments = assignments
    .filter(assignment => {
      const matchesMember = !filterMember || assignment.assignedTo === filterMember;
      const matchesCategory = !filterCategory || assignment.category === filterCategory;
      return matchesMember && matchesCategory;
    })
    .sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      if (sortField === "createdAt") {
        valA = new Date(valA);
        valB = new Date(valB);
      }

      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    //sortering 
  function SortingBar({ filterMember, setFilterMember, filterCategory, setFilterCategory, sortField, setSortField, sortOrder, setSortOrder, members }) {
    return (
      <div style={{ marginBottom: '20px' }}>
        <label>Filtrera på medlem: </label>
        <select value={filterMember} onChange={(e) => setFilterMember(e.target.value)}>
          <option value="">Alla</option>
          {members.map(member => (
            <option key={member.id} value={member.id}>{member.name}</option>
          ))}
        </select>

        <label> Filtrera på kategori: </label>
        <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
          <option value="">Alla</option>
          <option value="UX">UX</option>
          <option value="frontend">Frontend</option>
          <option value="backend">Backend</option>
        </select>

        <label> Sortera: </label>
        <select value={sortField} onChange={(e) => setSortField(e.target.value)}>
          <option value="createdAt">Timestamp</option>
          <option value="title">Titel</option>
        </select>

        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
          <option value="asc">Stigande (A–Ö / Äldst → Nyast)</option>
          <option value="desc">Fallande (Ö–A / Nyast → Äldst)</option>
        </select>
      </div>
    );
  }

  //utskrivningen för assignments layout
  return (
    <div>
      <SortingBar
        filterMember={filterMember}
        setFilterMember={setFilterMember}
        filterCategory={filterCategory}
        setFilterCategory={setFilterCategory}
        sortField={sortField}
        setSortField={setSortField}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        members={members}
      />

      {[labelNew, labelOngoing, labelDone].map((status) => {
        const assignmentsForStatus = filteredAndSortedAssignments.filter(
          (assignment) => assignment.status === status
        );

        if (assignmentsForStatus.length === 0) return null;

        return (
          <div key={status}>
            <h2>{status}</h2>
            {assignmentsForStatus.map((assignment) => (
              <div
                key={assignment.id}
                style={{
                  border: '1px solid gray',
                  margin: '10px',
                  padding: '10px',
                  background: CheckStatusColor(assignment),
                }}
              >
                <h3>{assignment.title}</h3>
                <p>Kategori: {assignment.category}</p>
                <p>
                  Tilldelad: {members.find((m) => m.id === assignment.assignedTo)?.name || "Ingen"}
                </p>
                <p>Status: {assignment.status}</p>
                <p>Skapad: {new Date(assignment.createdAt).toLocaleString("sv-SE")}</p>
                <AssignMemberButtons assignment={assignment} />
                <RemoveAssignmentButton assignment={assignment} />
                <MakeAssignmentDone
                  assignment={assignment}
                  onUpdateAssignment={onUpdateAssignment}
                />
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

export default AssignmentList;