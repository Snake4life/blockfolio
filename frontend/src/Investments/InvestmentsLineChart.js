import React from "react";
import { Line } from "react-chartjs-2";

class InvestmentsLineChart extends React.Component {
    componentDidUpdate() {
        console.log(this.props.data);
    }
    render() {
        return <Line data={this.props.data} options={this.props.options}/>;
    }
}

export default InvestmentsLineChart;
