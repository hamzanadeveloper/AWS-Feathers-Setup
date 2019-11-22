import React, { useState, useEffect } from 'react'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import Button from '@material-ui/core/Button'

import AddUserDialog from 'FRS/components/AddUserDialog.jsx'

const drawerWidth = 240

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
    },
    button: {
        margin: theme.spacing(1),
        marginBottom: '13px'
    },
    toolbar: {
        paddingRight: 24, // keep right padding when drawer closed
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
    appBarSpacer: theme.mixins.toolbar,
}))

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

export default TopBar
