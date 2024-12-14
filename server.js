// Import required modules
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Initialize the app and middleware
const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
const mongoURI = "mongodb://localhost:27017/assignments"; 
mongoose
    .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("Could not connect to MongoDB", err));

// Define the Mongoose schema and model
const assignmentSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
});

const Assignment = mongoose.model("Assignment", assignmentSchema);

// Routes

// Get all assignments
app.get("/api/assignments", async (req, res) => {
    try {
        const assignments = await Assignment.find();
        res.json(assignments);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch assignments" });
    }
});

// Get a single assignment by ID
app.get("/api/assignments/:id", async (req, res) => {
    try {
        const assignment = await Assignment.findById(req.params.id);
        if (!assignment) return res.status(404).json({ error: "Assignment not found" });
        res.json(assignment);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch assignment" });
    }
});

// Create a new assignment
app.post("/api/assignments", async (req, res) => {
    try {
        const { title, description } = req.body;
        const newAssignment = new Assignment({ title, description });
        await newAssignment.save();
        res.status(201).json(newAssignment);
    } catch (err) {
        res.status(400).json({ error: "Failed to create assignment" });
    }
});

// Update an existing assignment
app.put("/api/assignments/:id", async (req, res) => {
    try {
        const { title, description } = req.body;
        const updatedAssignment = await Assignment.findByIdAndUpdate(
            req.params.id,
            { title, description },
            { new: true, runValidators: true }
        );

        if (!updatedAssignment) return res.status(404).json({ error: "Assignment not found" });

        res.json(updatedAssignment);
    } catch (err) {
        res.status(400).json({ error: "Failed to update assignment" });
    }
});

// Delete an assignment
app.delete("/api/assignments/:id", async (req, res) => {
    try {
        const deletedAssignment = await Assignment.findByIdAndDelete(req.params.id);
        if (!deletedAssignment) return res.status(404).json({ error: "Assignment not found" });

        res.json({ message: "Assignment deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete assignment" });
    }
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
