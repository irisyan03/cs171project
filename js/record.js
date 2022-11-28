/* * * * * * * * * * * * * *
*      class Record        *
* * * * * * * * * * * * * */


class Record {

    constructor(parentElement, inputTrackData, index) {
        this.parentElement = parentElement;
        this.inputTrackData = inputTrackData;
        this.index = index;

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
        // init drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append('g')
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`);

        vis.colorScale = d3.scaleLinear()
            .domain([0,1]);

        // append tooltip
        vis.tooltip = d3.select("body").append('div')
            .attr('class', "tooltip")
            .attr('id', 'lineTooltip')

        this.wrangleData();
    }

    wrangleData(){
        let vis = this;

        let index = selectedPerson;
        vis.trackData = vis.inputTrackData[index]

        console.log("record", vis.trackData);
        vis.tempo = vis.trackData.audio_features[0].tempo*3
        vis.energy = vis.trackData.audio_features[0].energy
        vis.danceability = vis.trackData.audio_features[0].danceability
        let uri = vis.trackData.audio_features[0].uri
        vis.track_url = "https://open.spotify.com/track/" + uri.slice(14)

        // make the max radii relative to the energy metric
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
                    if (i == 0 || i == 2 || i == 4) {
                        return d3.interpolateViridis(vis.colorScale(vis.danceability))
                    }
                    if (i == 1 || i == 3) {
                        return d3.interpolateViridis(vis.colorScale(vis.danceability)+.1)
                    }
                    if (i == 5) {
                        return "#2D3142";
                    }
                    return "white";
                });

            circle
                .append("a")
 /*               .attr("href", vis.trackData.audio)*/
                .attr("href", vis.track_url)

            this.animate(circle, vis.radii[i], vis.tempo)
        }

        let textBox = vis.svg.append("g")
            .attr("class", "recordTextBox")

        let title = textBox
            .append("text")
            .append("a")
            .text(vis.trackData.track)
            .attr("class", "recordTextBoxTitle")
            .attr("href", vis.track_url)
            .attr("x", vis.X)
            .attr("y", vis.height*2/3)
            // .attr('text-anchor', 'middle');

        let tempo = textBox.append("text")
            .text("Tempo: " + Math.floor(vis.tempo) + " bpm")
            .attr("class", "recordTextBoxSubtitle")
            .attr("x", vis.X)
            .attr("y", vis.height*2/3 + 32)
            .attr('text-anchor', 'middle');

        let loudness = textBox.append("text")
            .text("Energy: " + vis.energy)
            .attr("class", "recordTextBoxSubtitle")
            .attr("x", vis.X)
            .attr("y", vis.height*2/3 + 2*32)
            .attr('text-anchor', 'middle');

        let danceablity = textBox.append("text")
            .text("Danceability: " + vis.danceability)
            .attr("class", "recordTextBoxSubtitle")
            .attr("x", vis.X)
            .attr("y", vis.height*2/3 + 3*32)
            .attr('text-anchor', 'middle');

        // let link = textBox.append("text")
        //     .append("a")
        //     .text("Listen on Spotify")
        //     .attr("class", "recordLinkBoxLink")
        //     .attr("href", vis.track_url)
    }

    animate(circle, r, tempo) {
        circle.transition()
            .duration(tempo)
            .attr('r', r)
            .on('end', () => this.animateOut(circle, r*2, tempo))
    }

    animateOut(circle, r, tempo) {
        circle.transition()
            .duration(tempo)
            .attr('r', r)
            .on('end', () => this.animate(circle, r/2, tempo))
    }

    animateOp(circle, danceability) {
        circle.transition()
            .duration(500 * danceability)
            .style('opacity', 0.25)
            .on('end', () => this.animateOpOut(circle, danceability))
    }

    animateOpOut(circle, danceability) {
        circle.transition()
            .duration(500 * danceability)
            .style('opacity', 1)
            .on('end', () => this.animateOp(circle, danceability))
    }
}