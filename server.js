const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const db = require('./database');

const app = express();
app.use(cors());
app.use(express.json());

// Signup endpoint
app.post('/api/signup', async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const hash = await bcrypt.hash(password, 10);
        db.run(`INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)`, 
        [name, email, hash], 
        function(err) {
            if (err) {
                if (err.message.includes('UNIQUE constraint failed')) {
                    return res.status(400).json({ error: 'Email already exists' });
                }
                return res.status(500).json({ error: 'Database error' });
            }
            res.status(201).json({ 
                message: 'User created successfully',
                user: { id: this.lastID, name, email } 
            });
        });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Login endpoint
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, row) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        if (!row) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        const match = await bcrypt.compare(password, row.password_hash);
        if (!match) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        res.json({
            message: 'Login successful',
            user: { id: row.id, name: row.name, email: row.email }
        });
    });
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Backend API Server running on port ${PORT}`);
});
