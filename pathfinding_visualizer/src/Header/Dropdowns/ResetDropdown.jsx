/*
 * Node Type dropdown in Header
 */

import React, { useState } from 'react';
import './ResetDropdown.css'


/**
 * Reset dropdown component in Header.
 * Allows user to select reset type and initiate a reset.
 */
const ResetDropdown = ({ resetTypes, handleResetClick }) => {
    const [selectedResetType, setSelectedResetType] = useState(resetTypes[0]);
    const [isOpen, setIsOpen] = useState(false);  // Boolean for if dropdown is open.
    const toggleDropdown = () => setIsOpen(!isOpen);  // toggle dropdown

    const handleOptionClick = (resetType) => {
        setIsOpen(false);  // close dropdown after selection
        setSelectedResetType(resetType);
        handleResetClick(resetType);
    };

    // Returns React component for reset type dropdown
    return (
        <div className="reset-dropdown-container">
            <p>Grid Actions:</p>
            <div className="reset-dropdown">
                <div className="reset-dropdown-header">
                    <div className="selected-reset-container" onClick={() => handleResetClick(selectedResetType)}>
                        {selectedResetType}
                    </div>
                    <div className="reset-dropdown-arrow-container" onClick={toggleDropdown}>
                        <span className="reset-dropdown-arrow">{isOpen ? "▲" : "▼"}</span>
                    </div>
                </div>
                {isOpen && (
					<ul className="reset-dropdown-list">
                        {resetTypes
                            .filter(resetType => resetType !== selectedResetType)
                            .map((resetType, index) => (
							<li
								key={index}
								className="reset-dropdown-list-item"
								onClick={() => handleOptionClick(resetType)}>
								{resetType}
							</li>
						))}
					</ul>
				)}
            </div>
        </div>
    );
}

export default ResetDropdown;