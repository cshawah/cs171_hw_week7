// Bar chart configurations: data keys and chart titles
let configs = [
    {key: "ownrent", title: "Own or Rent"},
    {key: "electricity", title: "Electricity"},
    {key: "latrine", title: "Latrine"},
    {key: "hohreligion", title: "Religion"}
];


// Initialize variables to save the charts later
let barcharts = [];
let areachart;

let micro_data;

let byOwnRent, byElectricity, byLatrine, byReligion, byDay;

let selectionDomain, selectionRange;


// Date parser to convert strings to date objects
let parseDate = d3.timeParse("%Y-%m-%d");


// (1) Load CSV data
// 	(2) Convert strings to date objects
// 	(3) Create new bar chart objects
// 	(4) Create new area chart object

d3.csv("data/household_characteristics.csv", row => {
    row.survey = parseDate(row.survey);
    return row
}).then(data => {
    micro_data = data;

/*    let byOwnRent = d3.group(micro_data, d => d.ownrent);*/
/*    byOwnRent = Array.from(d3.group(micro_data, d => d.ownrent), ([key, value]) => ({key, value}))
    console.log(byOwnRent);*/

    byOwnRent = d3.rollups(micro_data,v=>v.length,d=>d.ownrent);
    byElectricity = d3.rollups(micro_data,v=>v.length,d=>d.electricity);
    byLatrine = d3.rollups(micro_data,v=>v.length,d=>d.latrine);
    byReligion = d3.rollups(micro_data,v=>v.length,d=>d.hohreligion);

    barcharts[0] = new BarChart("bar_ownrent", byOwnRent, configs[0]);
    barcharts[1] = new BarChart("bar_electricity", byElectricity, configs[1]);
    barcharts[2] = new BarChart("bar_latrine", byLatrine, configs[2]);
    barcharts[3] = new BarChart("bar_religion", byReligion, configs[3]);

    byDay = d3.rollups(micro_data,v=>v.length,d=>d.survey);

    areachart = new AreaChart("area-chart", byDay);

});


// React to 'brushed' event and update all bar charts
function brushed() {

    // * TO-DO *
    // TO-DO: React to 'brushed' event

    // Get the extent of the current brush
    selectionRange = d3.brushSelection(d3.select(".brush").node());

    // Convert the extent into the corresponding domain values
    selectionDomain = selectionRange.map(areachart.x.invert);

    // Update bar charts (detailed information)

    barcharts[0].wrangleData();
    barcharts[1].wrangleData();
    barcharts[2].wrangleData();
    barcharts[3].wrangleData();

}
