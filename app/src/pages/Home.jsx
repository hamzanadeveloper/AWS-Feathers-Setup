import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import PersonIcon from '@material-ui/icons/Person';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import app from 'FRS/feathers-client.js'

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
    },
    button: {
        margin: theme.spacing(1),
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
        padding: theme.spacing(2),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
    },
    fixedHeight: {
        height: '80%',
    },
}));

export default function Dashboard() {
    const classes = useStyles();
    const [open, setOpen] = useState(true);
    const [dialogOpen, setDialogState] = useState(false);
    const [newName, setUserName] = useState('');
    const [newPhone, setUserPhone] = useState('');
    const [recipients, setRecipients] = useState([]);
    const [currentRecipient, setCurrRecipient] = useState('');
    const [messageHistory, setMessageHistory] = useState([])

    useEffect(() => {
        app.service('recipients').find()
            .then(users => setRecipients(users.data))
    })

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const handleDialogOpen = () => {
        setDialogState(true);
    };

    const handleDialogClose = () => {
        setDialogState(false);
    };

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

    const getRecipientRecords = (phone, name) => {
        setCurrRecipient(name);
        app.service('notifications').find({ query: { address: phone}})
            .then(notifs => setMessageHistory(oldArray => [...oldArray, ...notifs.data]))
            .then(() => {
                return app.service('amazon').find({query: {originationNumber: phone}})
                    .then(response => setMessageHistory(oldArray => [...oldArray, ...response.data]))
            })

    }

    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

    return (
        <div className={classes.root}>
            <CssBaseline />
            <AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>
                <Toolbar className={classes.toolbar}>
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
                        {currentRecipient}
                    </Typography>
                    <Button onClick={handleDialogOpen} color="secondary" variant="contained" className={classes.button}>
                        Add User
                    </Button>
                </Toolbar>
            </AppBar>
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
                    <IconButton onClick={handleDrawerClose}>
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
                {/*<List>{secondaryListItems}</List>*/}
            </Drawer>
            <main className={classes.content}>
                <div className={classes.appBarSpacer} />
                <Container maxWidth="lg" className={classes.container}>
                    <Grid container spacing={3}>
                        {/* Chat */}
                        <Grid item xs={12} md={12} lg={12}>
                            <Paper  style={{height: "73vh"}} className={fixedHeightPaper}>
                                {/*<Chart />*/}
                            </Paper>
                        </Grid>
                        {/* Send Message */}
                        <Grid item xs={12} md={12} lg={12}>
                            <Paper style={{height: '8vh'}} className={classes.paper}>
                                {/*<Orders />*/}
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
            </main>

            <Dialog open={dialogOpen} onClose={handleDialogClose} aria-labelledby="form-dialog-title" >
                <DialogTitle id="form-dialog-title">Create Recipient</DialogTitle>
                <DialogContent style={{minWidth: '500px', }}>
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
        </div>
    );
}

