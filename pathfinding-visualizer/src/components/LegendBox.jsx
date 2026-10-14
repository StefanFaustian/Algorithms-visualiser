import React, { useState } from "react";
import './LegendBox.css';

const LegendBox = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleBox = () => {
        setIsOpen(!isOpen);
    }

    return (
        <div className="box-wrapper">
            {!isOpen && (
                <button className="box-toggler top-right" onClick={toggleBox}>?</button>
            )}

            {isOpen && (
                <div className="box-container">
                    <button className="box-toggler top-right" onClick={toggleBox}>?</button>

                    <div className="box-row">
                        <div className="node node-wall"></div>
                        <span>- Left-Click</span>
                    </div>

                    <div className="box-row">
                        <div className="node"></div>
                        <span>- Shift + Left-Click</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LegendBox;