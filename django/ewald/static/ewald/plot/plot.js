/*
 * Copyright (C) 2017 Elvis Teixeira
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var plot = {
    xyLine: function(htmlElement, xData, yData, args) {
        // Create data points
        var pointsData = [];
        for (let i=0; i<Math.min(xData.length, yData.length); ++i) {
            pointsData.push([xData[i], yData[i]]);
        }
        this.pointsLine(htmlElement, pointsData, args);
    },
    pointsLine: function(htmlElement, pointsData, args) {
        // plot meta data that can be overriden by the caller parameters
        let meta = {
            padding: 40,
            width: 600,
            height: 350,
            stroke: "blue",
            strokeWidth: 1.0,
            fill: null
        };
        if (args) {
            for (var property in args) {
                if (args.hasOwnProperty(property)) {
                    meta[property] = args[property];
                }
            }
        }

        //Create X scale
        let xScale = d3.scaleLinear()
            .domain([d3.min(pointsData, function(d) { return d[0]; }),
                     d3.max(pointsData, function(d) { return d[0]; })])
            .range([meta.padding, meta.width - meta.padding * 2]);
        //Define X axis
        var xAxis = d3.axisBottom()
            .scale(xScale)
            .ticks(5);

        //Create Y scale
        let yScale = d3.scaleLinear()
            .domain([d3.min(pointsData, function(d) { return d[1]; }),
                     d3.max(pointsData, function(d) { return d[1]; })])
            .range([meta.height - meta.padding, meta.padding]);
        //Define Y axis
        var yAxis = d3.axisLeft()
            .scale(yScale)
            .ticks(5);

        //Create SVG element
        var svg = d3.select(htmlElement)
            .append("svg")
            .attr("width", meta.width)
            .attr("height", meta.height);

        // define the line
        var valueLine = d3.line()
            .x(function(d) { return xScale(d[0]); })
            .y(function(d) { return yScale(d[1]); });

        // Create line plot
        var lineGraph = svg.append("path")
            .data([pointsData])
            .attr("class", "line")
            .attr("stroke", meta.stroke)
            .attr("stroke-width", meta.strokeWidth.toString() + 'px')
            .attr("fill", meta.fill || 'none')
            .attr("d", valueLine);

        //Create X axis
        svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0," + (meta.height - meta.padding) + ")")
            .call(xAxis);

        //Create Y axis
        svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(" + meta.padding + ",0)")
            .call(yAxis);
    }
}
