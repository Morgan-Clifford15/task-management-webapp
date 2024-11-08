import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import BoardTable from './BoardTable';
import AddList from './AddList'; // Import AddList component
import axios from 'axios';

const BoardPage = () => {
    const location = useLocation();
    const board = location.state?.board; // Access the board object from state
    const [tables, setTables] = useState([]); // Initialize with an empty array
    const [loading, setLoading] = useState(true); // State to manage loading status
    const [error, setError] = useState(null); // State to manage error messages
    const [showAddList, setShowAddList] = useState(false); // State to manage AddList visibility
    const [newTableTitle, setNewTableTitle] = useState(''); // State to manage new table title

    // Define the fetchTables function
    const fetchTables = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/board/get_tables', { boardId: board._id });
            setTables(response.data); // Update state with fetched tables
        } catch (err) {
            setError('Failed to load tables.'); // Set error message
        } finally {
            setLoading(false); // Set loading to false after fetching
        }
    };

    useEffect(() => {
        fetchTables(); // Call the function to fetch tables
    }, [board._id]); // Dependency array to run effect when board ID changes

    if (loading) {
        return <p>Loading...</p>; // Show loading message while fetching
    }

    if (error) {
        return <p>{error}</p>; // Show error message if there was an error
    }

    const addTable = async (title) => { // Correctly place async before the function
        try {
            const response = await axios.post('http://localhost:5000/api/board/add_list', { boardId: board._id, title: title });
            fetchTables();
            setShowAddList(false); // Hide AddList after adding
            setNewTableTitle(''); // Reset title
        } catch (err) {
            console.error('Error adding table:', err);
            setError('Failed to add table.'); // Set error message
        }
    };

    const handleAddTableClick = () => {
        setShowAddList(true); // Show AddList component
    };

    return (
        <div className='overflow-x-auto'> {/* Enable horizontal scrolling for the board tables */}
            <h1 className='text-2xl font-bold mb-4'>{board.title}</h1> {/* Display the board title */}
            <div className='flex space-x-4'> {/* Flex container for horizontal layout */}
                {tables.length > 0 ? (
                    tables.map((table, index) => (
                        <BoardTable key={index} board={board} table={table} blank={false} onAddTable={() => { }} /> // Pass the board object to BoardTable
                    ))
                ) : (
                    <p>No tables available. Please add a new table.</p> // Placeholder when no tables exist
                )}
                <button onClick={handleAddTableClick} className='mt-4 bg-blue-500 text-white px-4 py-2 rounded'>Add Table</button> {/* Add Table button */}
                {showAddList && (
                    <AddList
                        title={newTableTitle}
                        setTitle={setNewTableTitle}
                        onSubmit={() => addTable(newTableTitle)}
                        onCancel={() => setShowAddList(false)}
                    />
                )} {/* Conditionally render AddList component */}
            </div>

        </div>
    );
};

export default BoardPage;
