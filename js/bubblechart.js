/* * * * * * * * * * * * * *
*      class BubbleChart        *
* * * * * * * * * * * * * */


class BubbleChart {

    constructor(parentElement, userData) {
        this.parentElement = parentElement;
        this.userData = userData;
        this.initVis();
    }

    initVis(){
        let vis = this;

        vis.margin = {top: 20, right: 20, bottom: 20, left: 40};
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

        // init drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append('g')
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`);

        // add title
        vis.svg.append('g')
            .append('text')
            .text('Variation in Musical Attributes Over Time')
            .attr('class', 'chart-title')
            .attr('transform', `translate(${vis.width / 2}, 10)`)
            .attr('text-anchor', 'middle');

        // Scales and axes
        vis.scale = d3.scaleLinear()
            .range([0, vis.width/15 - 15])

        // append tooltip
        vis.tooltip = d3.select("body").append('div')
            .attr('class', "tooltip")
            .attr('id', 'bubbleTooltip')

        console.log("in init vis")
        this.wrangleData();
    }

    wrangleData(){
        let vis = this;
        // todo: program this to take value from select drop down
        vis.select = "1960";

        vis.filteredData=  [];
        vis.userData.forEach(function(d) {
            vis.filteredData.push(d[vis.select])
        })
        console.log("filtered data here")
        console.log(vis.filteredData);
        // vis.min = d3.min(vis)

        vis.updateVis()

    }

    scaler(val, ind, scale, data){
        // console.log(val)

        // data.forEach(function(d) {
        //     if (d["property"] === attr) {
        //         console.log("found")
        //         scale.domain([d["min"], d["max"]])
        //     }
        // })
        scale.domain([data[ind]["min"], data[ind]["max"]]);

        // console.log(scale(val));

        return scale(val);
    }

    label(ind, data) {
        return data[ind]["property"];
    }

    updateVis(){
        let vis = this;

        vis.scale.domain([])

        // draw points
        let circles = vis.svg.selectAll("circle")

        circles.data(vis.filteredData)
            .join("circle")
            .attr("class", "circle")
            .attr("r", (d, i) => vis.scaler(d, i, vis.scale, vis.userData))
            // consider abstracting these out/making them more robust
            .attr("cx", (d, i) => (i % 3) * vis.width/3 + vis.width/6)
            .attr("cy", (d, i) => vis.height / 4 - 30 + Math.floor(i / 3) * vis.height / 3)

        vis.svg
            .selectAll('bubble-label')
            .data(vis.filteredData)
            .enter()
            .append('text')
            .text((d, i) => vis.label(i, vis.userData))
            .attr('class', 'bubble-label')
            // consider abstracting these out/making them more robust
            .attr("x", (d, i) => (i % 3) * vis.width/3 + vis.width/6)
            .attr("y", (d, i) => 170 + Math.floor(i / 3) * vis.height / 3)
            .style("fill", "black")
            // .attr('transform', `translate(${vis.width/5}, ${vis.height/5})`)
            .attr('text-anchor', 'middle');

        let tooltipArea = vis.svg.selectAll(".tooltipArea")

        tooltipArea.data(vis.userData, d=>d)
            .join("circle")
            .attr("class", "tooltipArea")
            .attr("r", (d, i) => vis.scaler(d[vis.select], i, vis.scale, vis.userData))
            // consider abstracting these out/making them more robust
            .attr("cx", (d, i) => (i % 3) * vis.width/3 + vis.width/6)
            .attr("cy", (d, i) => vis.height / 4 - 30 + Math.floor(i / 3) * vis.height / 3)
            .on('mouseover', function(event, d){
                d3.select(this)
                    .attr("class", "tooltip")
                vis.tooltip
                    .style("opacity", 1)
                    .style("left", event.pageX + 20 + "px")
                    .style("top", event.pageY + "px")
                    .html(`
                     <div class="tooltip-background">
                        <h3>Average ${d["property"]}: ${d[vis.select]}<h3>                   
                     </div>`);
            })
            .on('mouseout', function(event, d){
                d3.select(this)
                vis.tooltip
                    .style("opacity", 0)
                    .style("left", 0)
                    .style("top", 0)
                    .html(``);
            });
        //
        // let rects = vis.svg.selectAll("rect")
        //
        // rects.data(vis.userData)
        //     .join("rect")
        //     .attr("class", "rect")
        //     // .attr("r", "2")
        //     // .attr("cx", d => vis.xScale(d.DATE))
        //     // .attr("cy", d=> vis.yScale(d.NUM_TRACKS_ADDED))
        //
        // // // draw rectangle tooltips
        // let tooltipArea = vis.svg.selectAll(".tooltipArea")
        //
        // tooltipArea.data(vis.userData)
        //     .join("rect")
        //     // consider abstracting these out/making them more robust
        //     .attr("x", (d, i) => (i % 3) * vis.width/3 + vis.width/6)
        //     .attr("class", "tooltipArea")
        //     .attr("y", (d, i) => vis.height / 4 - 30 + Math.floor(i / 3) * vis.height / 3)
        //     .attr("width", 100)
        //     .attr("height", 20)
        //     .on('mouseover', function(event, d){
        //         console.log(d)
        //         d3.select(this)
        //             .attr("class", "tooltip")
        //         vis.tooltip
        //             .style("opacity", 1)
        //             .style("left", event.pageX + 20 + "px")
        //             .style("top", event.pageY + "px")
        //             .html(`
        //              <div class="tooltip-background">
        //                  <h3>Average ${d["property"]}: ${d[vis.select]}<h3>
        //              </div>`);
        //     })
        //     .on('mouseout', function(event, d){
        //         d3.select(this)
        //         vis.tooltip
        //             .style("opacity", 0)
        //             .style("left", 0)
        //             .style("top", 0)
        //             .html(``);
        //     });
    }
}