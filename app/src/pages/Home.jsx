import React, { useState, useEffect } from 'react'
import { Redirect } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'

import app from 'FRS/feathers-client.js'
import TopBar from 'FRS/components/TopBar.jsx'
import SideDrawer from 'FRS/components/SideDrawer.jsx'
import ChatBox from 'FRS/components/ChatBox.jsx'

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
    },
    appBarSpacer: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
    },
}))

export default function Dashboard() {
    const classes = useStyles()
    const [newMessage, setMessage] = useState('')
    const [open, setOpen] = useState(true)
    const [redirect, setRedirect] = useState(false)
    const [isAuthenticated, setAuthentication] = useState(true)
    const [currentRecipient, setCurrRecipient] = useState({})
    const [messageHistory, setMessageHistory] = useState([])

    useEffect(() => {
        app.authentication.getAccessToken()
            .then(accessToken => {
                if (accessToken) {
                    return app.reAuthenticate()
                        .then(() => setAuthentication(true))
                } else {
                    setAuthentication(false)
                }
            })
    })

    const handleDrawerOpen = () => {
        setOpen(true)
    }

    const handleDrawerClose = () => {
        setOpen(false)
    }

    const switchToNewRecipient = (phone, name) => {
        setMessage('')
        setMessageHistory([])
        setCurrRecipient({phone, name})
        app.service('notifications').find({ query: { address: phone, $sort: {createdAt: -1}}})
            .then(notifs => setMessageHistory(oldArray => [...oldArray, ...notifs.data]))
            .then(() => {
                return app.service('amazon').find({ query: { originationNumber: phone, $sort: {createdAt: -1}}})
                    .then(response => setMessageHistory(oldArray => [...oldArray, ...response.data].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))))
            })
    }

    const handleLogOut = () => {
        app.logout()
            .then(() => setRedirect(true))
    }

    return (
        <div className={classes.root}>

            { redirect || !isAuthenticated ? <Redirect to="/" /> : null }

            <CssBaseline />
            <TopBar open={open} handleDrawerOpen={handleDrawerOpen} recipientName={currentRecipient.name}/>
            <SideDrawer
                drawerOpen={open}
                handleDrawerClose={handleDrawerClose}
                switchToNewRecipient={switchToNewRecipient}
                handleLogOut={handleLogOut}/>

                <main className={classes.content}>
                    <div className={classes.appBarSpacer} />

                    <ChatBox
                        currentRecipient={currentRecipient}
                        messageHistory={messageHistory}
                        newMessage={newMessage}
                        open={open}/>
                </main>
            }
        </div>
    )
}


