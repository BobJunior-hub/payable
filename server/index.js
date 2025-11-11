import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Data storage file
const DATA_FILE = join(__dirname, 'data.json');

// Initialize data file if it doesn't exist
const initializeData = () => {
  if (!fs.existsSync(DATA_FILE)) {
    const initialData = {
      users: [
        { id: '1', name: 'John Viewer', email: 'viewer@company.com', role: 'viewer', status: 'active' },
        { id: '2', name: 'Sarah Creator', email: 'creator@company.com', role: 'creator', status: 'active' },
        { id: '3', name: 'Mike Payer', email: 'payer@company.com', role: 'payer', status: 'active' },
        { id: 'admin-1', name: 'Admin User', email: 'admin@company.com', role: 'admin', status: 'active' },
      ],
      expenses: [],
      userRequests: [],
      categories: ['Office Supplies', 'Travel', 'Meals', 'Software', 'Utilities', 'Marketing'],
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2));
  }
};

// Read data from file
const readData = () => {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading data:', error);
    return { users: [], expenses: [], userRequests: [], categories: [] };
  }
};

// Write data to file
const writeData = (data) => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing data:', error);
  }
};

// Initialize data on startup
initializeData();

// ========== USERS ENDPOINTS ==========
app.get('/api/users', (req, res) => {
  const data = readData();
  res.json(data.users);
});

app.get('/api/users/:email', (req, res) => {
  const data = readData();
  const user = data.users.find(u => u.email === req.params.email);
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

// ========== EXPENSES ENDPOINTS ==========
app.get('/api/expenses', (req, res) => {
  const data = readData();
  // Ensure all expenses have createdAt
  const expenses = data.expenses.map(exp => {
    if (!exp.createdAt) {
      const timestamp = exp.id.replace('exp-', '');
      exp.createdAt = timestamp ? new Date(parseInt(timestamp)).toISOString() : new Date().toISOString();
    }
    return exp;
  });
  res.json(expenses);
});

app.post('/api/expenses', (req, res) => {
  const data = readData();
  const expense = {
    ...req.body,
    id: `exp-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  data.expenses.unshift(expense);
  writeData(data);
  res.json(expense);
});

app.patch('/api/expenses/:id/status', (req, res) => {
  const data = readData();
  const expense = data.expenses.find(e => e.id === req.params.id);
  if (!expense) {
    return res.status(404).json({ error: 'Expense not found' });
  }
  
  const { status, userId } = req.body;
  expense.status = status;
  
  if (status === 'paid') {
    expense.paidBy = userId;
    expense.paidAt = new Date().toISOString().split('T')[0];
  } else {
    expense.paidBy = undefined;
    expense.paidAt = undefined;
  }
  
  writeData(data);
  res.json(expense);
});

// ========== USER REQUESTS ENDPOINTS ==========
app.get('/api/user-requests', (req, res) => {
  const data = readData();
  res.json(data.userRequests);
});

app.post('/api/user-requests', (req, res) => {
  const data = readData();
  const request = {
    id: `req-${Date.now()}`,
    name: req.body.name,
    email: req.body.email,
    requestedAt: new Date().toISOString(),
    status: 'pending',
  };
  data.userRequests.unshift(request);
  writeData(data);
  res.json(request);
});

app.patch('/api/user-requests/:id/approve', (req, res) => {
  const data = readData();
  const request = data.userRequests.find(r => r.id === req.params.id);
  if (!request || request.status !== 'pending') {
    return res.status(404).json({ error: 'Request not found or already processed' });
  }
  
  request.status = 'approved';
  request.role = req.body.role;
  request.approvedBy = req.body.approvedBy;
  request.approvedAt = new Date().toISOString();
  
  const newUser = {
    id: `user-${Date.now()}`,
    name: request.name,
    email: request.email,
    role: request.role,
    status: 'active',
  };
  data.users.push(newUser);
  
  writeData(data);
  res.json(newUser);
});

app.patch('/api/user-requests/:id/reject', (req, res) => {
  const data = readData();
  const request = data.userRequests.find(r => r.id === req.params.id);
  if (!request || request.status !== 'pending') {
    return res.status(404).json({ error: 'Request not found or already processed' });
  }
  
  request.status = 'rejected';
  writeData(data);
  res.json(request);
});

// ========== CATEGORIES ENDPOINTS ==========
app.get('/api/categories', (req, res) => {
  const data = readData();
  res.json(data.categories);
});

app.post('/api/categories', (req, res) => {
  const data = readData();
  const categoryName = req.body.name.trim();
  if (!categoryName || data.categories.includes(categoryName)) {
    return res.status(400).json({ error: 'Category already exists or is invalid' });
  }
  data.categories.push(categoryName);
  writeData(data);
  res.json({ success: true, categories: data.categories });
});

app.delete('/api/categories/:name', (req, res) => {
  const data = readData();
  const categoryName = decodeURIComponent(req.params.name);
  const isUsed = data.expenses.some(expense => expense.category === categoryName);
  if (isUsed) {
    return res.status(400).json({ error: 'Category is in use and cannot be deleted' });
  }
  data.categories = data.categories.filter(cat => cat !== categoryName);
  writeData(data);
  res.json({ success: true, categories: data.categories });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Mock API server running on http://0.0.0.0:${PORT}`);
});

