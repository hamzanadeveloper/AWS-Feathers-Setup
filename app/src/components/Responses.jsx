import React, { Component } from 'react'
import { formatDistance } from 'date-fns'

import { Snackbar, Paper } from "@material-ui/core";
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
            responses: []
        }
    }

    componentDidMount() {
        return app.service('amazon').find({ query: { $limit: 4, $sort: { createdAt: -1 }}})
            .then(result => this.setState({ responses: result.data }))
    }

    handleCloseSnackBar = () => this.setState({ snackBarOpen: false })

    render(){
        const { responses, snackBarOpen, snackBarMessage } = this.state

        return(
            <div>
                <Snackbar
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                    open={snackBarOpen}
                    autoHideDuration={6000}
                    onClose={this.handleCloseSnackBar}
                    message={snackBarMessage}
                />
                View your responses!
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
                            {responses.map(response => (
                                <TableRow key={response.id}>
                                    <TableCell component="th" scope="row">
                                        {response.messageBody}
                                    </TableCell>
                                    <TableCell align="right">{response.originationNumber}</TableCell>
                                    <TableCell align="right">{formatDistance(new Date(response.createdAt), new Date())} ago</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Paper>

            </div>
        )
    }
}
