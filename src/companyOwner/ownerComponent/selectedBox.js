// selectedBox.jsx
import React, { useState } from 'react';
import Select from "react-select";

const SelectBox = ({ options, components, ...rest }) => {
    return (
            <Select
                options={options}
                components={components} // 👈 This is key
                {...rest}
            />
    );
};

export default SelectBox;
