//===============================
//  1.  Set up Charted Area
//===============================

// define svg area dimensions
var svgWidth = 800;
var svgHeight = 500;

// define the chart's margins
var chartMargin = {
  top: 30,
  right: 30,
  bottom: 50,
  left: 50
};

// define the chart's dimensions
var chartWight = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

// create svg container
var svg = d3.select("#scatter")
            .append("svg")
            .attr("width", svgWidth)
            .attr("height", svgHeight);

// append a group to the SVG area and shift everything over by the margins
var chartGroup = svg.append("g")
  .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);


//===============================
//  2.  Read the data
//===============================

// load data from csv file by using d3.csv() function
d3.csv("assets/data/data.csv").then((csvData) => {
  console.log(csvData);

  // convert string values to number format
  csvData.forEach(d => {
    d.poverty = +d.poverty;
    d.healthcare = +d.healthcare;
    console.log(d);
  });


  //===============================
  //  3.  Create the Scatter Plot
  //===============================

  // *** Define Scale ***
  var xScale = d3.scaleLinear()
    .domain([8, 24])
    .range([0, chartWight]);

  var yScale = d3.scaleLinear()
    .domain([4, 26])
    .range([chartHeight, 0]);

  
  // *** Create Axes ***
  var xAxis = d3.axisBottom(xScale); // the ticks oriented on the bottom
  var yAxis = d3.axisLeft(yScale); // the ticks oriented on the left

  // append Y axis to the chart area
  chartGroup.append("g")
            .attr("class", "axis")
            .call(yAxis);

  // create Y axis title  
  chartGroup.append("text")
            .classed("aText", true)
            .attr("transform", "rotate(-90)")
            .attr("x", -(chartHeight-chartMargin.top) /2)
            .attr("y", -chartMargin.left /1.5)
            .attr("axis-name", "healthcare")
            .text("Lacks Healthcare (%)");
  

  // set X axis to the bottom of the chart
  chartGroup.append("g")
            .attr("class", "axis")
            .attr("transform", `translate(0, ${chartHeight})`)
            .call(xAxis);  

  // create X axis title 
  chartGroup.append("text")
            .classed("aText", true)
            .attr("x", chartWight /2)
            .attr("y", chartMargin.top+chartHeight+10)
            .attr("axis-name", "poverty")
            .text("In Poverty (%)");
  
  







}); // close d3
