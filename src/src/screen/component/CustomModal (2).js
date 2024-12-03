import React from 'react';

const CustomModal = ({ show, onClose, title, children }) => {
    if (!show) return null;
    const handleBackgroundClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };
    return (
        <div style={styles.overlay} onClick={handleBackgroundClick}>
            <div style={styles.modal}>
                <div style={styles.header}>
                    <h2>{title}</h2>
                    <button style={styles.closeButton} onClick={onClose}>
                        &times;
                    </button>
                </div>
                <div style={styles.body}>{children}</div>
            </div>
        </div>
    );
};

const styles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
    },
    modal: {
        backgroundColor: 'white',
        maxWidth: '90%',
        maxHeight: '90%',
        borderRadius: '8px',
        overflowY: 'auto',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 1001
    },
    header: {
        padding: '1rem',
        borderBottom: '1px solid #ccc',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        // backgroundColor: 'red'
    },
    closeButton: {
        fontSize: '2.5rem',
        border: 'none',
        background: 'none',
        cursor: 'pointer'
    },
    body: {
        padding: '1rem',
        backgroundColor: 'white',
        flex: '1'
    }
};

export default CustomModal;
