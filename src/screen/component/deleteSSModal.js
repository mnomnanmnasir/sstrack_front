import React from 'react';
import cross from "../../images/cross.webp";

const DeleteSSModal = (props) => {

    const { showDeleteModal, setShowDeleteModal, handleDeleteSS } = props

    return (
        <div className="editBox">
            <div className="editBoxUpperDiv">
                <h1>Delete Screenshot</h1>
                <button onClick={() => setShowDeleteModal(false)}><img src={cross} /></button>
            </div>
            <div className="editBoxLowerDiv">
                <p>Are you sure want to delete this screenshot?
                    This will also cut time from your timeline.
                </p>
                <div className="editSaveChanges">
                    <button className="btn saveChangesButton" onClick={handleDeleteSS}>OK</button>
                    <button className="btn cancelChangesButton" onClick={() => setShowDeleteModal(false)}>Cancel</button>
                </div>
            </div>
        </div>
    );
}

export default DeleteSSModal;
