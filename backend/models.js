const mongoose = require('mongoose');

// Define the Card schema
const CardSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
});

// Define the Table schema
const TableSchema = new mongoose.Schema({
    title: { type: String, required: true },
    cards: { type: [CardSchema], default: [] }, // Array of cards
});

// Define the Board schema
const BoardSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    users: { type: [String], required: true },
    tables: { type: [TableSchema], required: true } // Array of tables
});

// Create models
const Card = mongoose.model('Card', CardSchema);
const Table = mongoose.model('Table', TableSchema);
const Board = mongoose.model('Board', BoardSchema);

// Export all models
module.exports = {
    Card,
    Table,
    Board,
}; 