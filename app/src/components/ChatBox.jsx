import React, { useState, useEffect } from 'react'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import PersonIcon from '@material-ui/icons/Person'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'

import app from 'FRS/feathers-client.js'

const useStyles = makeStyles(theme => ({
    list: {
        width: '100%',
    },
    button: {
        margin: theme.spacing(1),
        marginBottom: '13px'
    },
    container: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
    },
    paper: {
        display: 'flex',
        paddingLeft: '10px',
        paddingRight: '10px',
        paddingTop: '5px',
        overflow: 'auto',
        flexDirection: 'row',
    },
    fixedHeight: {
        height: '80%',
    },
}))

const ChatBox = props => {
    const classes = useStyles()
    const currentRecipient = props.currentRecipient
    const open = props.open
    const [messageHistory, setMessageHistory] = useState(props.messageHistory)
    const [newMessage, setMessage] = useState(props.newMessage)

    useEffect(() => {
        setMessageHistory(props.messageHistory)
        setMessage(props.newMessage)
    }, [props.messageHistory, props.newMessage])

    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight)

    const sendNotification = (event) => {
        event.preventDefault()

        app.service('notifications').create({ type:'sms', address: currentRecipient.phone, body: newMessage })
            .then((result) => {
                setMessageHistory([...messageHistory, result])
                setMessage("")
            })
            .catch((err) => console.log(err))
    }

    return (
        <Container maxWidth="lg" className={classes.container}>
            {currentRecipient.name ?
                <Grid container spacing={3}>
                    <Grid item xs={12} md={12} lg={12}>
                        <Paper style={{height: "73vh"}} className={fixedHeightPaper}>
                            <List className={classes.list}>
                                {messageHistory.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)).map(message => (
                                        message.originationNumber ?
                                            <div>
                                                <ListItem alignItems="flex-start">
                                                    <ListItemAvatar>
                                                        <PersonIcon fontSize="large"
                                                                    style={{marginTop: '5px'}}/>
                                                    </ListItemAvatar>
                                                    <ListItemText
                                                        style={{float: 'right'}}
                                                        primary={currentRecipient.name}
                                                        secondary={
                                                            <React.Fragment>
                                                                <Typography
                                                                    component="span"
                                                                    variant="body2"
                                                                    className={classes.inline}
                                                                    color="textPrimary"
                                                                >
                                                                </Typography>
                                                                {message.messageBody}
                                                            </React.Fragment>
                                                        }
                                                    />
                                                </ListItem>
                                                <Divider/>
                                            </div>
                                            :
                                            <div style={{flexDirection: 'row-reverse'}}>
                                                <ListItem alignItems="flex-start">
                                                    <ListItemText
                                                        style={{textAlign: 'right', paddingRight: '20px'}}
                                                        primary="Insight POC"
                                                        secondary={
                                                            <React.Fragment>
                                                                <Typography
                                                                    component="span"
                                                                    variant="body2"
                                                                    className={classes.inline}
                                                                    color="textPrimary"
                                                                >
                                                                </Typography>
                                                                {message.body}
                                                            </React.Fragment>
                                                        }
                                                    />
                                                    <ListItemAvatar>
                                                        <PersonIcon fontSize="large"
                                                                    style={{marginTop: '5px'}}/>
                                                    </ListItemAvatar>
                                                </ListItem>
                                                <Divider/>
                                            </div>
                                    )
                                )}
                            </List>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={12} lg={12}>
                        <Paper style={{height: '8vh'}} className={classes.paper}>
                            <TextField
                                margin="dense"
                                id="name"
                                onChange={(event) => setMessage(event.target.value)}
                                label="Message"
                                variant="outlined"
                                value={newMessage}
                                fullWidth
                            />
                            <Button onClick={sendNotification} color="secondary" variant="contained"
                                    className={classes.button}>
                                Send
                            </Button>
                        </Paper>
                    </Grid>
                </Grid>
                :
                <div
                    style={{
                        position: 'absolute',
                        width: open ? '77vw' : '92vw',
                        textAlign: 'center',
                        top: '35%',
                        color: 'white',
                        fontSize: '21px'
                    }}
                >Select or Create a Recipient!</div>
            }
        </Container>
    )
}

export default ChatBox
