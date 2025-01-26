import React from 'react';

const Modal = ({ onClose, children }) => {
    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg w-1/3 shadow-lg border-2 border-gray-300">
                <div>{children}</div>
                <div className="mt-4 text-right">
                    <button
                        onClick={onClose}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-all"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export { Modal };
