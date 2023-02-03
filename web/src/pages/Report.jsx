import React, { useState } from 'react';
import DateRangePicker from '@wojtekmaj/react-daterange-picker';
import Moment from 'moment';
import '../assets/css/Report.css';

class Report extends React.Component {
    constructor() {
        super();
        this.state = {
            date: [new Date(), new Date()]
        };
    }

    async download() {
        if (this.state.date.length == 2 && this.state.date[0] != null && this.state.date[1] != null) {
            const startDate = Moment(this.state.date[0]).format('D/M/YYYY');
            console.log(Moment(this.state.date[0]));
            console.log(Moment(this.state.date[1]));
            const endDate = Moment(this.state.date[1]).format('D/M/YYYY');
            window.open(`https://konselink.herokuapp.com/admin/download?startDate=${startDate}&endDate=${endDate}`, "_blank");
        }
    }

    handleDateChange(date) {
        console.log("le value 1: " + date[0]);
        console.log("le value 2: " + date[1]);
        this.setState({
            date: date
        });
    }

    render() {
        return(
            <div className="Report">
                <div className="date-container">
                    <DateRangePicker onChange={(date) => this.handleDateChange(date)} value={this.state.date} maxDate={new Date()} className="DatePicker"/>
                </div>
                <div className="download-report" onClick={() => this.download()}>Download</div>
            </div>
        )
    }
}

export default Report;