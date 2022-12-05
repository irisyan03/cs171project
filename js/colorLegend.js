/* * * * * * * * * * * * * *
*      class ColorLegend        *
* * * * * * * * * * * * * */


class ColorLegend {

    constructor(parentElement, title, lower, upper, halfColors=false) {
        this.parentElement = parentElement;
        this.title = title;
        this.lower = lower;
        this.upper = upper;
        this.halfColors = halfColors;

        this.initVis();
    }

    initVis(){
        let vis = this;

        vis.margin = {top: 0, right: 10, bottom: 0, left: 10};
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

        vis.colorScale = d3.scaleLinear()
            .domain([0,1]);

        let svg = d3.select(`#${vis.parentElement}`).append("svg").attr("width", 325).attr("height",80)

        // creates ten circles to show color scale
        let data = [.1,.2,.3,.4,.5,.6,.7,.8,.9,1]
        data = data.map(v => 1*v)

        svg.selectAll(".firstrow")
            .data(data).enter()
            .append("circle")
            .attr("cx", function(d,i){return 25 + i*30})
            .attr("cy", 30)
            .attr("r", 10)
            .attr("fill", function(d){return d3.interpolateViridis(vis.colorScale(vis.halfColors ? d/2 : d))})

        // legend title (attribute color scale represents)
        svg.append("text")
            .attr("dx", 25)
            .attr("dy", 10)
            .text(vis.title);

        // left label
        svg.append("text")
            .attr("dx", 25)
            .attr("dy", 60)
            .text(vis.lower)
            .attr("text-anchor", "middle");

        // right label
        svg.append("text")
            .attr("dx", 295)
            .attr("dy", 60)
            .text(vis.upper)
            .attr("text-anchor", "middle");
    }
}