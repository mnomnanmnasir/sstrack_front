import React from 'react';

const Switch = (props) => {

    const {checked, onChange, employee} = props

    return (
        <label class="switch">
            <input type="checkbox" checked={employee.isSelected ? true : false} onChange={(e) => onChange(e.target.checked, employee)} />
            <span class="slider round"></span>
        </label>
    );
}

export default Switch;