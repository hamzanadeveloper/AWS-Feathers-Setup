import React, { Component } from 'react'
import { Redirect } from "react-router-dom";

import { Button, Snackbar, Paper, CircularProgress } from "@material-ui/core";

import app from 'FRS/feathers-client.js'
import responsive from 'FRS/components/responsive.jsx'
import SendSMS from 'FRS/components/SendSMS.jsx'
import SendEmail from 'FRS/components/SendEmail.jsx'
import Messages from 'FRS/components/Messages.jsx'
import Responses from 'FRS/components/Responses.jsx'

@responsive
export default class LandingPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isAuthenticated: true,
            isLoading: true,
            redirect: false,
            messagesAddress: '',
            snackBarOpen: false,
            snackBarMessage: null
        }
    }

    authenticate = (options) => {
        return app.authenticate({ strategy: 'local', ...options })
            .then(() => this.setState({ isAuthenticated: true }))
            .catch((err) => this.setState({
                    isAuthenticated: false,
                    snackBarOpen: true,
                    snackBarMessage: 'Login failed, please check your email and/or password'
                })
            )
    }

    getPropsFromChild = (messagesAddress) => {
        this.setState({messagesAddress})
    }

    handleCloseSnackBar = () => this.setState({ snackBarOpen: false })

    handleLogOut = () => {
        app.logout()
            .then(() => this.setState({redirect: true}))
    }


    componentDidMount() {
        return app.authentication.getAccessToken()
            .then(accessToken => {
                if (accessToken) {
                    return app.reAuthenticate()
                        .then(() => this.setState({ isAuthenticated: true }))
                        .then(() => this.setState({ isLoading: false }))
                } else{
                    this.setState({ isAuthenticated: false})
                }
            })
    }

    render() {
        const { onMobile } = this.props
        const { isAuthenticated, isLoading, snackBarOpen, snackBarMessage, redirect, messagesAddress } = this.state

        const textStyle = {
            fontFamily: 'Roboto, Arial, Helvetica, sans-serif',
            fontSize: 22,
            fontWeight: 100,
        }

        if(redirect || !isAuthenticated) {
            return <Redirect to="/"/>
        }

        return (

            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    width: '100%',
                    left: 0,
                    overflow: 'hidden',
                    position: 'absolute'
                }}
            >
                <Snackbar
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                    open={snackBarOpen}
                    autoHideDuration={6000}
                    onClose={this.handleCloseSnackBar}
                    message={snackBarMessage}
                />
                {isAuthenticated ?
                    <div style={{ textAlign: 'center', position: 'absolute', top: 10, left: 10 }}>
                        <Button variant="contained" color="secondary" onClick={this.handleLogOut} >
                            Logout
                        </Button>
                    </div>
                    :  null }
                <Paper
                    elevation={onMobile ? 0 : 3}
                    style={{
                        padding: onMobile ? 10 : 20,
                        margin: 20,
                        position: 'relative',
                        minHeight: 500,
                        ...onMobile ? { height: '100%', width: '100%', overflow: 'scroll' } : { width: 500 }
                    }}
                >
                    <div
                        style={{
                            fontFamily: 'Roboto, Arial, Helvetica, sans-serif',
                            fontSize: 28,
                            fontWeight: 700,
                            textAlign: 'center',
                            marginTop: onMobile ? 10 : 20,
                            marginBottom: onMobile ? 10 : 40,
                        }}
                    >
                        Project Name
                    </div>
                    {isLoading
                        ? <div style={{ position: 'fixed', right: 'calc(50vw - 22px)', top: 'calc(50vh - 22px)' }}>
                            <CircularProgress />
                        </div>
                        :
                        <div style={{ ...textStyle, margin: '60px auto', textAlign: 'center', position: 'relative' }}>
                            <SendSMS messagesAddress={messagesAddress}/>
                            <SendEmail />
                        </div>

                    }
                </Paper>
                <div style={{flexDirection: 'column'}}>
                    <Paper
                        elevation={onMobile ? 0 : 3}
                        style={{
                            padding: onMobile ? 10 : 20,
                            position: 'relative',
                            margin: 20,
                            minHeight: 315,
                            ...onMobile ? { height: '100%', width: '100%', overflow: 'scroll' } : { width: 500 }
                        }}
                    >
                        <div
                            style={{
                                fontFamily: 'Roboto, Arial, Helvetica, sans-serif',
                                fontSize: 28,
                                fontWeight: 700,
                                textAlign: 'center',
                                marginTop: onMobile ? 10 : 10,
                                marginBottom: onMobile ? 10 : 10,
                            }}
                        >
                            Messages
                        </div>
                        {isLoading
                            ? <div style={{ position: 'fixed', right: 'calc(50vw - 22px)', top: 'calc(50vh - 22px)' }}>
                                <CircularProgress />
                            </div>
                            :
                            <div style={{ ...textStyle, margin: '10px auto', textAlign: 'center', position: 'relative' }}>
                                <Messages getPropsFromChild={this.getPropsFromChild} />
                            </div>
                        }
                    </Paper>

                    <Paper
                        elevation={onMobile ? 0 : 3}
                        style={{
                            padding: onMobile ? 10 : 20,
                            position: 'relative',
                            margin: 20,
                            minHeight: 315,
                            ...onMobile ? { height: '100%', width: '100%', overflow: 'scroll' } : { width: 500 }
                        }}
                    >
                        <div
                            style={{
                                fontFamily: 'Roboto, Arial, Helvetica, sans-serif',
                                fontSize: 28,
                                fontWeight: 700,
                                textAlign: 'center',
                                marginTop: onMobile ? 10 : 10,
                                marginBottom: onMobile ? 10 : 10,
                            }}
                        >
                            Responses
                        </div>
                        {isLoading
                            ? <div style={{ position: 'fixed', right: 'calc(50vw - 22px)', top: 'calc(50vh - 22px)' }}>
                                <CircularProgress />
                            </div>
                            :
                            <div style={{ ...textStyle, margin: '10px auto', textAlign: 'center', position: 'relative' }}>
                                <Responses />
                            </div>
                        }
                    </Paper>
                </div>
            </div>
        )
    }
}
