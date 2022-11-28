/* * * * * * * * * * * * * *
*      class BarChart        *
* * * * * * * * * * * * * */


class BarChart {

    constructor(parentElement, userData) {
        this.parentElement = parentElement;
        this.userData = userData;
        this.playlistArray = [];
        this.formatDate = d3.timeFormat("%b %d %Y")
        this.parseDate = d3.timeParse("%Y-%b-%d")
        this.minYear = 0
        this.maxYear = 0
        this.DATE = 2022

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

        // append tooltip
        vis.tooltip = d3.select("body").append('div')
            .attr('class', "tooltip")
            .attr('id', 'tooltop')

        // Scales and axes
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

        this.wrangleData();
    }

    wrangleData() {
        let vis = this
        // Pulling this straight from dataTable.js
        let filteredData = [];

        // pull out min and max year of date added to playlist
        let allTracks = vis.userData.map((playlist) => playlist.tracks)
        allTracks = allTracks.flat(1)
        let allDateAdded = allTracks.map(track => new Date(track.dateAdded))
        vis.minYear = new Date(Math.min(...allDateAdded)).getFullYear()
        vis.maxYear = new Date(Math.max(...allDateAdded)).getFullYear()

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

        // Time
        var dataTime = d3.range(0, vis.maxYear - vis.minYear + 1).map(function(d) {
            return new Date(vis.minYear + d, 10, 3);
        });

        vis.sliderTime = d3
            .sliderBottom()
            .min(d3.min(dataTime))
            .max(d3.max(dataTime))
            .step(1000 * 60 * 60 * 24 * 365)
            .width(300)
            .tickFormat(d3.timeFormat('%Y'))
            .tickValues(dataTime)
            .default(new Date(1998, 10, 3))
            .on('onchange', val => {
                d3.select('p#value-time').text(d3.timeFormat('%Y')(val));
                vis.DATE = val.getFullYear()
                console.log(this.DATE)
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

    updateData() {
        let vis = this;
        let i = vis.DATE - vis.minYear;

        console.log(vis.playlistArray)
        vis.filteredData = vis.playlistArray.map(playlist => {
            console.log(playlist.trackData)
            return {name: playlist.name, num_tracks: playlist.trackData[i].N}
        })

        // sort data
        vis.filteredData.sort(function(a,b){
            return - (a.num_tracks - b.num_tracks);
        });

        // Sort and then filter by top 10
        vis.filteredData.sort((a,b) => {return b.num_tracks - a.num_tracks})

        vis.topTenData = vis.filteredData.slice(0, 10)

        console.log('final top ten', vis.topTenData);

        vis.updateVis()
    }

    updateVis(){
        let vis = this;

        vis.x.domain(vis.topTenData.map(d => d.name));

        let max = d3.max(vis.topTenData.map(d => d.num_tracks));
        let min = d3.min(vis.topTenData.map(d => d.num_tracks));
        vis.y.domain([min, max]);

        let bars = vis.svg.selectAll(".bar")
            .data(vis.topTenData);

        bars.exit().remove();

        bars.enter()
            .append("rect")
            .attr("class", "bar")
            .merge(bars)
            .attr("x", (d,i) => vis.x(d.name))
            .attr("y", d => vis.y(d.num_tracks))
            .attr("width", vis.x.bandwidth())
            .attr("height", (d,i) => vis.height - vis.y(d.num_tracks))

        vis.svg.select(".x-axis")
            .attr("transform", "translate(0," + (vis.height) + ")")
            .call(vis.xAxis);

        vis.svg.select(".y-axis")
            .call(vis.yAxis);

        vis.gTime.call(vis.sliderTime);

        d3.select('p#value-time').text(d3.timeFormat('%Y')(vis.sliderTime.value()));

    }



}