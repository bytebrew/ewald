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

var plot = { VERSION: '0.2' };

plot.Chart = function(args) {
    // There are some required arguments
    if (!args.container)
        throw Error('Chart needs an HTML div to draw on');
    if (!args.series || !(args.series.constructor === Array))
        throw Error('Chart needs an array of series objects');

    // Collect the properties given as args and complete
    // the missing ones with the defaults
    for (prop in args)
        this[prop] = args[prop];
    plot.__defaults__.update(this);

    // create the various elements that compose the chart
    plot.__updateBounds__(this);
    plot.__createSVG__(this);
    plot.__createAxis__(this);
    plot.__addSVGAxis__(this);
    plot.__styleAxis__(this);
    plot.__createSeries__(this);
}

plot.__defaults__ = {
    chart: {
        verticalPadding: 40,
        horizontalPadding: 55,
        width: 600,
        height: 600,
        background: '#F6F6F6'
    },
    series: {
        stroke: 'blue',
        strokeWidth: '1.0',
        fill: 'none'
    },
    update: function(args) {
        for (let prop in this.chart)
            if (!args.hasOwnProperty(prop))
                args[prop] = this.chart[prop];
        for (let series of args.series)
            for (let prop in this.series)
                if (!series.hasOwnProperty(prop))
                    series[prop] = this.series[prop];
    }
};

plot.__updateBounds__ = function(chart) {
    let bounds = {
        xMin: d3.min(chart.series[0].data, function(d) { return d[0]; }),
        xMax: d3.max(chart.series[0].data, function(d) { return d[0]; }),
        yMin: d3.min(chart.series[0].data, function(d) { return d[1]; }),
        yMax: d3.max(chart.series[0].data, function(d) { return d[1]; }),
    };
    for (series of chart.series) {
        bounds.xMin = Math.min(bounds.xMin, d3.min(series.data, function(d) { return d[0]; }));
        bounds.xMax = Math.max(bounds.xMax, d3.max(series.data, function(d) { return d[0]; }));
        bounds.yMin = Math.min(bounds.yMin, d3.min(series.data, function(d) { return d[1]; }));
        bounds.yMax = Math.max(bounds.yMax, d3.max(series.data, function(d) { return d[1]; }));
    };
    chart.bounds = [ bounds, bounds ];
}

plot.__createSVG__ = function(chart) {
    chart.svg = d3.select(chart.container).append("svg")
        .attr('width', chart.width)
        .attr('height', chart.height);
}

plot.__createAxis__ = function(chart) {
    chart.scaleBottom = d3.scaleLinear()
        .domain([chart.bounds[0].xMin, chart.bounds[0].xMax])
        .range([chart.horizontalPadding, chart.width - chart.horizontalPadding]);
    chart.axisBottom = d3.axisBottom()
        .scale(chart.scaleBottom)
        .ticks(Math.floor(chart.width/60.0) - 1);

    chart.scaleLeft = d3.scaleLinear()
        .domain([chart.bounds[0].yMin, chart.bounds[0].yMax])
        .range([chart.height - chart.verticalPadding, chart.verticalPadding]);
    chart.axisLeft = d3.axisLeft()
        .scale(chart.scaleLeft)
        .ticks(Math.floor(chart.height/50.0) - 1);

    chart.scaleTop = d3.scaleLinear()
        .domain([chart.bounds[1].xMin, chart.bounds[1].xMax])
        .range([chart.horizontalPadding, chart.width - chart.horizontalPadding]);
    chart.axisTop = d3.axisTop()
        .scale(chart.scaleTop)
        .ticks(0).tickSizeOuter(0);

    chart.scaleRight = d3.scaleLinear()
        .domain([chart.bounds[1].yMin, chart.bounds[1].yMax])
        .range([chart.height - chart.verticalPadding, chart.verticalPadding]);
    chart.axisRight = d3.axisRight()
        .scale(chart.scaleRight)
        .ticks(0).tickSizeOuter(0);
}

plot.__styleAxis__ = function(chart) {

}

plot.__addSVGAxis__ = function(chart) {
    chart.svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + (chart.height -
            chart.verticalPadding) + ")")
        .call(chart.axisBottom);

    chart.svg.append("g")
       .attr("class", "axis")
       .attr("transform", "translate(" + chart.horizontalPadding + ",0)")
       .call(chart.axisLeft);

    chart.svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + (chart.width -
            chart.horizontalPadding) + ",0)")
        .call(chart.axisRight);

    chart.svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + chart.verticalPadding + ")")
        .call(chart.axisTop);
}

plot.__createSeries__ = function(chart) {
    for (series of chart.series) {
        let plotObj = d3.line();
        if (series.axis && series.axis === 'right') {
                plotObj.x(function(d) { return chart.scaleBottom(d[0]); })
                plotObj.y(function(d) { return chart.scaleLeft(d[1]); });
        } else {
            plotObj.x(function(d) { return chart.scaleBottom(d[0]); })
            plotObj.y(function(d) { return chart.scaleLeft(d[1]); });
        }
        let plotElem = chart.svg.append("path")
            .data([series.data])
            .attr("class", "line")
            .attr("stroke", series.stroke)
            .attr("stroke-width", series.strokeWidth.toString() + 'px')
            .attr("fill", series.fill || 'none')
            .attr("d", plotObj);
    }
}
