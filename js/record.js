/* * * * * * * * * * * * * *
*      class Record        *
* * * * * * * * * * * * * */


class Record {

    constructor(parentElement, trackData, index) {
        this.parentElement = parentElement;
        this.trackData = trackData;
        this.index = index;

        this.initVis();
    }

    initVis(){
        let vis = this;

        vis.margin = {top: 20, right: 20, bottom: 20, left: 40};
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

        vis.AREA = (vis.width - vis.margin.left - vis.margin.right)
        vis.R = vis.AREA/2/4;
        vis.LINE_WIDTH = 2;
        vis.X =  vis.index*(vis.AREA)+vis.AREA/2;

        vis.radii = [vis.R, vis.R*5/6, vis.R*5/6-vis.LINE_WIDTH, vis.R*3.5/6, vis.R*3.5/6-vis.LINE_WIDTH, vis.R*2/6, vis.R/6];
        vis.colors = ["#2D3142", "#707070", "#2D3142", "#707070", "#2D3142", "#157A6E", "white"]

        // init drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append('g')
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`);


        this.wrangleData();
    }

    wrangleData(){
        let vis = this;

        console.log("record", vis.trackData);
        vis.tempo = vis.trackData.audio_features[0].tempo*2

        vis.updateVis()

    }

    updateVis(){
        let vis = this;
        for (let i = 0; i < vis.radii.length; i++) {
            let circle = vis.svg
                .append("circle")
                .attr("r", vis.radii[i])
                .attr("cx", vis.X)
                .attr("cy", vis.height/2)
                .style("fill", vis.colors[i])
            this.animate(circle, vis.radii[i], vis.tempo)
        }
    }

    animate(circle, r, tempo) {
        circle
            .transition()
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

}