var pie = d3.arc();
var da = pie({
    startAngle: 0,
    endAngle: 1 * Math.PI,
    innerRadius: 0,
    outerRadius: 100
  });
d3.select('body')
  .append("svg")
  .attr('width', "700")
  .attr('height', "500")
  .append("g")
  .attr('transform', "translate(300,110)")
  .append("path")
  .attr('d', da)
  .attr('fill', "black")
  .on("mouseenter", function(d,i){
      d3.select(this)
        .transition()
        .delay(1000)
        .duration(3000)
        .attr('transform', "rotate(180)");
  });