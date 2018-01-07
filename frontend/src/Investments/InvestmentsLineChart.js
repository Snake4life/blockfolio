import React from "react";
import { Line } from "react-chartjs-2";

const data = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          label: 'TheChart',
          fillColor: 'rgba(0,0,0,0)',
          strokeColor: 'rgba(220,220,220,1)',
          data: [100, 5, 2, 115, 50, 90, 80]
        }
      ]
    };

class InvestmentsLineChart extends React.Component {
    render() {
        return <Line data={this.props.data} width="600" height="250" />;
    }
}

export default InvestmentsLineChart;
