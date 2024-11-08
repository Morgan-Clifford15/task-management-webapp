import React, { useState } from 'react';
import axios from 'axios';

const CreateBoard = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [cards, setCards] = useState([]);
    const [newCardTitle, setNewCardTitle] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        const response = await axios.post('http://localhost:5000/api/boards/create', { title, description });
    };

    const handleAddCard = () => {
        if (newCardTitle.trim() === '') {
            setError('Card title cannot be empty');
            return;
        }

        setCards([...cards, { title: newCardTitle, description: '' }]);
        setNewCardTitle('');
    };

    return (
        <div className='max-w-md-auto mt-10'>
            <h2 className='text-2xl font-bold mb-4'>Create a new Board</h2>
            {error && <p className='text-red-500 mb-4'>{error}</p>}
            <form onSubmit={handleSubmit} className='space-y-4'>
                <div>
                    <label htmlFor='title' className='block mb-1'>Title</label>
                    <input
                        type='text'
                        id='title'
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className='w-full px-3 py-2 border rounded'
                    />
                </div>
                <div>
                    <label htmlFor='description' className='block mb-1'>Description</label>
                    <input
                        type='text'
                        id='description'
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        className='w-full px-3 py-2 border rounded'
                    />
                </div>
                <button type='submit' className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'>
                    Create Board
                </button>
            </form>

            <div className='mt-6'>
                <h3 className='text-xl font-semibold mb-2'>Cards</h3>
                {cards.length > 0 ? (
                    <div className='grid grid-cols-1 gap-4'>
                        {cards.map((card, index) => (
                            <div key={index} className='bg-gray-200 p-4 rounded'>
                                <h4 className='font-bold'>{card.title}</h4>
                                <p>{card.description}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No cards available. Add a card below:</p>
                )}
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
            </div>
        </div>
    );
};

export default CreateBoard;
