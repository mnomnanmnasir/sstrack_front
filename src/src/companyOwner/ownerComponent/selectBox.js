import React, { useState } from 'react';
import Select from 'react-select';

const SelectBox = (props) => {
    return (
        <div>
            <Select {...props} />
        </div>
    );
}

export default SelectBox;