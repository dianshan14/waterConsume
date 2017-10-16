var slopemargin = {top: 40, right: 40, bottom: 40, left: 60},
    slopewidth = 500 - slopemargin.left - slopemargin.right,
    slopeheight = 500 - slopemargin.top - slopemargin.bottom;

    // svg 
var slopecont = d3.select("body")
                    .append("svg")
                    .attr('width', "49%")
                    .attr('height', slopeheight + slopemargin.top + slopemargin.bottom)
                    .attr('id', "slopesvg")
                    .append("g")
                    .attr('transform', "translate("+(slopemargin.left+30)+","+slopemargin.top+")")
                    .attr('id', "slopeGroup");

var lineCont =  slopecont.append("g");

function render_slopeDiagram(new_data, highlight_index){

    // if choose new year, 1. initial value 2. change data source
    var total_consumption = 0 , total_population = 0, 
        data_source = new_data;

    // get extra data
    for (var i = 0; i < data_source.length; i++) {
        var ele = data_source[i];
        total_consumption += ele.consumption;
        total_population += ele.population;
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

    // line
    var new_line = lineCont.selectAll("line")
                            .data(data_source);

    new_line.enter()
            .append("line")
            .attr('class', "slope")
            .attr('id', function(d,i){ return "slope"+i; });
            
    new_line.transition()
            .attr('x1', 0+20)
            .attr('y1', function(d){ return popScale(d.population/total_population); })
            .attr('x2', slopewidth-20)
            .attr('y2', function(d){ return conScale(d.consumption/total_consumption); })
            .style('stroke', function(d){ return popScale(d.population/total_population)>conScale(d.consumption/total_consumption)?"red":"#00DD77"})
            .style('stroke-width', "2px")
            .on("end", function(d,i){
                if(i === highlight_index)
                {
                    d3.select(this)
                    .style('stroke-width', "7px");
                }
            });

    new_line.exit().transition().remove();

    // axis
    if(signal == 1)
    {
        $("#slopeAxis").remove();
        slopecont.append("g")
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

        d3.select("#slopesvg")
        .append("text")
        .text("人口佔全國比例")
        .attr('x', 30)
        .attr('y', slopeheight + slopemargin.top + slopemargin.bottom - 10)
        .attr('style', "fill: #5555FF; font-size: 15px");
        
        d3.select("#slopesvg")
        .append("text")
        .text("年用水量佔全國比例")
        .attr('x', 350)
        .attr('y', slopeheight + slopemargin.top + slopemargin.bottom - 10)
        .attr('style', "fill: #5555FF; font-size: 15px");
    }

    d3.selectAll("g#slopeAxis g.tick text")
    .attr('opacity', "0.4");
    slopecont.select("#slopeAxis path.domain")
    .attr('display', "none");
}

render_slopeDiagram(data2016, undefined);

// drop-down menu about "Region"
function slopeReplyRegionMenu(region_index){
    recoverSlope();

    var selectedRegion = d3.select("#drop-down-region").property("value");
    for (var i = 0; i < 22; i++) {
        if(region_list[i] === selectedRegion)
        {
            var slopeId = "#slope"+i;
            break;
        }
    }
    console.log(i);
    d3.selectAll(".slope")
      .each(function(d,index){
          if(index == i){
              d3.select(this)
                .transition()
                .duration(500)
                .style('stroke-width', "7px");
          }
          else if(i<=21 && i>=0){
              console.log("happen");
              d3.select(this)
                .transition()
                .duration(500)
                .attr('opacity', "0.2");
          }
          else
            console.log("correct");
      });
}

function recoverSlope(){
    d3.selectAll(".slope")
        .style('stroke-width', "2px")
        .attr('opacity', "1");
}
