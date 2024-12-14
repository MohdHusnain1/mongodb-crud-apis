const apiUrl = "http://localhost:5000/api/assignments";

// Fetch all assignments
async function fetchAssignments() {
    const response = await fetch(apiUrl);
    const data = await response.json();
    const assignmentList = document.getElementById("assignmentList");
    assignmentList.innerHTML = ""; // Clear the table before appending

    data.forEach((assignment, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${index + 1}</td> 
          <td>${assignment.title}</td>
          <td>${assignment.description}</td>
          <td class="actions">
            <button onclick="editAssignment('${assignment._id}', '${assignment.title}', '${assignment.description}')">Edit</button>
            <button onclick="deleteAssignment('${assignment._id}')">Delete</button>
          </td>
        `;
        assignmentList.appendChild(row);
    });
}

// Create or update assignment
document.getElementById("assignmentForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = document.getElementById("assignmentId").value;
    const title = document.getElementById("assignmentTitle").value;
    const description = document.getElementById("assignmentDescription").value;

    if (id) {
        // Update
        await fetch(`${apiUrl}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, description }),
        });
        document.getElementById("submitButton").textContent = "Add Assignment";
    } else {
        // Create
        await fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, description }),
        });
    }

    document.getElementById("assignmentForm").reset();
    document.getElementById("assignmentId").value = "";
    fetchAssignments();
});

// Edit assignment
function editAssignment(id, title, description) {
    document.getElementById("assignmentId").value = id;
    document.getElementById("assignmentTitle").value = title;
    document.getElementById("assignmentDescription").value = description;
    document.getElementById("submitButton").textContent = "Update Assignment";
}

// Delete assignment
async function deleteAssignment(id) {
    await fetch(`${apiUrl}/${id}`, {
        method: "DELETE",
    });
    fetchAssignments();
}

// Initialize
fetchAssignments();