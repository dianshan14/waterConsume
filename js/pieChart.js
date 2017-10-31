var pie = d3.arc();
var pieAttr = pie.innerRadius(0)
                 .outerRadius(200)
                 .cornerRadius(3)
                 .padAngle(0.005);
// data

var cont = d3.select('body')
             .append("svg")
             .attr('width', "50%")
             .attr('height', "450")
             .append("g")
             .attr('transform', "translate(330,220)")
             .attr('id', "pieChartGroup")
             .attr('opacity', "1");

var signal = 0;

// pie
var pieData = [];
function updatePieChart(new_data, highlight_index){

    // if choose new year, 1. initial value 2. change data source
    var total_consumption = 0 , total_population = 0, 
    data_source = new_data;
    pieData = [];

    // get extra data
    for (var i = 0; i < data_source.length; i++) {
    var ele = data_source[i];
    total_consumption += ele.consumption;
    total_population += ele.population;
    }

    // get the pie chart data
    var doublePi = 2*Math.PI;
    for (var j = 0; j < data_source.length; j++) {
    var elem = data_source[j];
    pieData.push({  label: elem.region, 
                    startAngle: (j===0)?0:pieData[j-1].endAngle, 
                    endAngle: (j===(data_source.length-1))?doublePi:(j===0)?doublePi*(elem.consumption/total_consumption):doublePi*(elem.consumption/total_consumption)+pieData[j-1].endAngle
                })
    }

    var pieId = "#pie"+highlight_index,
    pieTextId = "#pietext"+highlight_index;

    // draw pie
    var new_pie = cont.selectAll(".pieGroup") //g tag
                      .data(pieData);
    
    new_pie.enter()
           .append("path")
           .attr('id', function(d,i){ return "pie"+i; })
           .attr('class', "pieGroup");
           
    new_pie.transition()
           .attr('d', pieAttr)
           .attr('fill', "gray")
           .attr('stroke', "initial")
           .on("end", function(d,i){
                if(i === highlight_index)
                {
                    d3.select(pieId)
                    .attr('stroke', "blue")
                    .attr('stroke-width', "3px");
                }
            });

    new_pie.exit().transition().remove();

    var new_text = cont.selectAll(".textGroup")
                       .data(pieData);
    
    new_text.enter()
            .append("text")
            .attr('id', function(d,i){ return "pietext"+i; })
            .attr('class', "textGroup");

    new_text.transition()
            .attr('x', function(d){ return pieAttr.centroid(d)[0]; })
            .attr('y', function(d){ return pieAttr.centroid(d)[1]; })
            .attr('dx', "-18px")
            .style('fill', "black")
            .style('font-size', "12px")
            .style('z-index', "1")
            .text(function(d,i){
                return (pieData[i].endAngle-pieData[i].startAngle)<0.5?"":d.label;
            })
            .on("end", function(d,i){
                if(i === highlight_index)
                {
                    d3.select(pieTextId)
                    .style('fill', "red")
                    .attr('dx', function(d){ return (highlight_index>=8&&highlight_index<=10)?"10px":(highlight_index>=12&&highlight_index<=16)?"-20px":(highlight_index==19)?"-25px":d3.select(this).attr('dx');})
                    .attr('dy', function(d){ return (highlight_index>=0&&highlight_index<=5)?"-15px":(highlight_index>=8&&highlight_index<=10)?"15px":(highlight_index>=12&&highlight_index<=16)?"20px":(highlight_index==19||highlight_index==21)?"-25px":d3.select(this).attr('dy');})
                    .text(region_list[highlight_index]);
                }
            });
    
    new_text.exit().transition().remove();
}

updatePieChart(data2016,undefined);

d3.select("#drop-down-year")
  .on("change", function(){
    signal = 1;
    var selectedRegion = d3.select("#drop-down-region").property("value");
    for (var i = 0; i < 22; i++) {
        if(region_list[i] === selectedRegion)
        {
            break;
        }
    }
    var new_data_source = eval(d3.select("#drop-down-year").property("value"));
    updatePieChart(new_data_source, i);
    render_slopeDiagram(new_data_source, i);
  });

