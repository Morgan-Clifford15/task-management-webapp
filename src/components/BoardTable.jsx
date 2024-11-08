import React, { useState, useEffect } from 'react';
import axios from 'axios';

function BoardTable({ board, table, blank, onAddTable }) {
    const [newCardTitle, setNewCardTitle] = useState(''); // State for new card input
    const [cards, setCards] = useState([]); // Initialize with an empty array
    const [tableTitle, setTableTitle] = useState(table.title || ''); // State for table title
    const [tableId, setTableId] = useState(table._id || '');
    const [loading, setLoading] = useState(true); // State to manage loading status
    const [error, setError] = useState(null); // State to manage error messages

    const fetchCards = async () => {
        setLoading(true); // Set loading to true before fetching
        try {
            const response = await axios.post('http://localhost:5000/api/table/get_cards', {
                tableId: tableId
            });
            setCards(response.data); // Update state with fetched cards
            setLoading(false);
        } catch (error) {
            console.error('Error fetching cards:', error); // Log the error
            setError('Failed to load cards.'); // Set error message
        } finally {
            setLoading(false); // Set loading to false after fetching
        }
    };

    useEffect(() => {
        fetchCards(); // Call the function to fetch cards
    }, [tableId]); // Dependency array to run effect when table ID changes

    if (loading) {
        return <p>Loading...</p>; // Show loading message while fetching
    }

    if (error) {
        return <p>{error}</p>; // Show error message if there was an error
    }

    const handleAddCard = async () => {
        if (newCardTitle.trim() === '') {
            alert('Card title cannot be empty'); // Simple alert for empty input
            return;
        }


        const response = await axios.post('http://localhost:5000/api/table/add_card', {
            boardId: board._id,
            tableId: tableId,
            cardTitle: newCardTitle
        });
        // Create a new card object
        setNewCardTitle(''); // Clear the input field
        fetchCards(); // Fetch cards again to update the list
    };

    return (
        <div className='board-table w-64 flex-shrink-0 mx-2'> {/* Set a fixed width and prevent shrinking */}
            <h2 className='text-xl font-semibold mb-4'>{table.title}</h2>
            <div className='flex flex-col gap-2'> {/* Use flexbox for vertical stacking */}
                {cards.length > 0 ? (
                    cards.map((card, index) => (
                        <div key={index} className='bg-gray-200 p-2 rounded'> {/* Card styling */}
                            <h4 className='font-bold'>{card.title}</h4>
                            <p>{card.description}</p>
                        </div>
                    ))
                ) : (
                    <p>No cards available.</p> // Placeholder when no cards exist
                )}
            </div>
            {!blank && ( // Only show the input and button if it's not a blank table
                <div className='mt-4'>
                    <input
                        type='text'
                        placeholder='New card title'
                        value={newCardTitle}
                        onChange={(e) => setNewCardTitle(e.target.value)}
                        className='w-full px-3 py-2 border rounded'
                    />
                    <button onClick={handleAddCard} className='bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mt-2'>
                        Add Card
                    </button>
                </div>
            )}
        </div>
    );
}

export default BoardTable;
