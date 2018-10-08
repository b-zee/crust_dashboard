import React from "react";
import {Chart, Geom, Axis, Tooltip, Legend} from "bizcharts";
import DataSet from "@antv/data-set";

class AreaChart extends React.Component {
    render() {
        const {data} = this.props; 
        var dv = new DataSet.View().source(data);
        dv.transform({
            type: "fold",
            fields: ["ACME", "Compitor", "TCP", "UDP"],
            key: "type",
            value: "value"
        });
        const scale = {
            value: {
                alias: "The Share Price in Dollars",
                formatter: function (val) {
                    return "$" + val;
                }
            },
            year: {
                range: [0, 1]
            }
        };
        return (
            <div>
                <Chart
                    height={500}
                    data={dv}
                    padding={"auto"}
                    scale={scale}
                    forceFit
                >
                    <Tooltip crosshairs />
                    <Axis />
                    <Legend />
                    <Geom type="area" position="year*value" color="type" shape="smooth" />
                    <Geom
                        type="line"
                        position="year*value"
                        color="type"
                        shape="smooth"
                        size={2}
                    />
                </Chart>
            </div>
        );
    }
}

export default AreaChart;