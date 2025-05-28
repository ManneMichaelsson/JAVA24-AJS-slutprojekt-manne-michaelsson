import React, { useState } from 'react';

function AssignmentList({ assignments, members, onUpdateAssignment, deleteAssignment }) {
  const [filterMember, setFilterMember] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [sortField, setSortField] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  const labelNew = "Ny";
  const labelOngoing = "Pågående";
  const labelDone = "Färdig";

  function CheckStatusColor(assignment) {
    if (assignment.status === labelNew) return "white";
    if (assignment.status === labelOngoing) return "yellow";
    if (assignment.status === labelDone) return "lightgreen";
    return "white";
  }

  function RemoveAssignmentButton({ assignment }) {
    if (assignment.status === labelDone) {
      return <button onClick={() => deleteAssignment(assignment.id)}>Radera</button>;
    }
    return null;
  }

  function MakeAssignmentDone({ assignment, onUpdateAssignment }) {
    if (assignment.status === labelOngoing) {
      const markAsDone = () => {
        onUpdateAssignment(assignment.id, { ...assignment, status: labelDone });
      };
      return <button onClick={markAsDone}>Färdig</button>;
    }
    return null;
  }

  function AssignMemberButtons({ assignment }) {
    if (!assignment.assignedTo || assignment.assignedTo === "") {
      const relevantMembers = members.filter(member =>
        member.roles.some(role => role.toLowerCase() === assignment.category.toLowerCase())
      );

      const assignToMember = (memberId) => {
        onUpdateAssignment(assignment.id, {
          ...assignment,
          assignedTo: memberId,
          status: labelOngoing,
        });
      };

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