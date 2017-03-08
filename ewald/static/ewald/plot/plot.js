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
        let pointsData = [];
        let numPoints = Math.min(xData.length, yData.length);
        for (let i=0; i<numPoints; ++i) {
            pointsData.push([xData[i], yData[i]]);
        }
        this.pointsLine(htmlElement, pointsData, args);
    },
    pointsLine: function(htmlElement, pointsData, args) {
        let meta = {
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

        let frame = this.createFrame(
            htmlElement,
            { // bounds
                xMin: d3.min(pointsData, function(d) { return d[0]; }),
                xMax: d3.max(pointsData, function(d) { return d[0]; }),
                yMin: d3.min(pointsData, function(d) { return d[1]; }),
                yMax: d3.max(pointsData, function(d) { return d[1]; })
            },
            args);

        // define the line
        var valueLine = d3.line()
            .x(function(d) { return frame['xScale'](d[0]); })
            .y(function(d) { return frame['yScale'](d[1]); });

        // Create line plot
        var lineGraph = frame['svg'].append("path")
            .data([pointsData])
            .attr("class", "line")
            .attr("stroke", meta.stroke)
            .attr("stroke-width", meta.strokeWidth.toString() + 'px')
            .attr("fill", meta.fill || 'none')
            .attr("d", valueLine);
    },
    createFrame: function(htmlElement, bounds, args) {
        let meta = {
            vertPadding: 40,
            horPadding: 55,
            width: 600,
            height: 350,
            background: '#F6F6F6'
        };
        if (args) {
            for (var property in args) {
                if (args.hasOwnProperty(property)) {
                    meta[property] = args[property];
                }
            }
        }

        // Create SVG element
        $(htmlElement).css('background-color', meta.background);
        var svg = d3.select(htmlElement)
            .append("svg")
            .attr("width", meta.width)
            .attr("height", meta.height);

        // Create X scale and axis
        let xScale = d3.scaleLinear()
            .domain([bounds['xMin'], bounds['xMax']])
            .range([meta.horPadding, meta.width - meta.horPadding * 2]);
        let xAxis = d3.axisBottom()
            .scale(xScale)
            .ticks(Math.floor(meta.width / 80.0) - 1);
        svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0," + (meta.height - meta.vertPadding) + ")")
            .call(xAxis);

        // Create Y scale and axis
        let yScale = d3.scaleLinear()
            .domain([bounds['yMin'], bounds['yMax']])
            .range([meta.height - meta.vertPadding, meta.vertPadding]);
        let yAxis = d3.axisLeft()
            .scale(yScale)
            .ticks(Math.floor(meta.height / 60.0) - 1);
        svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(" + meta.horPadding + ",0)")
            .call(yAxis);

        // Create top scale and axis
        let x2Scale = d3.scaleLinear()
            .domain([bounds['xMin'], bounds['xMax']])
            .range([meta.horPadding, meta.width - meta.horPadding * 2]);
        let x2Axis = d3.axisBottom()
            .scale(x2Scale)
            .ticks( 0 /* Math.floor(meta.width / 80.0) - 1 */);
        svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0," + meta.vertPadding + ")")
            .call(x2Axis);

        // Create right scale and axis
        let y2Scale = d3.scaleLinear()
            .domain([bounds['yMin'], bounds['yMax']])
            .range([meta.height - meta.vertPadding, meta.vertPadding]);
        let y2Axis = d3.axisRight()
            .scale(y2Scale)
            .ticks( 0 /*Math.floor(meta.height / 60.0) - 1*/);
        svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(" + (meta.width - 2*meta.horPadding) + ",0)")
            .call(y2Axis);

        return {
            svg,
            xScale, xAxis, yScale, yAxis,
            x2Scale, x2Axis, y2Scale, y2Axis
        };
    }
}
