const mongoose = require('mongoose');

const CardSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
});

// Check if the Card model is already defined
const Card = mongoose.models.Card || mongoose.model('Card', CardSchema);

const TableSchema = new mongoose.Schema({
    title: { type: String, required: true },
    cards: { type: [String], default: [] }, // Use CardSchema for cards
});

// Check if the Table model is already defined
const Table = mongoose.models.Table || mongoose.model('Table', TableSchema);

// Export both models
module.exports = { Card, Table };