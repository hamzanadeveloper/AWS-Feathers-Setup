import React, { Component } from 'react'
import { formatDistance } from 'date-fns'

import { Button, Snackbar, TextField, Paper } from "@material-ui/core";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import app from 'FRS/feathers-client.js'
import responsive from 'FRS/components/responsive.jsx'

@responsive
export default class SendSMS extends Component {
    constructor(props){
        super(props)
        this.state = {
            snackBarOpen: false,
            snackBarMessage: null,
            messages: []
        }
    }

    componentDidMount() {
        return app.service('notifications').find({
            query: {
                $limit: 4,
                $sort: {
                    createdAt: -1
                }
            }
        })
            .then(result =>{
                console.log(result.data)
                this.setState({messages: result.data})
            })
    }

    handleCloseSnackBar = () => this.setState({ snackBarOpen: false })

    render(){
        const { messages, snackBarOpen, snackBarMessage } = this.state

        return(
            <div>
                <Snackbar
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                    open={snackBarOpen}
                    autoHideDuration={6000}
                    onClose={this.handleCloseSnackBar}
                    message={snackBarMessage}
                />
                View your sent messages!
                <Paper>
                    <Table style={{minWidth: 300}} size="small" aria-label="a dense table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Message</TableCell>
                                <TableCell align="right">Phone/Email</TableCell>
                                <TableCell align="right">Date</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {messages.map(message => (
                                <TableRow key={message.id}>
                                    <TableCell component="th" scope="row">
                                        {message.body}
                                    </TableCell>
                                    <TableCell align="right">{message.address}</TableCell>
                                    <TableCell align="right">{formatDistance(new Date(message.createdAt), new Date())} ago</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Paper>

            </div>
        )
    }
}
