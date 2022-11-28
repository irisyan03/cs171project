/* * * * * * * * * * * * * *
*      class LineChart     *
* * * * * * * * * * * * * */


class LineChart {

    constructor(parentElement, inputData) {
        this.parentElement = parentElement;
        this.inputData = inputData;
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
        vis.height = 400 - vis.margin.top - vis.margin.bottom;

        // init drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append('g')
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`);


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
            .attr("class", "x-axis axis")
            .attr("transform", "translate(0," + (vis.height - vis.margin.top) + ")");

        vis.svg.append("g")
            .attr("class", "y-axis axis");

        vis.linePath = vis.svg.append("path")
            .attr("fill", "none")
            .attr("class", "line")
            .attr("stroke-width", 1.5);

        // Define the clipping region
        vis.clipPath = vis.svg.append("defs")
            .append("clipPath")
            .attr("id", "clip")
            .append("rect")
            .attr("width", vis.width)
            .attr("height", vis.height);

        vis.line = d3.line()
            .x(function(d) { return vis.xScale(d.DATE) })
            .y(function(d) { return vis.yScale(d.NUM_TRACKS_ADDED) })

        // append tooltip
        vis.tooltip = d3.select("body").append('div')
            .attr('class', "tooltip")
            .attr('id', 'lineTooltip')

        // Initialize brushing component
        vis.currentBrushRegion = null;
        vis.brush = d3.brushX()
            .extent([[0,15],[vis.width, vis.height]])
            .on("brush", function(event){
                // User just selected a specific region
                vis.currentBrushRegion = event.selection;
                vis.currentBrushRegion = vis.currentBrushRegion.map(vis.xScale.invert);
                // console.log(event.selection)
                // console.log(vis.currentBrushRegion)
                let selectionStart = vis.currentBrushRegion[0]
                let selectionEnd = vis.currentBrushRegion[1]
                d3.select("#time-period-min").text((String(selectionStart).slice(4,15)));
                d3.select("#time-period-max").text((String(selectionEnd).slice(4,15)));

                let sum = sumTracks(selectionStart,selectionEnd, vis.dateCount)
                d3.select("#sum-tracks-label").text(sum + " tracks");
            });

        // Append brush component here
        vis.brushGroup = vis.svg.append("g")
            .call(vis.brush);

        // Add zoom component
        vis.xOrig = vis.xScale; // save original scale

        vis.zoomFunction = function(event) {
            vis.xScale = event.transform.rescaleX(vis.xOrig);
            if (vis.currentBrushRegion) {
                vis.brushGroup.call(vis.brush.move, vis.currentBrushRegion.map(vis.xScale));
            }
            vis.updateVis();
        } // function that is being called when user zooms

        vis.zoom = d3.zoom()
            .on("zoom", vis.zoomFunction)
            .scaleExtent([1,20]);

        // disable mousedown and drag in zoom, when you activate zoom (by .call)
        vis.brushGroup.call(vis.zoom)
            .on("mousedown.zoom", null)
            .on("touchstart.zoom", null);

        this.wrangleData();
    }

    wrangleData(){
        let vis = this;

        let index = selectedPerson
        vis.userData = vis.inputData[index]

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
            if (vis.dateAddedArray[i] - last !== 0) {
                vis.dateCount.push({DATE: last, NUM_TRACKS_ADDED: count})
                last = vis.dateAddedArray[i]
                count = 1
            } else {
                count++;
            }
        }

        let maxY = d3.max(vis.dateCount, d => d.NUM_TRACKS_ADDED);
        let minY = d3.min(vis.dateCount, d => d.NUM_TRACKS_ADDED);
        vis.yScale.domain([minY, maxY]);

        let minDate = vis.dateCount[0].DATE;
        let maxDate = vis.dateCount[vis.dateCount.length-1].DATE;
        vis.xScale.domain([minDate, maxDate]);

        d3.select("#time-period-min").text((String(minDate).slice(4,15)));
        d3.select("#time-period-max").text((String(maxDate).slice(4,15)));

        console.log(vis.dateCount);

        vis.updateVis()

    }

    updateVis(){
        let vis = this;

        // Call brush component here
        vis.brushGroup.call(vis.brush);

        vis.linePath
            .join()
            .datum(vis.dateCount)
            .attr("d", vis.line)
            .attr("clip-path", "url(#clip)");

        vis.brushGroup
            .datum(vis.dateCount)
            .attr("d", vis.line)
            .attr("clip-path", "url(#clip)");

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

        // Call axis functions with the new domain
        vis.svg.select(".x-axis").call(vis.xAxis);
        vis.svg.select(".y-axis").call(vis.yAxis);

    }

}

function sumTracks(selectionStart, selectionEnd, array){
    console.log(array)
    let sum = 0
    array.forEach((date) => {
        if (date.DATE >= selectionStart && date.DATE <= selectionEnd){
            sum = sum + date.NUM_TRACKS_ADDED
        }
    })
    return sum
}