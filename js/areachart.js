/*
 * AreaChart - Object constructor function
 * @param _parentElement 	-- the HTML element in which to draw the area chart
 * @param _data						-- the dataset 'household characteristics'
 */

function sortDays(a, b) {
    return a[0] - b[0];
}

class AreaChart {


    constructor(parentElement, data) {
        this.parentElement = parentElement;
        this.data = data.sort(sortDays);
        this.displayData = [];


        this.initVis();

    }

    /*
     * Initialize visualization (static content; e.g. SVG area, axes, brush component)
     */

    initVis() {
        let vis = this;

        vis.margin = {top: 20, right: 40, bottom: 20, left: 100};

        // TODO: #9 - Change hardcoded width to reference the width of the parent element
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = 250 - vis.margin.top - vis.margin.bottom;


        // SVG drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");


        // Scales and axes
        vis.x = d3.scaleTime()
            .range([0, vis.width]);

        vis.y = d3.scaleLinear()
            .range([vis.height, 0]);

        vis.yAxis = d3.axisLeft()
            .scale(vis.y);

        vis.xAxis = d3.axisBottom()
            .scale(vis.x)
            .ticks(6);

        vis.svg.append("g")
            .attr("class", "y-axis axis");

        vis.svg.append("g")
            .attr("class", "x-axis axis")
            .attr("transform", "translate(0," + vis.height + ")");


        // Append a path for the area function, so that it is later behind the brush overlay
        vis.timePath = vis.svg.append("path")
            .attr("class", "area");

        // TO-DO: Add Brushing to Chart

        // Initialize time scale (x-axis)

        let brush = d3.brushX()
            .extent([[0, 0], [vis.width, vis.height]])
            .on("brush", brushed);

        // TO-DO: Append brush component here

        vis.svg.append("g")
            .attr("class", "x brush")
            .call(brush)
            .selectAll("rect")
            .attr("y", 0)
            .attr("height", vis.height);


        // (Filter, aggregate, modify data)
        vis.wrangleData();
    }


    /*
     * Data wrangling
     */

    wrangleData() {
        let vis = this;

        // Update the visualization
        vis.updateVis();
    }



    /*
     * The drawing function
     */

    updateVis() {
        let vis = this;

        // Update domain
        vis.x.domain(d3.extent(vis.data, function (d, i) {
            return d[0];
        }));
        vis.y.domain([0, d3.max(vis.data, function (d, i) {
            return d[1];
        })]);


        // D3 area path generator
        vis.area = d3.area()
            .curve(d3.curveCardinal)
            .x(function (d,i) {
                return vis.x(d[0]);
            })
            .y0(vis.height)
            .y1(function (d, i) {
                return vis.y(d[1]);
            });


        // Call the area function and update the path
        // D3 uses each data point and passes it to the area function. The area function translates the data into positions on the path in the SVG.
        vis.timePath
            .datum(vis.data)
            .attr("d", vis.area);

        // Update axes
        vis.svg.select(".y-axis").call(vis.yAxis);
        vis.svg.select(".x-axis").call(vis.xAxis);

    }
}