// import React, { Component } from 'react'
// import { Redirect } from "react-router-dom";
//
// import { Button, Snackbar, Paper, CircularProgress } from "@material-ui/core";
//
// import app from 'FRS/feathers-client.js'
// import responsive from 'FRS/components/responsive.jsx'
// import SendSMS from 'FRS/components/SendSMS.jsx'
// import SendEmail from 'FRS/components/SendEmail.jsx'
// import Messages from 'FRS/components/Messages.jsx'
// import Responses from 'FRS/components/Responses.jsx'
//
// @responsive
// export default class LandingPage extends Component {
//     constructor(props) {
//         super(props)
//         this.state = {
//             isAuthenticated: true,
//             isLoading: true,
//             redirect: false,
//             messagesAddress: '',
//             snackBarOpen: false,
//             snackBarMessage: null
//         }
//     }
//
//     authenticate = (options) => {
//         return app.authenticate({ strategy: 'local', ...options })
//             .then(() => this.setState({ isAuthenticated: true }))
//             .catch((err) => this.setState({
//                     isAuthenticated: false,
//                     snackBarOpen: true,
//                     snackBarMessage: 'Login failed, please check your email and/or password'
//                 })
//             )
//     }
//
//     getPropsFromChild = (messagesAddress) => {
//         this.setState({messagesAddress})
//     }
//
//     handleCloseSnackBar = () => this.setState({ snackBarOpen: false })
//
//     handleLogOut = () => {
//         app.logout()
//             .then(() => this.setState({ redirect: true }))
//     }
//
//
//     componentDidMount() {
//         return app.authentication.getAccessToken()
//             .then(accessToken => {
//                 if (accessToken) {
//                     return app.reAuthenticate()
//                         .then(() => this.setState({ isAuthenticated: true }))
//                         .then(() => this.setState({ isLoading: false }))
//                 } else {
//                     this.setState({ isAuthenticated: false})
//                 }
//             })
//     }
//
//     render() {
//         const { onMobile } = this.props
//         const { isAuthenticated, isLoading, snackBarOpen, snackBarMessage, redirect, messagesAddress } = this.state
//
//         const textStyle = {
//             fontFamily: 'Roboto, Arial, Helvetica, sans-serif',
//             fontSize: 22,
//             fontWeight: 100,
//         }
//
//         if(redirect || !isAuthenticated) {
//             return <Redirect to="/"/>
//         }
//
//         return (
//
//             <div
//                 style={{
//                     display: 'flex',
//                     alignItems: 'center',
//                     justifyContent: 'center',
//                     height: '100%',
//                     width: '100%',
//                     left: 0,
//                     overflow: 'hidden',
//                     position: 'absolute'
//                 }}
//             >
//                 <Snackbar
//                     anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
//                     open={snackBarOpen}
//                     autoHideDuration={6000}
//                     onClose={this.handleCloseSnackBar}
//                     message={snackBarMessage}
//                 />
//                 {isAuthenticated ?
//                     <div style={{ textAlign: 'center', position: 'absolute', top: 10, left: 10 }}>
//                         <Button variant="contained" color="secondary" onClick={this.handleLogOut} >
//                             Logout
//                         </Button>
//                     </div>
//                     :  null }
//                 <Paper
//                     elevation={onMobile ? 0 : 3}
//                     style={{
//                         padding: onMobile ? 10 : 20,
//                         margin: 20,
//                         position: 'relative',
//                         minHeight: 500,
//                         ...onMobile ? { height: '100%', width: '100%', overflow: 'scroll' } : { width: 500 }
//                     }}
//                 >
//                     <div
//                         style={{
//                             fontFamily: 'Roboto, Arial, Helvetica, sans-serif',
//                             fontSize: 28,
//                             fontWeight: 700,
//                             textAlign: 'center',
//                             marginTop: onMobile ? 10 : 20,
//                             marginBottom: onMobile ? 10 : 40,
//                         }}
//                     >
//                         Project Name
//                     </div>
//                     {isLoading
//                         ? <div style={{ position: 'fixed', right: 'calc(50vw - 22px)', top: 'calc(50vh - 22px)' }}>
//                             <CircularProgress />
//                         </div>
//                         :
//                         <div style={{ ...textStyle, margin: '60px auto', textAlign: 'center', position: 'relative' }}>
//                             <SendSMS messagesAddress={messagesAddress}/>
//                             <SendEmail />
//                         </div>
//
//                     }
//                 </Paper>
//                 <div style={{flexDirection: 'column'}}>
//                     <Paper
//                         elevation={onMobile ? 0 : 3}
//                         style={{
//                             padding: onMobile ? 10 : 20,
//                             position: 'relative',
//                             margin: 20,
//                             minHeight: 315,
//                             ...onMobile ? { height: '100%', width: '100%', overflow: 'scroll' } : { width: 500 }
//                         }}
//                     >
//                         <div
//                             style={{
//                                 fontFamily: 'Roboto, Arial, Helvetica, sans-serif',
//                                 fontSize: 28,
//                                 fontWeight: 700,
//                                 textAlign: 'center',
//                                 marginTop: onMobile ? 10 : 10,
//                                 marginBottom: onMobile ? 10 : 10,
//                             }}
//                         >
//                             Messages
//                         </div>
//                         {isLoading
//                             ? <div style={{ position: 'fixed', right: 'calc(50vw - 22px)', top: 'calc(50vh - 22px)' }}>
//                                 <CircularProgress />
//                             </div>
//                             :
//                             <div style={{ ...textStyle, margin: '10px auto', textAlign: 'center', position: 'relative' }}>
//                                 <Messages getPropsFromChild={this.getPropsFromChild} />
//                             </div>
//                         }
//                     </Paper>
//
//                     <Paper
//                         elevation={onMobile ? 0 : 3}
//                         style={{
//                             padding: onMobile ? 10 : 20,
//                             position: 'relative',
//                             margin: 20,
//                             minHeight: 315,
//                             ...onMobile ? { height: '100%', width: '100%', overflow: 'scroll' } : { width: 500 }
//                         }}
//                     >
//                         <div
//                             style={{
//                                 fontFamily: 'Roboto, Arial, Helvetica, sans-serif',
//                                 fontSize: 28,
//                                 fontWeight: 700,
//                                 textAlign: 'center',
//                                 marginTop: onMobile ? 10 : 10,
//                                 marginBottom: onMobile ? 10 : 10,
//                             }}
//                         >
//                             Responses
//                         </div>
//                         {isLoading
//                             ? <div style={{ position: 'fixed', right: 'calc(50vw - 22px)', top: 'calc(50vh - 22px)' }}>
//                                 <CircularProgress />
//                             </div>
//                             :
//                             <div style={{ ...textStyle, margin: '10px auto', textAlign: 'center', position: 'relative' }}>
//                                 <Responses />
//                             </div>
//                         }
//                     </Paper>
//                 </div>
//             </div>
//         )
//     }
// }
