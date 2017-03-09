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
    plot: function(args) {
        if ( ! args.data)
            throw Error('No data provided!');
        // Let's guess the schema of the data
        // TODO: IMPROVE INPUT DATA MANAGEMENT
        args.data = args.data.points;

        // define the line
        let chart = this.createChart(args);
        let valueLine = d3.line()
            .x(function(d) { return chart.bottomScale(d[0]); })
            .y(function(d) { return chart.leftScale(d[1]); });
        // Create line plot
        let lineGraph = chart.svg.append("path")
            .data([args.data])
            .attr("class", "line")
            .attr("stroke", args.stroke)
            .attr("stroke-width", args.strokeWidth.toString() + 'px')
            .attr("fill", args.fill || 'none')
            .attr("d", valueLine);
    },
    xyToPoints: function(x, y) {
        let points = [];
        let nPts = Math.min(x.length, y.length);
        for (let i=0; i<nPts; ++i) {
            points.push([x[i], y[i]]);
        }
        return points;
    },
    createChart: function(args) {
        let chart = {
            bounds: {
                xMin: d3.min(args.data, function(d) { return d[0]; }),
                xMax: d3.max(args.data, function(d) { return d[0]; }),
                yMin: d3.min(args.data, function(d) { return d[1]; }),
                yMax: d3.max(args.data, function(d) { return d[1]; }),
            },
            svg: d3.select(args.htmlElement).append("svg"),
        };
        this.addDefaults(chart, args);
        this.createAxisAndScales(chart, args);
        this.styleAxisObjects(chart, args);
        this.addAxisToSvg(chart, args);
        this.styleAxisElements(chart, args);
        return chart;
    },
    addDefaults: function(chart, args) {
        // REQUIRED properties of args:
        if ( ! args.htmlElement || ! args.data)
            throw Error('Arguments required: htmlElement and data');
        // - data
        let defaults = {
            vertPadding: 40,
            horPadding: 55,
            width: 600,
            height: 350,
            background: '#F6F6F6',
            stroke: "blue",
            strokeWidth: 1.0,
            fill: null
        };
        for (let prop in defaults) {
            if ( ! args.hasOwnProperty(prop)) {
                args[prop] = defaults[prop];
            }
        }
    },
    styleAxisObjects: function(chart, args) {
        if (args.grid) {
            chart.bottomAxis
                .tickSizeOuter(0)
                .tickSizeInner(- args.height + 2*args.vertPadding);
            chart.leftAxis
                .tickSizeOuter(0)
                .tickSizeInner(- args.width + 2*args.horPadding);
            if (args.data2 || args.closeFrame) {
                // TODO
            }
        }
    },
    styleAxisElements: function(chart, args) {
        if (args.grid) {
            $('.tick').addClass('weak');
        }
    },
    addAxisToSvg: function(chart, args) {
        chart.svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0," + (args.height - args.vertPadding) + ")")
            .call(chart.bottomAxis);
        chart.svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(" + args.horPadding + ",0)")
            .call(chart.leftAxis);
        if (args.data2 || args.closeFrame) {
            chart.svg.append("g")
                .attr("class", "axis")
                .attr("transform", "translate(" + (args.width - args.horPadding) + ",0)")
                .call(chart.rightAxis);
            chart.svg.append("g")
                .attr("class", "axis")
                .attr("transform", "translate(0," + args.vertPadding + ")")
                .call(chart.topAxis);
        }
    },
    createAxisAndScales: function(chart, args) {
        // give a 'size' to the plot
        chart.svg.attr("width", args.width)
                 .attr("height", args.height);
        // create axis and scales
        chart.bottomScale = d3.scaleLinear()
            .domain([chart.bounds.xMin, chart.bounds.xMax])
            .range([args.horPadding, args.width - args.horPadding]);
        chart.bottomAxis = d3.axisBottom()
            .scale(chart.bottomScale)
            .ticks(Math.floor(args.width / 60.0) - 1);
        chart.leftScale = d3.scaleLinear()
            .domain([chart.bounds.yMin, chart.bounds.yMax])
            .range([args.height - args.vertPadding, args.vertPadding]);
        chart.leftAxis = d3.axisLeft()
            .scale(chart.leftScale)
            .ticks(Math.floor(args.height / 50.0) - 1);
        // secondary (top and right) axis are created if needed
        if (args.data2 || args.closeFrame) {
            chart.topScale = d3.scaleLinear()
                .domain([chart.bounds.xMin, chart.bounds.xMax])
                .range([args.horPadding, args.width - args.horPadding]);
            chart.topAxis = d3.axisTop().scale(chart.topScale);
            if (args.data2 && args.data2.topScale)
                chart.topAxis.ticks(Math.floor(args.width / 60.0) - 1)
            else
                chart.topAxis.ticks(0).tickSizeOuter(0);
            chart.rightScale = d3.scaleLinear()
                .domain([chart.bounds.yMin, chart.bounds.yMax])
                .range([args.height - args.vertPadding, args.vertPadding]);
            chart.rightAxis = d3.axisRight().scale(chart.rightScale);
            if (args.data2)
                chart.rightAxis.ticks(Math.floor(args.height / 50.0) - 1);
            else
                chart.rightAxis.ticks(0).tickSizeOuter(0);
        }
    }
}
