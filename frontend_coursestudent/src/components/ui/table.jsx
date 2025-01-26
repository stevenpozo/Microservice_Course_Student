import React from 'react';

const Table = ({ children }) => {
    return (
        <table className="min-w-full bg-white border border-gray-300">
            <thead className="bg-gray-200">
                <tr>{children[0]}</tr>
            </thead>
            <tbody>{children[1]}</tbody>
        </table>
    );
};

export { Table };
