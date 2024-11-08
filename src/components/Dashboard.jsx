import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [boards, setBoards] = useState([]); // Initialize as an empty array
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('token'); // Get the token from local storage
            if (token) {
                try {
                    const response = await fetch('http://localhost:5000/api/user', {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`, // Send the token in the Authorization header
                        },
                    });
                    const data = await response.json();
                    if (response.ok) {
                        setUser(data);
                        // Fetch boards for the user
                        const response2 = await axios.post('http://localhost:5000/api/boards/get', { userId: data._id }); // Use data._id
                        setBoards(response2.data); // Set boards directly from response
                    } else {
                        setError(data.message);
                    }
                } catch (err) {
                    setError('Failed to fetch user data');
                }
            } else {
                setError('User not logged in');
            }
        };

        fetchUserData();
    }, []);

    return (
        <div>
            {error && <p>{error}</p>}
            {user ? <h1>Welcome back, {user.name}</h1> : <p>Loading...</p>}
            <button onClick={() => navigate('/create-board', { state: { userId: user?._id } })} className='bg-blue-500 hover:bg-blue-600 rounded'>
                Create Board
            </button>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                {boards.length > 0 ? (
                    boards.map((board) => (
                        <div key={board._id} className="board-card">
                            <Link to={`/board/${board.title}`} state={{ board }} className='block'>
                                <div className='bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden'>
                                    <div className='p-6'>
                                        <div className='flex justify-between items-center mb-4'>
                                            <h3 className='text-xl font-semibold text-grey-800'>{board.title}</h3>

                                        </div>
                                        <p className='text-gray-600 mb-4'>{board.description}</p>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))
                ) : (
                    <p>No boards available.</p>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
