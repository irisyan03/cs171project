/* * * * * * * * * * * * * *
*      class BubbleChart        *
* * * * * * * * * * * * * */

class BubbleChart {

    constructor(parentElement, userData) {
        this.parentElement = parentElement;
        this.userData = userData;
        this.initVis();
    }

    initVis() {
        let vis = this;

        vis.margin = {top: 10, right: 20, bottom: 50, left: 40};
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

        // init drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append('g')
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`);

        // scales
        vis.scale = d3.scaleLinear()
            .range([0, vis.width / 15 - 15])

        vis.colorScale = d3.scaleLinear()
            .domain([0, 1]);

        // append tooltip
        vis.tooltip = d3.select("body").append('div')
            .attr('class', "tooltip")
            .attr('id', 'bubbleTooltip')

        this.wrangleData();
    }

    wrangleData() {
        let vis = this;

        vis.filteredData = [];
        vis.select = selected;

        // filter for data in specific decade
        vis.userData.forEach(function (d) {
            vis.filteredData.push(d[vis.select])
        })

        vis.updateVis()
    }

    updateVis() {
        let vis = this;

        // draw bubbles
        let circles = vis.svg.selectAll("circle")

        circles.data(vis.filteredData)
            .join("circle")
            .attr("class", "circle")
            .attr("r", (d, i) => vis.scaler(d, i, vis.scale, vis.userData))
            .attr("cx", (d, i) => (i % 3) * vis.width / 4 + vis.width / 4)
            .attr("cy", (d, i) => vis.height / 4 - 30 + Math.floor(i / 3) * vis.height / 3)
            .style("fill", function () {
                return d3.interpolateViridis(vis.colorScale((d3.select(this).attr("r")) / (vis.width / 15 - 15)))
            })

        // draw labels
        vis.svg
            .selectAll('bubble-label')
            .data(vis.filteredData)
            .enter()
            .append('text')
            .text((d, i) => vis.label(i, vis.userData))
            .attr('class', 'bubble-label')
            .attr("x", (d, i) => (i % 3) * vis.width / 4 + vis.width / 4)
            .attr("y", (d, i) => (1 + Math.floor(i / 3)) * vis.height / 3 + vis.height / 30)
            .style("fill", "black")
            .attr('text-anchor', 'middle');

        // tooltip for hovering over bubbles
        let tooltipArea = vis.svg.selectAll(".tooltipArea")

        tooltipArea.data(vis.userData, d => d)
            .join("circle")
            .attr("class", "tooltipArea")
            .attr("r", (d, i) => vis.scaler(d[vis.select], i, vis.scale, vis.userData))
            .attr("cx", (d, i) => (i % 3) * vis.width / 4 + vis.width / 4)
            .attr("cy", (d, i) => vis.height / 4 - 30 + Math.floor(i / 3) * vis.height / 3)
            .on('mouseover', function (event, d) {
                d3.select(this)
                    .attr("class", "tooltip")
                vis.tooltip
                    .style("opacity", 1)
                    .style("left", event.pageX + 20 + "px")
                    .style("top", event.pageY + "px")
                    .html(`
                     <div class="tooltip-background">
                        <h3>Average ${d["property"]}: ${vis.roundDecimal(d[vis.select])}<h3>           
                        <h3>${d["property"]} is ${d["description"]}<h3>              
                     </div>`);
            })
            .on('mouseout', function (event, d) {
                d3.select(this)
                vis.tooltip
                    .style("opacity", 0)
                    .style("left", 0)
                    .style("top", 0)
                    .html(``);
            });
    }

    // helper functions
    scaler(val, ind, scale, data) {
        scale.domain([data[ind]["min"], data[ind]["max"]]);
        return scale(val);
    }

    label(ind, data) {
        return data[ind]["property"];
    }

    roundDecimal(num) {
        return `${parseFloat(num).toFixed(4)}`;
    }
}