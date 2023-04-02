import React, {useState} from "react";
import './legend.css'
import * as d3 from "d3";

export default function Legend(props) {
    var myColor = d3.scaleSequential().domain([0, props.clusters-1]).interpolator(d3.interpolateTurbo);

    return (
        <div id={"legend-container"} style={{width: props.clusters * 30}}>

            <b> Legend </b>

            <div id={"legend-points"}>
                {Array(props.clusters).fill(0).map((_, i) =>
                    <div className={"legend-point"} style={{backgroundColor: myColor(i)}}>

                        {i+1}

                    </div>
                )}
            </div>
        </div>
    )
}