var svgWidth = 960-144;
var svgHeight = 500-75;

var margin = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Retrieve data from the CSV file and execute everything below
d3.csv("assets/data/data.csv").then(function(usData) {
  // if (err) throw err;

  // parse data
  usData.forEach(function(data) {
    data.poverty = parseFloat(data.poverty);
    data.healthcare = parseFloat(data.healthcare);
  });

  // xLinearScale function above csv import
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(usData, d => d.poverty), d3.max(usData, d => d.poverty)])
    .range([0, width]);

  // yLinearScale function above csv import
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(usData, d => d.healthcare), d3.max(usData, d => d.healthcare)])
    .range([height, 0]);

  // Create initial axis functions
  var xAxis = d3.axisBottom(xLinearScale);
  var yAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(xAxis);

  // append y axis
  var yAxis = chartGroup.append("g")
    .call(yAxis);

  // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(usData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", 10)
    .attr("fill", "lightblue")
    .attr("stroke", "white")

var text = circlesGroup.append("g").selectAll("text")
  .data(usData)
  .enter()
  .append("text")
  .attr("cx", function(d) {
    return d.abbr;
  })
  .attr("cy", function(d) {
    return d.abbr;
  })
  .attr("font-size","10px");

    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "aText")
      .text("Lacks Healthcare (%)");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "aText")
      .text("In Poverty (%)");
  }).catch(function(error) {
    console.log(error);
  });