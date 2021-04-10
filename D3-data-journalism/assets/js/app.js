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
  bottom: 80,
  left: 100
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


//++++++++++++++++++++++++++++++++++++++
// *** Bonus Part - Multiple Axes ***
//++++++++++++++++++++++++++++++++++++++

// Initial Params for X and Y axes
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";

//----------------------------------------
// *** Functions to Update Axes Scale ***
//----------------------------------------

// function used for updating x-scale var upon click on axis label
function xScale(csvData, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
      .domain([d3.min(csvData, d => d[chosenXAxis]) * 0.9, d3.max(csvData, d => d[chosenXAxis]) * 1.1])
      .range([0, chartWidth]);

  console.log(d3.min(csvData, d => d[chosenXAxis]));

  return xLinearScale;
}

// function used for updating y-scale var upon click on axis label
function yScale(csvData, chosenYAxis) {
  // create scales
  var yLinearScale = d3.scaleLinear()
      .domain([d3.min(csvData, d => d[chosenYAxis]) * 0.8, d3.max(csvData, d => d[chosenYAxis]) * 1.1])
      .range([chartHeight, 0]);

  return yLinearScale;
}

//--------------------------------------
// *** Functions to Update Axes ***
//--------------------------------------

// function used for updating xAxis var upon click on axis label
function renderXAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);    

  xAxis.transition()
        .duration(1000)
        .call(bottomAxis);    
  
  return xAxis;
}

// function used for updating yAxis var upon click on axis label
function renderYAxes(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
        .duration(1000)
        .call(leftAxis);
  
  return yAxis;
}

//-------------------------------------
// *** Functions to Update circles ***
//-------------------------------------

// function used for updating circles group with a transition to new circles  
function renderCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

  circlesGroup.transition()
              .duration(1000)
              .attr("cx", d => newXScale(d[chosenXAxis]))
              .attr("cy", d => newYScale(d[chosenYAxis]));

  return circlesGroup;
}

//------------------------------------
// *** Function to Update Text ***
//------------------------------------

