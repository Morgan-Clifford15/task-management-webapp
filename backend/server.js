require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const cors = require('cors'); // Import cors
const connectDB = require('./db');
const User = require('./models/User'); // Import the User model
const Board = require('./models/Boards');
const { Card, Table } = require('./models/Table'); // Import both models
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing
const jwt = require('jsonwebtoken'); // Import jsonwebtoken

const app = express();
app.use(cors({
    origin: 'http://localhost:3000', // Allow your frontend URL
    credentials: true // Allow credentials (cookies) to be sent
})); // Enable CORS
app.use(express.json()); // for parsing application/json

// Connect to MongoDB
connectDB();

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Get token from Authorization header
    if (!token) return res.status(403).send('A token is required for authentication');

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).send('Invalid Token');
        req.user = decoded; // Save the decoded user info to the request
        next();
    });
};

// Registration route
app.post('/api/register', async (req, res) => {
    const { name, email, password, confirmPassword } = req.body;

    // Validate input
    if (!name || !email || !password || !confirmPassword) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
    }

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
        });

        // Save the user to the database
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Login route
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate a JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ message: 'Login successful', token }); // Send the token back to the client
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Fetch user data by ID
app.get('/api/user', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password'); // Exclude password
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/api/boards/create', async (req, res) => {
    const { title, description, userId } = req.body;

    if (!title || !description) {
        return res.status(400).json({ error: 'Bad input' });
    }

    const newBoard = new Board({
        title: title,
        description: description,
        users: [userId],
        tables: []
    });

    await newBoard.save();

    const user = await User.findById(userId);
    let userBoards = user.boards;
    userBoards.push(newBoard._id);

    await User.findByIdAndUpdate(userId, { boards: userBoards });
    return res.status(200).json({ message: "Success" });
});

app.post('/api/boards/get', async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ error: "Bad Input" });
    }
    const user = await User.findById(userId);
    if (!user) {
        return res.status(400).json({ error: "Failed to find user" });
    }
    const userBoards = user.boards;
    let boards = []

    for (const board of userBoards) {
        boardObj = await Board.findById(board)
        boards.push(boardObj)
    }

    return res.status(200).json(boards);

});

app.post('/api/board/add_list', async (req, res) => {
    try {
        const { boardId, title } = req.body;

        const board = await Board.findById(boardId);
        if (!board) {
            return res.status(404).json({ error: "Board not found" });
        }

        const newList = new Table({
            title: title,
            cards: []
        });

        await newList.save(); // Save the new table to the database
        board.tables.push(newList._id.toString()); // Store the table ID as a string
        await board.save(); // Save the updated board

        return res.status(200).json({ message: "Success" });
    } catch (e) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

app.post('/api/board/get_tables', async (req, res) => {
    try {
        const { boardId } = req.body;

        if (!boardId) {
            return res.status(400).json({ error: "Bad Input" });
        }

        const board = await Board.findById(boardId);
        if (!board) {
            return res.status(404).json({ error: "Board not found" });
        }

        // Fetch tables using the IDs stored in the board
        const tables = await Table.find({ _id: { $in: board.tables } }); // Find tables by their IDs
        return res.status(200).json(tables); // Return the tables
    } catch (e) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

app.post('/api/table/add_card', async (req, res) => {
    try {
        const { boardId, tableId, cardTitle } = req.body;

        if (!boardId || !tableId || !cardTitle) {
            return res.status(400).json({ error: "Bad Input" });
        }

        const board = await Board.findById(boardId);
        if (!board) {
            return res.status(404).json({ error: "Board not found" });
        }

        const table = await Table.findById(tableId); // Fetch the table object from the database
        if (!table) {
            return res.status(404).json({ error: "Table not found" });
        }

        const newCard = new Card({
            title: cardTitle,
            description: ""
        });

        await newCard.save();

        const tableCards = table.cards;
        tableCards.push(newCard._id);

        await Table.findByIdAndUpdate(tableId, { cards: tableCards });
        return res.status(200).json({ message: "Success" });

    } catch (e) {
        console.error(e);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

app.post('/api/table/get_cards', async (req, res) => {
    try {
        const { tableId } = req.body;

        if (!tableId) {
            return res.status(400).json({ error: "Bad Input" });
        }

        const table = await Table.findById(tableId);
        if (!table) {
            return res.status(404).json({ error: "Failed to find table" });
        }

        // Fetch the cards based on the IDs stored in the table
        const cards = await Card.find({ _id: { $in: table.cards } }); // Find cards by their IDs

        return res.status(200).json(cards); // Return the cards
    } catch (e) {
        console.error(e); // Log the error for debugging
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

