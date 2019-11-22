import React, { useState, useEffect } from 'react'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'

import app from 'FRS/feathers-client.js'

const AddUserDialog = props => {
    const [dialogOpen, setDialogState] = useState(props.dialogOpen)
    const [newName, setUserName] = useState('')
    const [newPhone, setUserPhone] = useState('')

    useEffect(() => {
        setDialogState(props.dialogOpen)
    }, [props.dialogOpen])

    const handleDialogClose = () => {
        setDialogState(false)
        props.handleDialogClose()
        setUserName("")
        setUserPhone("")
    }

    const addNewRecipient = (event) => {
        event.preventDefault()

        app.service('recipients').create({ name: newName, phone: newPhone })
            .then(() => {
                setUserName("")
                setUserPhone("")
                handleDialogClose()
            })
            .catch((err) => console.log(err))
    }

    return (
        <Dialog open={dialogOpen} onClose={handleDialogClose} aria-labelledby="form-dialog-title" >
            <DialogTitle id="form-dialog-title">Create Recipient</DialogTitle>
            <DialogContent style={{minWidth: '500px' }}>
                <DialogContentText>
                    Create recipients that you interact with frequently!
                </DialogContentText>
                <TextField
                    margin="normal"
                    id="name"
                    onChange={(event) => setUserName(event.target.value)}
                    label="Name"
                    variant="outlined"
                    value={newName}
                    fullWidth
                />
                <TextField
                    margin="normal"
                    id="phone"
                    onChange={(event) => setUserPhone(event.target.value)}
                    label="Phone Number"
                    variant="outlined"
                    value={newPhone}
                    fullWidth
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleDialogClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={addNewRecipient} color="primary">
                    Create
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default AddUserDialog
