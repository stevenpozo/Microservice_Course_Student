import React from 'react';

const Select = ({ children, onChange, placeholder }) => {
    return (
        <select onChange={onChange} className="px-4 py-2 border rounded" placeholder={placeholder}>
            <option value="">{placeholder}</option>
            {children}
        </select>
    );
};

const SelectItem = ({ value, children }) => {
    return <option value={value}>{children}</option>;
};

export { Select, SelectItem };
