import React from 'react';

const AddList = ({ title, setTitle, onSubmit, onCancel }) => {
    const handleSubmit = (event) => {
        event.preventDefault(); // Prevent the default form submission
        onSubmit(); // Call the onSubmit function passed as a prop
    };

    return (
        <div className='add-list'>
            <form onSubmit={handleSubmit}> {/* Bind handleSubmit to the form submission */}
                <input
                    type='text'
                    value={title}
                    onChange={(e) => setTitle(e.target.value)} // Update title state on input change
                    placeholder='Enter table title'
                    required
                />
                <button type='submit' className='bg-green-500 text-white px-4 py-2 rounded'>Add</button> {/* Submit button */}
                <button type='button' onClick={onCancel} className='bg-red-500 text-white px-4 py-2 rounded'>Cancel</button> {/* Cancel button */}
            </form>
        </div>
    );
};

export default AddList;
