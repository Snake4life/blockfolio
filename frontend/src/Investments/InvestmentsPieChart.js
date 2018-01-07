import React from "react";
import { Doughnut } from "react-chartjs-2";

class InvestmentsPieChart extends React.Component {
    render() {
        return <Doughnut data={this.props.data} width="600" height="250" />;
    }
}

export default InvestmentsPieChart;
