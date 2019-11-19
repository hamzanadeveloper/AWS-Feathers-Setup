import React, { Component } from 'react'

import { Button, Snackbar, TextField } from "@material-ui/core";

import app from 'FRS/feathers-client.js'
import responsive from 'FRS/components/responsive.jsx'

@responsive
export default class SendSMS extends Component {
    constructor(props){
        super(props)
        this.state = {
            phone: '',
            body: '',
            smsButtonOff: false,
            snackBarOpen: false,
            snackBarMessage: null,
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({phone: nextProps.messagesAddress})
    }

    handleCloseSnackBar = () => this.setState({ snackBarOpen: false })

    handleSMSChange = (field, value) => this.setState({ [field]: value })

    handleSMS = event => {
        event.preventDefault()
        const { body, phone } = this.state
        this.setState({smsButtonOff: true})

        if(body && phone){
            this.setState({ phone: '', body: ''})

            app.service('notifications').create({ type:'sms', address: phone, body })
                .then(() => { this.setState({ smsButtonOff: false })})
                .catch((err) => {
                    console.log(err)
                    this.setState({ smsButtonOff: false })
                })
        } else {
            this.setState({
                snackBarOpen: true,
                snackBarMessage: 'Please enter a valid phone number and/or message.',
                smsButtonOff: false,
            })
        }
    }

    render(){
        const { phone, body, smsButtonOff, snackBarOpen, snackBarMessage } = this.state

        return(
            <div>
                <Snackbar
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                    open={snackBarOpen}
                    autoHideDuration={6000}
                    onClose={this.handleCloseSnackBar}
                    message={snackBarMessage}
                />
                Send a text message!
                <TextField
                    fullWidth
                    required
                    id="phone"
                    label="Phone Number"
                    margin="normal"
                    onChange={(event) => this.handleSMSChange('phone', event.target.value)}
                    type="phone"
                    variant="outlined"
                    value={phone}
                />
                <TextField
                    fullWidth
                    required
                    id="body"
                    label="Message"
                    margin="normal"
                    onChange={(event) => this.handleSMSChange('body', event.target.value)}
                    type="body"
                    variant="outlined"
                    value={body}
                />
                <div style={{ textAlign: 'center', marginBottom: 20, marginTop: 16 }}>
                    <Button
                        disabled={ !!smsButtonOff }
                        variant="contained"
                        color="secondary"
                        onClick={this.handleSMS}
                        style={{ width: '100%' }}>
                        Send SMS
                    </Button>
                </div>
            </div>
        )
    }
}
