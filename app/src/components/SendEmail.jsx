import React, { Component } from 'react'

import Snackbar from '@material-ui/core/Snackbar'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'

import app from 'FRS/feathers-client.js'
import responsive from 'FRS/components/responsive.jsx'

@responsive
export default class SendSMS extends Component {
    constructor(props){
        super(props)
        this.state = {
            email: '',
            email_body: '',
            emailButtonOff: false,
            snackBarOpen: false,
            snackBarMessage: null,
        }
    }

    handleCloseSnackBar = () => this.setState({ snackBarOpen: false })

    handleEmailChange = (field, value) => this.setState({ [field]: value })

    handleEmail = event => {
        event.preventDefault()
        const { email, email_body } = this.state
        this.setState({emailButtonOff: true})

        if(email && email_body){
            this.setState({ email: '', email_body: ''})

            app.service('notifications').create({ type:'email', address: email, body:email_body })
                .then(() => { this.setState({ emailButtonOff: false })})
                .catch((err) => {
                    console.log(err)
                    this.setState({ emailButtonOff: false })
                })
        } else {
            this.setState({
                snackBarOpen: true,
                snackBarMessage: 'Please enter a valid email and/or message.',
                emailButtonOff: false,
            })
        }
    }

    render(){
        const { email, email_body, emailButtonOff, snackBarOpen, snackBarMessage } = this.state

        return(
            <div>
                <Snackbar
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                    open={snackBarOpen}
                    autoHideDuration={6000}
                    onClose={this.handleCloseSnackBar}
                    message={snackBarMessage}
                />
                <div style={{marginTop: 40}}>
                    Send an email!
                    <TextField
                        fullWidth
                        required
                        id="email"
                        label="Email Address"
                        margin="normal"
                        onChange={(event) => this.handleEmailChange('email', event.target.value)}
                        type="email"
                        variant="outlined"
                        value={email}
                    />
                    <TextField
                        fullWidth
                        required
                        id="body"
                        label="Email Body"
                        margin="normal"
                        onChange={(event) => this.handleEmailChange('email_body', event.target.value)}
                        type="email_body"
                        variant="outlined"
                        value={email_body}
                    />
                    <div style={{ textAlign: 'center', marginBottom: 20, marginTop: 16 }}>
                        <Button
                            disabled={ !!emailButtonOff }
                            variant="contained"
                            color="secondary"
                            onClick={this.handleEmail}
                            style={{ width: '100%' }}>
                            Send Email
                        </Button>
                    </div>
                </div>
            </div>
        )
    }
}
