/* * * * * * * * * * * * * *
*      class Record        *
* * * * * * * * * * * * * */


class Record {

    constructor(parentElement, inputTrackData) {
        this.parentElement = parentElement;
        this.inputTrackData = inputTrackData;

        this.initVis();
    }

    initVis(){
        let vis = this;

        vis.margin = {top: 10, right: 10, bottom: 10, left: 10};
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

        vis.AREA = (vis.width - vis.margin.left - vis.margin.right)
        vis.R = vis.AREA/6;
        vis.LINE_WIDTH = 2;
        vis.X = vis.AREA/2;
        vis.radii = [vis.R, vis.R*5/6, vis.R*5/6-vis.LINE_WIDTH, vis.R*3.5/6, vis.R*3.5/6-vis.LINE_WIDTH, vis.R*2/6, vis.R/6];

        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append('g')
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`);

        vis.colorScale = d3.scaleLinear()
            .domain([0,1]);

        vis.tooltip = d3.select("body").append('div')
            .attr('class', "tooltip")
            .attr('id', 'lineTooltip')

        this.wrangleData();
    }

    wrangleData(){
        let vis = this;

        vis.trackData = vis.inputTrackData[selectedPerson]

        vis.tempo = vis.trackData.audio_features[0].tempo*3
        vis.energy = vis.trackData.audio_features[0].energy
        vis.danceability = vis.trackData.audio_features[0].danceability
        let uri = vis.trackData.audio_features[0].uri
        vis.track_url = "https://open.spotify.com/track/" + uri.slice(14)

        // set the max radii relative to the energy metric
        vis.R = vis.R * vis.trackData.audio_features[0].energy
        vis.radii = [vis.R, vis.R*5/6, vis.R*5/6-vis.LINE_WIDTH, vis.R*3.5/6, vis.R*3.5/6-vis.LINE_WIDTH, vis.R*2/6, vis.R/6];

        vis.updateVis()

    }

    updateVis(){
        let vis = this;

        for (let i = 0; i < vis.radii.length; i++) {
            let circle = vis.svg
                .append("circle")
                .attr("r", vis.radii[i])
                .attr("cx", vis.X)
                .attr("cy", vis.height/4)
                .style("fill", function() {
                    // creates layered circles to give the appearance of records
                    if (i == 0 || i == 2 || i == 4) {
                        return d3.interpolateViridis(vis.colorScale(vis.danceability))
                    }
                    if (i == 1 || i == 3) {
                        return d3.interpolateViridis(vis.colorScale(vis.danceability)+.1)
                    }
                    if (i == 5) {
                        return "#2D3142"; // dark gray center circle
                    }
                    return "#F5F4E9"; // white center circle
                });
            // animate the circle to the tempo of the track
            this.animate(circle, vis.radii[i], vis.tempo)
        }

        // text group for record label
        let textBox = vis.svg.append("g")
            .attr("class", "recordTextBox")

        // track title + link to track on spotify
        textBox
            .append("a")
            .attr("href", vis.track_url)
            .attr("class", "trackurl")
            .append("text")
            .text(vis.trackData.track)
            .attr("class", "recordTextBoxTitle")
            .attr("x", vis.X)
            .attr("y", vis.height/2)
            .attr('text-anchor', 'middle')

        // tempo label
        textBox.append("text")
            .text("Tempo: " + Math.floor(vis.tempo) + " bpm")
            .attr("class", "recordTextBoxSubtitle")
            .attr("x", vis.X)
            .attr("y", vis.height/2 + 32)
            .attr('text-anchor', 'middle');

        // energy label
        textBox.append("text")
            .text("Energy: " + vis.energy)
            .attr("class", "recordTextBoxSubtitle")
            .attr("x", vis.X)
            .attr("y", vis.height/2 + 2*32)
            .attr('text-anchor', 'middle');

        // danceability label
        textBox.append("text")
            .text("Danceability: " + vis.danceability)
            .attr("class", "recordTextBoxSubtitle")
            .attr("x", vis.X)
            .attr("y", vis.height/2 + 3*32)
            .attr('text-anchor', 'middle');
    }

    // animation helper functions:
    // once animation starts, cycles between the two functions,
    // animating in and out relative to track tempo
    animate(circle, r, tempo) {
        circle.transition()
            .duration(2000 / tempo * 60 )
            .attr('r', r)
            .on('end', () => this.animateOut(circle, r*2, tempo))
    }

    animateOut(circle, r, tempo) {
        circle.transition()
            .duration(2000 / tempo * 60 )
            .attr('r', r)
            .on('end', () => this.animate(circle, r/2, tempo))
    }
}