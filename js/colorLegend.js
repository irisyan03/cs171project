/* * * * * * * * * * * * * *
*      class ColorLegend        *
* * * * * * * * * * * * * */


class ColorLegend {

    constructor(parentElement, title) {
        this.parentElement = parentElement;
        this.title = title;

        this.initVis();
    }

    initVis(){
        let vis = this;

        vis.margin = {top: 0, right: 10, bottom: 0, left: 10};
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

        vis.colorScale = d3.scaleLinear()
            .domain([0,1]);

        // create svg element
        var svg = d3.select(`#${vis.parentElement}`).append("svg").attr("width", 1000).attr("height",80)

        // Create data
        var data = [.1,.2,.3,.4,.5,.6,.7,.8,.9,1]
        data = data.map(v => 1*v)

        let row = svg.selectAll(".firstrow").data(data).enter().append("circle").attr("cx", function(d,i){return 15 + i*30}).attr("cy", 30).attr("r", 10).attr("fill", function(d){return d3.interpolateViridis(vis.colorScale(d)) })

        svg.append("text")
            .attr("dx", 10)
            .attr("dy", 10)
            .text(vis.title);

        svg.append("text")
            .attr("dx", 10)
            .attr("dy", 60)
            .text(0);

        svg.append("text")
            .attr("dx", 285)
            .attr("dy", 60)
            .text(1);
    }
}