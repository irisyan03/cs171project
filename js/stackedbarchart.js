/* * * * * * * * * * * * * *
*      class BarVis        *
* * * * * * * * * * * * * */


class StackedBarChart {

    constructor(parentElement, userData) {
        this.parentElement = parentElement;
        this.userData = userData;
        this.playlistArray = [];
        this.formatDate = d3.timeFormat("%b %d %Y")
        this.parseDate = d3.timeParse("%Y");
        this.minDate = d3.min(this.userData.map((playlist) => { return new Date(playlist.lastModifiedDate)}))
        this.maxDate = d3.max(this.userData.map((playlist) => { return new Date(playlist.lastModifiedDate)}))

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
            .text('Number of Tracks per Playlist over Time')
            .attr('class', 'chart-title line-title')
            .attr('transform', `translate(${vis.width / 2}, 10)`)
            .attr('text-anchor', 'middle');

        // Scales and axes
        vis.xScale = d3.scaleTime()
            .domain([0,100])
            .range([vis.minDate, vis.maxDate])

        vis.yScale = d3.scaleLinear()
            .range([vis.height - vis.margin.bottom, vis.margin.top]);

        vis.yAxis = d3.axisLeft()
            .scale(vis.yScale);

        vis.svg.append("g")
            .attr("class", "y-axis axis");

        // append tooltip
        vis.tooltip = d3.select("body").append('div')
            .attr('class', "tooltip")
            .attr('id', 'lineTooltip')

        // color palette = one color per subgroup
        vis.color = d3.scaleLinear().range(["#758BFD", "#0CCE6B"])

        this.wrangleData();
    }

    wrangleData(){
        let vis = this;

        // pull playlists added from userData
        vis.userData.forEach((playlist) => {
            vis.playlistArray.push({
                    NAME: playlist.name,
                    DATE_MODIFIED: new Date(playlist.lastModifiedDate),
                    NUM_TRACKS: playlist.num_tracks
                }
            )
        })

        // filter data
        let slider = document.getElementById("dateSlider").value;
        let DATE = vis.xScale(slider);
        console.log(DATE)
        vis.playlistArray = vis.playlistArray.filter(function(a) {
            return a.DATE_MODIFIED <= DATE;
        });

        // sort data
        vis.playlistArray.sort(function(a,b){
            return - (a.NUM_TRACKS - b.NUM_TRACKS);
        });

        let total = 0;
        vis.playlistArray.forEach((playlist) => {
            playlist.Y = total;
            total += playlist.NUM_TRACKS;
        })

        console.log(vis.playlistArray);

        vis.updateVis()

    }

    updateVis(){
        let vis = this;

        // update y-axis domain
        let maxY = d3.sum(vis.playlistArray, d => d.NUM_TRACKS);
        vis.yScale.domain([0, maxY]);
        vis.svg.select(".y-axis")
            .call(vis.yAxis);

        vis.color.domain([d3.min(vis.playlistArray, d => d.NUM_TRACKS), d3.max(vis.playlistArray, d => d.NUM_TRACKS)])

        // draw bars
        let bars = vis.svg.selectAll("rect")
            // enter a second time = loop subgroup per subgroup to add all rectangles
            .data(vis.playlistArray)

        bars.exit().remove();

        bars.enter()
            .append("rect")
                .style("fill", function(d) {return vis.color(d.NUM_TRACKS)})
                .attr("class", "stacked-bar")
                .attr("x", 20 )
                .attr("y", function(d) { return vis.height - vis.yScale(d.Y); })
                .attr("height", function(d) { return vis.height - vis.margin.bottom - vis.yScale(d.NUM_TRACKS); })
                .attr("width", 150)
                .on('mouseover', function(event, d){
                    d3.select(this)
                        .style("opacity", 0.5)
                        .style("cursor", "pointer")
                    vis.tooltip
                        .style("opacity", 1)
                        .style("left", event.pageX + 20 + "px")
                        .style("top", event.pageY + "px")
                        .html(`
                         <div class="tooltip-background">
                             <h3>${d.NAME}<h3>
                             <h3>${d.NUM_TRACKS} tracks<h3>                      
                         </div>`);
                })
                .on('mouseout', function(event, d){
                    d3.select(this)
                        .style("opacity", 1)
                    vis.tooltip
                        .style("opacity", 0)
                        .style("left", 0)
                        .style("top", 0)
                        .html(``);
                });
    }
}