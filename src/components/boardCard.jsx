import React from 'react';
import { Link } from 'react-router-dom';

function BoardCard({ board }) {
    return (
        <Link to={`/board/${board._id}`} state={{ board }} className='block'>
            <div className='bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden'>
                <div className='p-6'>
                    <div className='flex justify-between items-center mb-4'>
                        <h3 className='text-xl font-semibold text-grey-800'>{board.title}</h3>
                    </div>
                    <p className='text-gray-600 mb-4'>{board.description}</p>
                </div>
            </div>
        </Link>
    );
}

export default BoardCard;
