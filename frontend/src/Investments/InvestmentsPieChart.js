import React from "react";
import {Doughnut} from 'react-chartjs-2';

const chartData = {
    datasets: [
        {
            data: [10, 20, 30]
        }
    ],

    // These labels appear in the legend and in the tooltips when hovering different arcs
    labels: ["Red", "Yellow", "Blue"]
};

const chartOptions = {};

class InvestmentsPieChart extends React.Component {
    render() {
        return (
            <Doughnut
                data={this.props.data}
                options={chartOptions}
                width="600"
                height="250"
            />
        );
    }
}

export default InvestmentsPieChart;
