/* * * * * * * * * * * * * *
*      class BarVis        *
* * * * * * * * * * * * * */


class LineChart {

    constructor(parentElement, userData) {
        this.parentElement = parentElement;
        this.userData = userData;
        this.dateAddedArray = [];
        this.dateCount = [];
        this.formatDate = d3.timeFormat("%b %d %Y")
        this.parseDate = d3.timeParse("%Y");

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
            .attr('class', 'title line-title')
            .append('text')
            .text('Number of Tracks Added to Playlists over Time')
            .attr('transform', `translate(${vis.width / 2}, 10)`)
            .attr('text-anchor', 'middle');

        // Scales and axes
        vis.xScale = d3.scaleTime()
            .range([0, vis.width])

        vis.yScale = d3.scaleLinear()
            .range([vis.height - vis.margin.bottom, vis.margin.top]);

        vis.xAxis = d3.axisBottom()
            .scale(vis.xScale)
            .tickFormat(d3.timeFormat("%b %Y"));

        vis.yAxis = d3.axisLeft()
            .scale(vis.yScale);

        vis.svg.append("g")
            .attr("class", "x-axis axis");

        vis.svg.append("g")
            .attr("class", "y-axis axis");

        // append tooltip
        vis.tooltip = d3.select("body").append('div')
            .attr('class', "tooltip")
            .attr('id', 'lineTooltip')

        this.wrangleData();
    }

    wrangleData(){
        let vis = this;

        // pull tracks added from userData
        vis.userData = vis.userData.forEach((playlist) => {
                playlist.tracks.forEach(track => {
                        vis.dateAddedArray.push(new Date(track.dateAdded))
                }
            )
        })

        // sort data
        vis.dateAddedArray.sort(function(a,b){
            return a - b;
        });

        // count num of tracks / day
        let last = vis.dateAddedArray[0]
        let count = 1
        for (let i = 1; i < vis.dateAddedArray.length; i++) {
            if (vis.dateAddedArray[i] - last != 0) {
                vis.dateCount.push({DATE: last, NUM_TRACKS_ADDED: count})
                last = vis.dateAddedArray[i]
                count = 1
            } else {
                count++;
            }
        }

        console.log(vis.dateCount);

        vis.updateVis()

    }

    updateVis(){
        let vis = this;

        // draw / update X-AXIS
        let minDate = vis.dateCount[0].DATE;
        let maxDate = vis.dateCount[vis.dateCount.length-1].DATE;
        vis.xScale.domain([minDate, maxDate]);
        vis.svg.select(".x-axis")
            .attr("transform", "translate(0," + (vis.height - vis.margin.top) + ")")
            .call(vis.xAxis);

        // update y-axis domain
        let maxY = d3.max(vis.dateCount, d => d.NUM_TRACKS_ADDED);
        let minY = d3.min(vis.dateCount, d => d.NUM_TRACKS_ADDED);
        vis.yScale.domain([minY, maxY]);
        vis.svg.select(".y-axis")
            .call(vis.yAxis);

        // Add the line
        vis.svg.append("path")
            .datum(vis.dateCount)
            .attr("fill", "none")
            .attr("class", "line")
            .attr("stroke-width", 1.5)
            .attr("d", d3.line()
                .x(function(d) { return vis.xScale(d.DATE) })
                .y(function(d) { return vis.yScale(d.NUM_TRACKS_ADDED) })
            )

        // draw points
        let circles = vis.svg.selectAll("circle")

        circles.data(vis.dateCount, d=>d)
            .join("circle")
            .attr("class", "circle")
            .attr("r", "2")
            .attr("cx", d => vis.xScale(d.DATE))
            .attr("cy", d=> vis.yScale(d.NUM_TRACKS_ADDED))

        // draw points
        let tooltipArea = vis.svg.selectAll("circle")

        tooltipArea.data(vis.dateCount, d=>d)
            .join("circle")
            .attr("class", "tooltipArea")
            .attr("r", "10")
            .attr("cx", d => vis.xScale(d.DATE))
            .attr("cy", d=> vis.yScale(d.NUM_TRACKS_ADDED))
            .on('mouseover', function(event, d){
                d3.select(this)
                    .attr("class", "tooltip")
                vis.tooltip
                    .style("opacity", 1)
                    .style("left", event.pageX + 20 + "px")
                    .style("top", event.pageY + "px")
                    .html(`
                     <div class="tooltip-background">
                         <h3>${vis.formatDate(d.DATE)}<h3>
                         <h3>${d.NUM_TRACKS_ADDED} new tracks<h3>                      
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
    }
}