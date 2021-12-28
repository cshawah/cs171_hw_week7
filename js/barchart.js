

/*
 * BarChart - Object constructor function
 * @param _parentElement 	-- the HTML element in which to draw the bar charts
 * @param _data						-- the dataset 'household characteristics'
 * @param _config					-- variable from the dataset (e.g. 'electricity') and title for each bar chart
 */


function sortBars(a, b) {
	return b[1] - a[1];
}

class BarChart {

	constructor(parentElement, data, config) {
		this.parentElement = parentElement;
		this.data = data.sort(sortBars);
		/*this.data = data;*/
		this.config = config;
		this.displayData = data;

		this.initVis();
	}


	/*
	 * Initialize visualization (static content; e.g. SVG area, axes)
	 */

	initVis() {
		let vis = this;

		// * TO-DO *
		vis.margin = {top: 20, right: 100, bottom: 10, left: 50};

		vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
		vis.height = 100 - vis.margin.top - vis.margin.bottom;

		vis.svg = d3.select("#" + vis.parentElement).append("svg")
			.attr("width", vis.width + vis.margin.left + vis.margin.right)
			.attr("height", vis.height + vis.margin.top + vis.margin.bottom)
			.append("g")
			.attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

		vis.svg.append("text")
			.attr("class", "bargraph-title")
			.text(vis.config.title)

		vis.x = d3.scaleBand()
			.rangeRound([0, vis.height])
			.domain(vis.data.map(d => d[0]))
			.paddingInner(0.3);

		vis.y = d3.scaleLinear()
			.domain([0, d3.max(vis.data, function (d) {return d[1]})])
			.range([0,vis.width-200]);

		vis.xAxis = d3.axisLeft()
			.scale(vis.x);

		vis.xAxisGroup = vis.svg.append("g")
			.attr("class", "x-axis axis")
			.attr("transform", "translate(150,0)");

		vis.rect = vis.svg.selectAll("rect")
			.data(vis.data);

		vis.rect.enter()
			.append("rect")

			// Enter and Update (set the dynamic properties of the elements)
			.merge(vis.rect)
			.attr("class", "bar")
			.attr("stroke", "none")
			.attr("x", 150)
			.attr("y", (d) => vis.x(d[0]))
			.attr("height", vis.x.bandwidth())
			.attr("width", (d) => vis.y(d[1]));

		vis.labs = vis.svg.selectAll("text.barlabs")
			.data(vis.data);

		vis.labs.enter()
			.append("text")
			.merge(vis.labs)
			.attr("class", "barlabs")
			.attr("stroke", "black")
			.attr("y", (d,i) => vis.x(d[0])+10)
			.attr("x", (d,i) => 160 + vis.y(d[1]))
			.text((d,i) => d[1]);

		vis.svg.select(".x-axis")
			.call(vis.xAxis);

		// (Filter, aggregate, modify data)
		/*vis.wrangleData();*/
	}




	/*
	 * Data wrangling
	 */

	wrangleData() {
		let vis = this;

		// (1) Group data by key variable (e.g. 'electricity') and count leaves
		// (2) Sort columns descending


		function filterDate(d) {
			return d.survey >= selectionDomain[0] && d.survey <= selectionDomain[1]
		}

		vis.displayData = d3.rollups(micro_data.filter(filterDate),v=>v.length,d=>d[vis.config.key]);
		vis.displayData = vis.displayData.sort(sortBars);

		// * TO-DO *
		// Update the visualization
		vis.updateVis();
	}



	/*
	 * The drawing function - should use the D3 update sequence (enter, update, exit)
	 */

	updateVis() {
		let vis = this;

		console.log("should be changing!")

		vis.y.domain([0, d3.max(vis.displayData, function (d) {return d[1]})]);
		vis.x.domain(vis.displayData.map(d => d[0]));

		let bars = vis.svg.selectAll("rect.bar")
			.data(vis.displayData);

		bars.enter()
			.append("rect")
			.merge(bars)
			.attr("class", "bar")
			.transition()
			.delay(25)
			.duration(200)
			.attr("stroke", "none")
			.attr("x", 150)
			.attr("y", (d) => vis.x(d[0]))
			.attr("height", vis.x.bandwidth())
			.attr("width", (d) => vis.y(d[1]))
			.style("opacity", 1);

		let labs = vis.svg.selectAll("text.barlabs")
			.data(vis.displayData);

		labs.enter()
			.append("text")
			.merge(labs)
			.attr("class", "barlabs")
			.attr("y", (d) => vis.x(d[0])+10)
			.attr("x", (d) => 160 + vis.y(d[1]))
			.style("opacity", 0)
			.transition()
			.delay(50)
			.duration(200)
			.style("opacity", 1)
			.attr("stroke", "black")
			.text((d) => d[1]);

		labs.exit().remove();

		vis.svg.select(".x-axis")
			.transition()
			.duration(100)
			.call(vis.xAxis);

		console.log(vis.displayData);

	}


	// selectionChanged(selectionDomain) {
	// 	let vis = this;
	//
	// 	// Update bar charts (detailed information)
	// 	barcharts.wrangleData();
	// }
}
