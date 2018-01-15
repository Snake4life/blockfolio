import React from "react";
import { Line, Chart } from "react-chartjs-2";

class InvestmentsLineChart extends React.Component {
    componentWillMount() {
        Chart.pluginService.register({
            afterDraw: function(chart, easing) {
                var ctx = chart.chart.ctx;
                var chartArea = chart.chartArea;

                if (window.tooltipItem) var x = window.tooltipItem.x;

                if (!isNaN(x)) {
                    ctx.save();
                    ctx.strokeStyle = "black";
                    ctx.moveTo(x, chartArea.bottom);
                    ctx.lineTo(x, chartArea.top);
                    ctx.stroke();
                    ctx.restore();
                }
            }
        });
    }
    render() {
        return (
            <Line
                styles={{height:"100vh"}}
                responsive={false}

                data={this.props.data}
                options={{
                    legend: {
                        display: false
                    },
                    customLine: {
                        color: "black"
                    },
                    tooltips: {
                        intersect: false,
                        mode: "index",
                        callbacks: {
                            label: function(tooltipItem, chart) {
                                window.tooltipItem = tooltipItem;
                                return tooltipItem.yLabel;
                            }
                        }
                    },
                    options: {
                         maintainAspectRatio: false,
                    }
                }}
            />
        );
    }
}

export default InvestmentsLineChart;
