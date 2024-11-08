const mongoose = require('mongoose');

const BoardSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    users: { type: [String], required: true },
    tables: { type: [String], required: true }
});

const Board = mongoose.model('Board', BoardSchema);

module.exports = Board;