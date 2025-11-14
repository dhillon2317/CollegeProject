const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 5000;
const DATA_FILE = path.join(__dirname, 'data', 'complaints.json');

// Middleware
app.use(cors());
app.use(express.json());

// Helper function to read complaints
async function readComplaints() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading complaints:', error);
    return [];
  }
}

// Helper function to write complaints
async function writeComplaints(complaints) {
  try {
    await fs.writeFile(DATA_FILE, JSON.stringify(complaints, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing complaints:', error);
    return false;
  }
}

// Get all complaints
app.get('/api/complaints', async (req, res) => {
  try {
    const complaints = await readComplaints();
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch complaints' });
  }
});

// Add a new complaint
app.post('/api/complaints', async (req, res) => {
  try {
    const complaints = await readComplaints();
    const newComplaint = {
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      ...req.body,
      status: 'Pending',
      createdAt: new Date().toISOString(),
      aiAnalyzed: false
    };
    
    complaints.push(newComplaint);
    await writeComplaints(complaints);
    
    res.status(201).json(newComplaint);
  } catch (error) {
    console.error('Error adding complaint:', error);
    res.status(500).json({ error: 'Failed to add complaint' });
  }
});

// Update a complaint
app.put('/api/complaints/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    
    let complaints = await readComplaints();
    const index = complaints.findIndex(c => c.id === id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Complaint not found' });
    }
    
    complaints[index] = { ...complaints[index], ...updatedData };
    await writeComplaints(complaints);
    
    res.json(complaints[index]);
  } catch (error) {
    console.error('Error updating complaint:', error);
    res.status(500).json({ error: 'Failed to update complaint' });
  }
});

// Delete a complaint
app.delete('/api/complaints/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let complaints = await readComplaints();
    const filtered = complaints.filter(c => c.id !== id);
    
    if (filtered.length === complaints.length) {
      return res.status(404).json({ error: 'Complaint not found' });
    }
    
    await writeComplaints(filtered);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting complaint:', error);
    res.status(500).json({ error: 'Failed to delete complaint' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
