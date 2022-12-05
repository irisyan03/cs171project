/* * * * * * * * * * * * * *
*      class BarChart        *
* * * * * * * * * * * * * */


class BarChart {

    constructor(parentElement, allUserData) {
        this.parentElement = parentElement;
        this.allUserData = allUserData;
        this.playlistArray = [];
        this.minYear = 0;
        this.maxYear = 0;
        this.DATE = 2022;

        this.initVis();
    }

    initVis(){
        let vis = this;

        vis.margin = {top: 20, right: 20, bottom: 30, left: 40};
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

        // must set class variables here
        // so that they are reset when initVis called
        vis.userData = vis.allUserData[selectedPerson]
        vis.playlistArray = [];
        vis.minYear = 0;
        vis.maxYear = 0;
        vis.DATE = 2022;

        // init drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append('g')
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`);

        // scales and axes
        vis.x = d3.scaleBand()
            .rangeRound([0, vis.width])
            .paddingInner(0.1);

        vis.y = d3.scaleLinear()
            .range([vis.height - vis.margin.bottom, vis.margin.top]);

        vis.xAxis = d3.axisBottom()
            .scale(vis.x);

        vis.yAxis = d3.axisLeft()
            .scale(vis.y);

        vis.svg.append("g")
            .attr("class", "x-axis axis");

        vis.svg.append("g")
            .attr("class", "y-axis axis");

        // axis titles
        vis.svg.append("text")
            .attr("x", -40)
            .attr("y", -5)
            .text("# Tracks");

        vis.svg.append("text")
            .attr("x", vis.width / 2)
            .attr("y", vis.height + vis.margin.top/2)
            .text("Playlist");

        // append tooltip
        vis.tooltip = d3.select("body").append('div')
            .attr('class', "tooltip")
            .attr('id', 'lineTooltip')

        this.wrangleData();
    }

    wrangleData() {
        let vis = this
        let filteredData = [];

        // pull out min and max year of date added to playlist
        let allTracks = vis.userData.map((playlist) => playlist.tracks)
        allTracks = allTracks.flat(1)
        let allDateAdded = allTracks.map(track => new Date(track.dateAdded))
        vis.minYear = new Date(Math.min(...allDateAdded)).getFullYear()
        vis.maxYear = new Date(Math.max(...allDateAdded)).getFullYear()

        // create playlistArray of playlist name and array of
        // num of tracks in playlist per year
        vis.userData.forEach((playlist) => {
            let numTracks = 0;
            let numTracksArray = []
            for (let yr = vis.minYear; yr <= vis.maxYear; yr++) {
                playlist.tracks.forEach((track) => {
                    let trackDateAdded = new Date(track.dateAdded).getFullYear();
                    if (trackDateAdded >= yr && trackDateAdded < yr + 1) {
                        numTracks++;
                    }
                })
                numTracksArray.push({YR: yr, N: numTracks})
            }
            vis.playlistArray.push({name: playlist.name, trackData: numTracksArray})
        })

        // get min and max playlist size for axis
        let max = d3.max(vis.playlistArray.map(p => d3.max(p.trackData.map(d=>d.N))));
        let min = d3.min(vis.playlistArray.map(p => d3.min(p.trackData.map(d=>d.N))));
        vis.y.domain([min, max]);

        // create color scale and add legend
        vis.colorScale = d3.scaleLinear()
            .domain([0, 2*max]);

        new ColorLegend('recordLegend1', "Number of Tracks", 0, `${max}`, true)

        // range of dates in playlistArray
        let dates = d3.range(0, vis.maxYear - vis.minYear + 1).map(function(d) {
            return new Date(vis.minYear + d, 10, 3);
        });

        // slider for choosing year
        vis.sliderTime = d3
            .sliderBottom()
            .min(d3.min(dates))
            .max(d3.max(dates))
            .step(1000 * 60 * 60 * 24 * 365)
            .width(400)
            .tickFormat(d3.timeFormat('%Y'))
            .tickValues(dates)
            .default(new Date(1998, 10, 3))
            .on('onchange', val => {
                d3.select('p#value-time').text(d3.timeFormat('%Y')(val));
                vis.DATE = val.getFullYear()
                vis.updateData()
            });

        vis.gTime = d3
            .select('div#slider-time')
            .append('svg')
            .attr('width', 500)
            .attr('height', 100)
            .append('g')
            .attr('transform', 'translate(30,30)');

        this.updateData()
    }

    // updates data to slider range
    updateData() {
        let vis = this;
        let i = vis.DATE - vis.minYear;

        // filter data based on selected year
        vis.filteredData = vis.playlistArray.map(playlist => {
            return {name: playlist.name, num_tracks: playlist.trackData[i].N}
        })

        // sort then filter to top 10 largest playlists
        vis.filteredData.sort((a,b) => {return b.num_tracks - a.num_tracks})
        vis.topTenData = vis.filteredData.slice(0, 10)

        vis.updateVis()
    }

    updateVis(){
        let vis = this;

        vis.x.domain(vis.topTenData.map(d => d.name));

        let bars = vis.svg.selectAll(".bar")
            .data(vis.topTenData, function(d) { return this.tagName === "rect" ? this.key : d.name;  });

        bars.exit().remove();

        // transition bars and axis together
        const t = vis.svg.transition().duration(300);

        // create bars
        bars.enter()
            .append("rect")
            .property("key", d => d.name)
            .attr("class", "bar")
            .merge(bars)
            .transition(t)
            .attr("x", d => vis.x(d.name))
            .attr("y", d => vis.y(d.num_tracks))
            .attr("width", vis.x.bandwidth())
            .attr("height", d => vis.height - vis.margin.bottom - vis.y(d.num_tracks))
            .style("fill", d => d3.interpolateViridis(vis.colorScale(d.num_tracks)))

        // add tooltip
        vis.svg.selectAll("rect")
            .on('mouseover', function(event, d){
                d3.select(this)
                    .style("opacity", 0.75)
                vis.tooltip
                    .style("opacity", 1)
                    .style("left", event.pageX + 10 + "px")
                    .style("top", event.pageY + "px")
                    .html(`
                         <div class="tooltip-background">
                             <h3>${d.name}<h3>
                             <h3>${d.num_tracks} tracks<h3>                      
                         </div>`);
            }).on('mouseout', function(event, d){
                    d3.select(this)
                        .style("opacity", 1)
                    vis.tooltip
                        .style("opacity", 0)
                        .style("left", 0)
                        .style("top", 0)
                        .html(``);
                });

        // update axes
        vis.svg.select(".x-axis")
            .attr("transform", "translate(0," + (vis.height - vis.margin.bottom) + ")")
            .transition(t)
            .call(vis.xAxis);

        vis.svg.select(".y-axis")
            .call(vis.yAxis);

        // update slider label
        vis.gTime.call(vis.sliderTime);
        d3.select('p#value-time').text(d3.timeFormat('%Y')(vis.sliderTime.value()));

    }

}