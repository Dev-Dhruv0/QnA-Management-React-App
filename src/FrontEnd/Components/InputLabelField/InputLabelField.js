import React, { useState } from 'react';
import './InputLabelField.css';

const InputLabelField = ({ 
    label, 
    type = "text" ,
    name,
    value,
    onChange,
    isEditing
}) => {
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = () => setIsFocused(true);
    const handleBlur = (e) => {
        if (!e.target.value) setIsFocused(false);
    };

    return (
        <div className={`input-container ${isFocused || value ? 'focused' : ''}`}>
            <label htmlFor="{name}" className="input-label">
            {label}
            </label>
            <input
            id={name}
            type={type}
            name={name}
            value={value}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={onChange} 
            disabled={!isEditing} //{isEditing === false ? true : false}
            className="input-field"/>

        </div>
    );
};

export default InputLabelField;