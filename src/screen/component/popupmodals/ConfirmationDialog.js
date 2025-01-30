import React, { useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";

const ConfirmationDialog = ({ open, onClose, onConfirm, text }) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle style={{color:'#8CCA6B'}}>Confirm Deletion</DialogTitle>
            <DialogContent>
               {text}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} style={{backgroundColor:'grey', color:'white'}}>
                    Cancel
                </Button>
                <Button onClick={onConfirm} style={{backgroundColor:'#8CCA6B', color:'white'}}>
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmationDialog;
