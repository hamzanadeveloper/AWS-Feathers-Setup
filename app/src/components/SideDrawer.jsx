import React, { useState, useEffect } from 'react'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import Drawer from '@material-ui/core/Drawer'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import Button from '@material-ui/core/Button'
import PersonIcon from '@material-ui/icons/Person'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'

import app from 'FRS/feathers-client.js'

const drawerWidth = 240

const useStyles = makeStyles(theme => ({
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
}))

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
            <div style={{ textAlign: 'center', position: 'absolute', bottom: 10, width: '100%' }}>
                { open ?
                    <Button variant="contained" color="secondary" fullwidth onClick={() => props.handleLogOut()} >
                        Logout
                    </Button>
                    : null
                }
            </div>
        </Drawer>
    )
}

export default SideDrawer