// function used for updating state abbreviations
function renderStateText(stateText, newXScale, chosenXAxis, newYScale, chosenYAxis) {

  stateText.transition()
            .duration(1000)
            .attr("x", d => newXScale(d[chosenXAxis]))
            .attr("y", d => newYScale(d[chosenYAxis]));

  return stateText;
}


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
    d.age = +d.age;
    d.income = +d.income;
    d.obesity = +d.obesity;
    d.smokes = +d.smokes;
    //console.log(d);
  });


  //===============================
  //  3.  Create the Scatter Plot
  //===============================

    // // *** Define Scale ***
    // var xScale = d3.scaleLinear()
    //   .domain([8, 24])
    //   .range([0, chartWidth]);

    // var yScale = d3.scaleLinear()
    //   .domain([4, 26])
    //   .range([chartHeight, 0]);

  //--------------------
  //  Setup Scale
  //--------------------

  var xLinearScale = xScale(csvData, chosenXAxis);
  var yLinearScale = yScale(csvData, chosenYAxis);
  
    // // *** Create Axes ***
    // var xAxis = d3.axisBottom(xScale); // the ticks oriented on the bottom
    // var yAxis = d3.axisLeft(yScale); // the ticks oriented on the left

  //---------------------
  //  Setup Initial Axes
  //---------------------

  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  //-------------------
  //  Append Axes
  //-------------------

  // append Y axis to the chart area
  var yAxis = chartGroup.append("g")
            .attr("class", "axis")
            .call(leftAxis); 

  // set X axis to the bottom of the chart
  var xAxis = chartGroup.append("g")
            .attr("class", "axis")
            .attr("transform", `translate(0, ${chartHeight})`)
            .call(bottomAxis);    

  //-------------------
  //  Label Axes
  //-------------------

  // create group of X-axis titles
  var xLabelGroup = chartGroup.append("g")
    .classed("aText", true)
    .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + 20})`);    

  var povertyTitle = xLabelGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty")
    .classed("active", true)
    .text("In Poverty (%)");

  var ageTitle = xLabelGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "age")
    .classed("inactive", true)
    .text("Age (Median)");

  var incomeTitle = xLabelGroup.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "income")
    .classed("inactive", true)
    .text("Household Income (Median)");


  // Create group for Y-axis titles
  var yLabelGroup = chartGroup.append("g")
    .classed("aText", true)    
    .attr("transform", `translate(${0-chartMargin.left}, ${chartHeight /2})`);

  var healthcareTitle = yLabelGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "healthcare")
    .classed("active", true)
    .text("Lacks Healthcare (%)");

  var smokesTitle = yLabelGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "smokes")
    .classed("inactive", true)
    .text("Smokes (%)");

  var obesityTitle = yLabelGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "obesity")
    .classed("inactive", true)
    .text("Obese (%)");
  
  
  //-------------------
  //  Append Circles   
  //-------------------
  var circlesGroup = chartGroup.selectAll("circle")
            .data(csvData)
            .enter()
            .append("circle")
            .classed("stateCircle", true)
            .attr("r", 10)
            .attr("cx", d => xLinearScale(d[chosenXAxis]))
            .attr("cy", d => yLinearScale(d[chosenYAxis]));

  
  //=================================================
  //  4.  Include state abbreviations in the circles
  //=================================================

  var stateText = chartGroup.selectAll(".stateText")
             .data(csvData)
            .enter()
            .append("text")
            .classed("stateText", true)            
            .attr("x", d => xLinearScale(d[chosenXAxis]))
            .attr("y", d => yLinearScale(d[chosenYAxis]))
            .text(d => d.abbr)
            .attr("dy", "0.25rem")
            .attr("font-size", "10px");

  
  //===============================
  //  5.  Add ToolTip
  //===============================

  // var toolTip = d3.tip()
  //   .attr("class", "d3-tip")
  //   .offset([-8, 0])
  //   .style("display", "block")
  //   .html(function(d) { return (`${d.state}<br>Poverty: ${d.poverty}%<br>Healthcare: ${d.healthcare}%`); });

  // circlesGroup.call(toolTip)
  //             .on("mouseover", toolTip.show)
  //             .on("mouseout", toolTip.hide);


  //===================================
  //  Create Axes Labels event Listener
  //===================================  
   
  // X-axis event listener
  xLabelGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenXAxis) {

        // replaces chosenXAxis with value
        chosenXAxis = value;        
         
        // updates x scale for new data
        xLinearScale = xScale(csvData, chosenXAxis);

        // updates x axis with transition
        xAxis = renderXAxes(xLinearScale, xAxis);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
        
        // update state abbreviation text with new x and y values
        stateText = renderStateText(stateText, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

        // changes classes to change bold text - X-axis
        if (chosenXAxis === "age") {            
          ageTitle
            .classed("active", true) 
            .classed("inactive", false);
          povertyTitle
            .classed("active", false)
            .classed("inactive", true);
          incomeTitle
            .classed("active", false)
            .classed("inactive", true);
        }
        else if (chosenXAxis === "income") {           
          incomeTitle
            .classed("active", true)
            .classed("inactive", false);
          povertyTitle
            .classed("active", false)
            .classed("inactive", true);
          ageTitle
            .classed("active", false)
            .classed("inactive", true);
        }
        else {           
          povertyTitle
            .classed("active", true)
            .classed("inactive", false);
          ageTitle
            .classed("active", false)
            .classed("inactive", true);
          incomeTitle
            .classed("active", false)
            .classed("inactive", true);          
        }
      }
    }); // close .on()

  // Y-axis event listener
  yLabelGroup.selectAll("text")
  .on("click", function() {
    // get value of selection
    var value = d3.select(this).attr("value");
    if (value !== chosenYAxis) {

      // replaces chosenYAxis with value
      chosenYAxis = value;      
        
      // updates y scale for new data
      yLinearScale = yScale(csvData, chosenYAxis);

      // updates y axis with transition
      yAxis = renderYAxes(yLinearScale, yAxis);

      // updates circles with new y values
      circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
      
      // update state abbreviation text with new x and y values
      stateText = renderStateText(stateText, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
      
      // changes classes to change bold text - Y-axis
      if (chosenYAxis === "smokes") {          
        smokesTitle
          .classed("active", true)
          .classed("inactive", false);
        healthcareTitle
          .classed("active", false)
          .classed("inactive", true);
        obesityTitle
          .classed("active", false)
          .classed("inactive", true);
      }
      else if (chosenYAxis === "obesity") {          
        obesityTitle
          .classed("active", true)
          .classed("inactive", false);
        healthcareTitle
          .classed("active", false)
          .classed("inactive", true);
        smokesTitle
          .classed("active", false)
          .classed("inactive", true);
      }
      else {          
        healthcareTitle
          .classed("active", true)
          .classed("inactive", false);
        smokesTitle
          .classed("active", false)
          .classed("inactive", true);
        obesityTitle
          .classed("active", false)
          .classed("inactive", true);          
      }
    }
  }); // close .on()

  



}); // close d3