// event handler
d3.selectAll(".pieGroup, .textGroup")
.on("mouseenter", function(d,i){
    // .on function will pass event object (i) at parameter
    recoverPie();
    console.log("look me:::::::::::", i);
    i = (i>21)?(i-22):i;
    var pieId = "#pie"+i,
        pieTextId = "#pietext"+i;
    d3.select(pieTextId)
    .style('fill', "red")
    .attr('dx', function(d){ return (i>=8&&i<=10)?"10px":(i>=12&&i<=16)?"-20px":(i==19)?"-25px":d3.select(this).attr('dx');})
    .attr('dy', function(d){ return (i>=0&&i<=5)?"-15px":(i>=8&&i<=10)?"15px":(i>=12&&i<=16)?"20px":(i==19||i==21)?"-25px":d3.select(this).attr('dy');})
    .text(region_list[i]);

    d3.select(pieId)
    .attr('stroke', "blue")
    .attr('stroke-width', "3px");

    recoverSlope();
    highlightASlope(i);

    recoverCircle();
    highlightTwoCircle(i);
})
.on("mouseout", function(d,i){

    //remind: replace original recovery method with recoverPie()
    recoverPie();
    recoverSlope();
    recoverCircle();
/*     i = (i>21)?(i-22):i;
    var pieId = "#pie"+i,
        pieTextId = "#pietext"+i;
    console.log("out:   "+i);
    d3.select(pieTextId)
    .style('fill', "black")
    .text((pieData[i].endAngle-pieData[i].startAngle)>0.5? region_list[i]:"");
 
    d3.select(pieId)
    .transition()
    .attr('stroke', "none"); */

    // back to reply region manu 
    var selectedRegion = d3.select("#drop-down-region").property("value");
    if(selectedRegion != "---"){
        for (var recover_index = 0; recover_index < 22; recover_index++) {
            if(region_list[recover_index] === selectedRegion)
            {
                var pieId = "#pie"+recover_index,
                    pieTextId = "#pietext"+recover_index;
                break;
            }
        }
        d3.select(pieId)
        .attr('stroke', "blue")
        .attr('stroke-width', "3px");

        d3.select(pieTextId)
        .style('fill', "red")
        .attr('dx', function(d){ return (recover_index>=8&&recover_index<=10)?"10px":(recover_index>=12&&recover_index<=16)?"-20px":(recover_index==19)?"-25px":d3.select(this).attr('dx');})
        .attr('dy', function(d){ return (recover_index>=0&&recover_index<=5)?"-15px":(recover_index>=8&&recover_index<=10)?"15px":(recover_index>=12&&recover_index<=16)?"20px":(recover_index==19||recover_index==21)?"-25px":d3.select(this).attr('dy');})
        .text(region_list[recover_index]);
        console.log("recover:   "+recover_index);

        highlightASlope(recover_index);
        highlightTwoCircle(recover_index);
    }
});

d3.select("#drop-down-region")
.on("change", function(){
    if(signal == 1)
    {
        recoverPie();
        var selectedRegion = d3.select("#drop-down-region").property("value");
        if(selectedRegion != "---"){
            for (var i = 0; i < 22; i++) {
                if(region_list[i] === selectedRegion)
                {
                    var pieId = "#pie"+i,
                    pieTextId = "#pietext"+i;
                    break;
                }
            }

            d3.select(pieTextId)
            .style('fill', "red")
            .attr('dx', function(d){ return (i>=8&&i<=10)?"10px":(i>=12&&i<=16)?"-20px":(i==19)?"-25px":d3.select(this).attr('dx');})
            .attr('dy', function(d){ return (i>=0&&i<=5)?"-15px":(i>=8&&i<=10)?"15px":(i>=12&&i<=16)?"20px":(i==19||i==21)?"-25px":d3.select(this).attr('dy');})
            .text(region_list[i]);

            d3.select(pieId)
            .attr('stroke', "blue")
            .attr('stroke-width', "3px");
        } 
        // call slope update
        slopeReplyRegionMenu(i); // this update function will check region menu value whether is "---"
    }
});

function recoverPie(){
    d3.selectAll(".textGroup")
    .style('fill', "black")
    .each(function(d,i){
        if(i==6||i==7||i==11||i==17||i==18||i==20)
            d3.select(this).text(region_list[i]);
        else
            d3.select(this).text("");
    });
    
    d3.selectAll(".pieGroup")
    .attr('stroke', "none");
}

