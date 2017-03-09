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
    /**
     The plot function let's you plot 2D XY plots from point data
     the argument object may have the following form
     {
         container: $('#my-div'),  ->  HTML element to put the plot in
         width: 500,  -> width set to the the div used as container
         height: 400,  -> height set to the the div used as container
         grid: true,  ->  show grid lines in the plot
         topScale: true,  ->  if any data2 plot, shows top axis ticks
         frame: true,  ->  show top/right axis line to close frame
         data:
         [
            {
                points: [[x,y], [x,y]],  ->  array of data points
                label: "...",   ->   nickname of the series
                stroke: #A353E1,  ->  line color
                strokeWidth: 1.5,  ->  line width
                fill: #A353E1,  ->  fill color
                symbol: 'line',  -> graphical symbol (see below)
            }
            ...  ->  possible many plots in the primary axis
         ],
         data2:  ->  data2 series are attached to the top/right axis
         {
            {
                points: [[x,y], [x,y]],  ->  array of data points
                label: "...",   ->   nickname of the series
                stroke: #A353E1,  ->  line color
                strokeWidth: 1.5,  ->  line width
                fill: #A353E1,  ->  fill color
                symbol: 'line',  -> graphical symbol (see below)
            },
            ...  ->  possible many plots in the second axis
         ],
     }
     */
    plot: function(args) {
        // data and container are the required arguments
        if (!args.container || !args.data)
            throw Error('No data provided!');

        let chart = this.makeChart(args);
        this.makePlots(chart, args);
    },
    makePlots: function(chart, args) {
        for (series of args.data) {
            let plotObj = d3.line()
                .x(function(d) { return chart.bottomScale(d[0]); })
                .y(function(d) { return chart.leftScale(d[1]); });
            let plotElem = chart.svg.append("path")
                .data([series.points])
                .attr("class", "line")
                .attr("stroke", series.stroke)
                .attr("stroke-width", series.strokeWidth.toString() + 'px')
                .attr("fill", series.fill || 'none')
                .attr("d", plotObj);
        }
    },
    makeChart: function(args) {
        let bounds1 = {
            xMin: d3.min(args.data[0].points, function(d) { return d[0]; }),
            xMax: d3.max(args.data[0].points, function(d) { return d[0]; }),
            yMin: d3.min(args.data[0].points, function(d) { return d[1]; }),
            yMax: d3.max(args.data[0].points, function(d) { return d[1]; }),
        };
        for (series of args.data) {
            bounds1.xMin = Math.min(bounds1.xMin, d3.min(series.points, function(d) { return d[0]; }));
            bounds1.xMax = Math.max(bounds1.xMax, d3.max(series.points, function(d) { return d[0]; }));
            bounds1.yMin = Math.min(bounds1.yMin, d3.min(series.points, function(d) { return d[1]; }));
            bounds1.yMax = Math.max(bounds1.yMax, d3.max(series.points, function(d) { return d[1]; }));
        };
        let chart = {
            bounds1: bounds1,
            bounds2: bounds1,
            svg: d3.select(args.container).append("svg"),
        };
        this.addDefaults(chart, args);
        this.makeAxisAndScales(chart, args);
        this.styleAxisObjects(chart, args);
        this.addAxisToSvg(chart, args);
        this.styleAxisElements(chart, args);
        return chart;
    },
    addDefaults: function(chart, args) {
        let chartDefaults = {
            vertPadding: 40,
            horPadding: 55,
            width: 600,
            height: 350,
            background: '#F6F6F6',
        };
        let seriesDefaults = {
            stroke: "blue",
            strokeWidth: 1.0,
            fill: null
        };
        for (let prop in chartDefaults) {
            if (!args.hasOwnProperty(prop)) {
                args[prop] = chartDefaults[prop];
            }
        }
        for (let series of args.data) {
            for (let prop in seriesDefaults) {
                if (!series.hasOwnProperty(prop)) {
                    series[prop] = seriesDefaults[prop];
                }
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
            if (args.data2 || args.frame) {
                // TODO
            }
        }
    },
    styleAxisElements: function(chart, args) {
        if (args.grid) {
            $('.tick').addClass('weak-line');
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
        if (args.data2 || args.frame) {
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
    makeAxisAndScales: function(chart, args) {
        // give a 'size' to the plot
        chart.svg.attr("width", args.width)
                 .attr("height", args.height);
        // create axis and scales
        chart.bottomScale = d3.scaleLinear()
            .domain([chart.bounds1.xMin, chart.bounds1.xMax])
            .range([args.horPadding, args.width - args.horPadding]);
        chart.bottomAxis = d3.axisBottom()
            .scale(chart.bottomScale)
            .ticks(Math.floor(args.width / 60.0) - 1);
        chart.leftScale = d3.scaleLinear()
            .domain([chart.bounds1.yMin, chart.bounds1.yMax])
            .range([args.height - args.vertPadding, args.vertPadding]);
        chart.leftAxis = d3.axisLeft()
            .scale(chart.leftScale)
            .ticks(Math.floor(args.height / 50.0) - 1);
        // secondary (top and right) axis are created if needed
        if (args.data2 || args.frame) {
            chart.topScale = d3.scaleLinear()
                .domain([chart.bounds2.xMin, chart.bounds2.xMax])
                .range([args.horPadding, args.width - args.horPadding]);
            chart.topAxis = d3.axisTop().scale(chart.topScale);
            if (args.data2 && args.data2.topScale)
                chart.topAxis.ticks(Math.floor(args.width / 60.0) - 1)
            else
                chart.topAxis.ticks(0).tickSizeOuter(0);
            chart.rightScale = d3.scaleLinear()
                .domain([chart.bounds2.yMin, chart.bounds2.yMax])
                .range([args.height - args.vertPadding, args.vertPadding]);
            chart.rightAxis = d3.axisRight().scale(chart.rightScale);
            if (args.data2)
                chart.rightAxis.ticks(Math.floor(args.height / 50.0) - 1);
            else
                chart.rightAxis.ticks(0).tickSizeOuter(0);
        }
    }
}
