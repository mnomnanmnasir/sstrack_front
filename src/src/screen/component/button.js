import React from 'react';

const SaveChanges = (props) => {

    const { onClick } = props

    return (
        <button
            onClick={onClick}
            style={{
                color: "#fff",
                backgroundColor: "#7FC45B",
                borderColor: "#357ebd",
                border: "1px solid transparent",
                padding: "8px 16px",
                fontSize: "14px",
                fontWeight: "600",
                lineHeight: "1.42857143",
                borderRadius: "4px",
            }}>
            Save Changes
        </button>
    );
}

export default SaveChanges;