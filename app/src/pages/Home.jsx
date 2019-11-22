import React, { useState, useEffect } from 'react'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import Drawer from '@material-ui/core/Drawer'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import MenuIcon from '@material-ui/icons/Menu'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import PersonIcon from '@material-ui/icons/Person'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'

import app from 'FRS/feathers-client.js'
// import TopBar from 'FRS/components/TopBar.jsx'

const drawerWidth = 240

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
    },
    list: {
        width: '100%',
    },
    button: {
        margin: theme.spacing(1),
        marginBottom: '13px'
    },
    toolbar: {
        paddingRight: 24, // keep right padding when drawer closed
    },
    toolbarIcon: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 8px',
        ...theme.mixins.toolbar,
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: 36,
    },
    menuButtonHidden: {
        display: 'none',
    },
    title: {
        flexGrow: 1,
    },
    drawerPaper: {
        position: 'relative',
        whiteSpace: 'nowrap',
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerPaperClose: {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9),
        },
    },
    appBarSpacer: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
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

export default function Dashboard() {
    const classes = useStyles()
    const [open, setOpen] = useState(true)
    const [newMessage, setMessage] = useState('')
    const [currentRecipient, setCurrRecipient] = useState({})
    const [messageHistory, setMessageHistory] = useState([])

    const handleDrawerOpen = () => {
        setOpen(true)
    }

    const handleDrawerClose = () => {
        setOpen(false)
    }

    const sendNotification = (event) => {
        event.preventDefault()

        app.service('notifications').create({ type:'sms', address: currentRecipient.phone, body: newMessage })
            .then((result) => {
                setMessageHistory([...messageHistory, result])
                setMessage("")
            })
            .catch((err) => {
                console.log(err)
            })
    }

    const switchToNewRecipient = (phone, name) => {
        setMessage('')
        setMessageHistory([])
        setCurrRecipient({phone, name})
        app.service('notifications').find({ query: { address: phone, $sort: {createdAt: -1}}})
            .then(notifs => setMessageHistory(oldArray => [...oldArray, ...notifs.data]))
            .then(() => {
                return app.service('amazon').find({ query: { originationNumber: phone, $sort: {createdAt: -1}}})
                    .then(response => setMessageHistory(oldArray => [...oldArray, ...response.data]))
            })
    }

    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight)

    return (
        <div className={classes.root}>
            <CssBaseline />
            <TopBar open={open} handleDrawerOpen={handleDrawerOpen} recipientName={currentRecipient.name}/>
            <SideDrawer drawerOpen={open} handleDrawerClose={handleDrawerClose} switchToNewRecipient={switchToNewRecipient}/>

                <main className={classes.content}>
                    <div className={classes.appBarSpacer} />
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
                                                                    primary="Insight"
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
                                    width: '100%',
                                    textAlign: 'center',
                                    top: '35%',
                                    color: 'white',
                                    fontSize: '21px'
                                }}
                            >Select or Create a Recipient!</div>
                        }
                    </Container>
                </main>
            }
        </div>
    )
}

const TopBar = props => {
    const classes = useStyles()
    const [open, setOpen] = useState(props.open)
    const [dialogOpen, setDialogState] = useState(false)

    useEffect(() => {
        setOpen(props.open)
    }, [props.open])

    const handleDialogClose = () => {
        setDialogState(false)
    }

    return (
        <div className={classes.root}>
            <CssBaseline />
            <AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>
                <Toolbar className={classes.toolbar}>
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="open drawer"
                        onClick={() => {
                            setOpen(true)
                            props.handleDrawerOpen()
                        }}
                        className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
                        {props.recipientName}
                    </Typography>
                    <Button onClick={() => setDialogState(true)} color="secondary" variant="contained" className={classes.button}>
                        Add User
                    </Button>
                </Toolbar>
            </AppBar>
            <AddUserDialog dialogOpen={dialogOpen} handleDialogClose={handleDialogClose}/>
        </div>
    )
}

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

const SideDrawer = props => {
    const classes = useStyles()
    const [open, setOpen] = useState(props.drawerOpen)
    const [recipients, setRecipients] = useState([])

    useEffect(() => {
        app.service('recipients').find()
            .then(users => setRecipients(users.data))

        setOpen(props.drawerOpen)
    }, [props.drawerOpen])

    const getRecipientRecords = (phone, name) => {
        props.switchToNewRecipient(phone, name)
    }

    return (
        <Drawer
            variant="permanent"
            classes={{
                paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
            }}
            open={open}
        >
            <div className={classes.toolbarIcon}>
                <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
                    Recipients
                </Typography>
                <IconButton onClick={() => {
                    setOpen(false)
                    props.handleDrawerClose()
                }}>
                    <ChevronLeftIcon />
                </IconButton>
            </div>
            <Divider />
            <div>
                {recipients.map(recipient => (
                        <ListItem button onClick={() => getRecipientRecords(recipient.phone, recipient.name)}>
                            <ListItemIcon>
                                <PersonIcon />
                            </ListItemIcon>
                            <ListItemText primary={recipient.name} />
                        </ListItem>
                    )
                )}
            </div>
            <Divider />
        </Drawer>
    )
}

const ChatBox = props => {

    return (
        
    )
}


