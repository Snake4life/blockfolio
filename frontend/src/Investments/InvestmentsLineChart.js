import React from "react";
import { Line } from "react-chartjs-2";

class InvestmentsLineChart extends React.Component {
    render() {
        return <Line data={this.props.data} width="600" height="250" />;
    }
}

export default InvestmentsLineChart;
