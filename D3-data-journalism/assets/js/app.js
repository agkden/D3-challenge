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
var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
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
    //console.log(d);
  });


  //===============================
  //  3.  Create the Scatter Plot
  //===============================

  // *** Define Scale ***
  var xScale = d3.scaleLinear()
    .domain([8, 24])
    .range([0, chartWidth]);

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
            .attr("x", chartWidth /2)
            .attr("y", chartMargin.top+chartHeight+10)
            .attr("axis-name", "poverty")
            .text("In Poverty (%)");
  
  
  // *** Append circles ***
  var circlesGroup = chartGroup.selectAll("circle")
            .data(csvData)
            .enter()
            .append("circle")
            .classed("stateCircle", true)
            .attr("r", 10)
            .attr("cx", d => xScale(d.poverty))
            .attr("cy", d => yScale(d.healthcare));

  
  //=================================================
  //  4.  Include state abbreviations in the circles
  //=================================================

  chartGroup.selectAll(".stateText")
            .data(csvData)
            .enter()
            .append("text")
            .classed("stateText", true)            
            .attr("x", d => xScale(d.poverty))
            .attr("y", d => yScale(d.healthcare))
            .text(d => (d.abbr))
            .attr("dy", "0.25rem")
            .attr("font-size", "10px");

  
  //===============================
  //  5.  Add ToolTip
  //===============================

  var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([-8, 0])
    .style("display", "block")
    .html(function(d) { return (`${d.state}<br>Poverty: ${d.poverty}%<br>Healthcare: ${d.healthcare}%`); });

  circlesGroup.call(toolTip)
              .on("mouseover", toolTip.show)
              .on("mouseout", toolTip.hide);

  



}); // close d3
