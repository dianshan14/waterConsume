var slopemargin = {top: 40, right: 40, bottom: 40, left: 60},
    slopewidth = 500 - slopemargin.left - slopemargin.right,
    slopeheight = 600 - slopemargin.top - slopemargin.bottom;

// if choose new year, 1. initial value 2. change data source
var total_consumption = 0 , total_population = 0, total_region = [], 
    data_source = data2016;

// get extra data
for (var i = 0; i < data_source.length; i++) {
    var ele = data_source[i];
    total_consumption += ele.consumption;
    total_population += ele.population;
    total_region.push(ele.region);
}

// set scale
var conScale = d3.scaleLinear()
                 .domain([d3.min(data_source, function(d){ return d.consumption/total_consumption; }),
                          d3.max(data_source, function(d){ return d.consumption/total_consumption; })
                ])
                 .range([slopeheight, 0]),
    popScale = d3.scaleLinear()
                 .domain([d3.min(data_source, function(d){ return d.population/total_population; }),
                          d3.max(data_source, function(d){ return d.population/total_population; })
                ])
                 .range([slopeheight, 0]);
    
// svg 
var svg = d3.select("body")
            .append("svg")
            .attr('width', slopewidth + slopemargin.left + slopemargin.right)
            .attr('height', slopeheight + slopemargin.top + slopemargin.bottom)
            .append("g")
            .attr('transform', "translate("+slopemargin.left+","+slopemargin.top+")")
            .attr('id', "slopesvg");

// line
svg.append("g")
   .selectAll("line")
   .data(data_source)
   .enter()
   .append("line")
   .attr('x1', $("#slopesvg").offset().left-slopemargin.left)
   .attr('y1', function(d){ return popScale(d.population/total_population); })
   .attr('x2', $("#slopesvg").offset().left+slopewidth*4.0/5+10)
   .attr('y2', function(d){ return conScale(d.consumption/total_consumption); })
   .style('stroke', function(d){ return popScale(d.population/total_population)>conScale(d.consumption/total_consumption)?"red":"#00DD77"})
   .style('stroke-width', "2px")
   .attr('class', "slope");

// axis
svg.append("g")
   .style('stroke-dasharray', "30, 20")
   .style('stroke-width', "4px")
   .attr('id', "slopeAxis")
   .call(d3.axisLeft(d3.max(data_source, function(d){ return d.consumption/total_consumption;})>d3.max(data_source, function(d){ return d.population/total_population;})?conScale:popScale)
           .tickFormat(function(d){ return d*100 + "%"; })
           .tickSize(-(slopewidth+10),0)
           .ticks(7)
           .tickValues(d3.range(0, 25/100, 4/100))
    )
    .selectAll("g.tick line")
    .attr('opacity', "0.1");
d3.selectAll("g#slopeAxis g.tick text")
  .attr('opacity', "0.4");
svg.select("#slopeAxis path.domain")
   .attr('display', "none");

d3.select("svg")
  .append("text")
  .text("population rate")
  .attr('x', 40)
  .attr('y', slopeheight + slopemargin.top + slopemargin.bottom - 10)
  .attr('style', "fill: #5555FF; font-size: 15px");

d3.select("svg")
  .append("text")
  .text("consumption rate")
  .attr('x', 380)
  .attr('y', slopeheight + slopemargin.top + slopemargin.bottom - 10)
  .attr('style', "fill: #5555FF; font-size: 15px");