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








//===============================
//  3.  Create the Scatter Plot
//===============================




