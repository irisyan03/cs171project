class DataCard {

    // constructor method to initialize data card object
    constructor(parentElement, inputData, num) {
        this.parentElement = parentElement;
        this.inputData = inputData;
        this.num = num

        this.initVis()
    }

    initVis() {
        let vis = this;

        // initialize variables for selection
        vis.artists = ['artist_1', 'artist_2', 'artist_3']
        vis.tracks = ['track_1', 'track_2', 'track_3']
        vis.index = selectedPerson;

        this.wrangleData();
    }

    wrangleData() {
        let vis = this;

        // filter data for selected person
        vis.userData = vis.inputData[vis.index]
        vis.artistData = vis.userData.topArtistsByCount;
        vis.songData = vis.userData.topSongsByCount;

        this.updateVis();
    }

    updateVis(){
        let vis = this;

        // update innerHTML in data card
        for (let i = 0; i < 3; i++) {
            document.getElementsByClassName(vis.artists[i])[vis.num].innerHTML = vis.artistData[i];
            document.getElementsByClassName(vis.tracks[i])[vis.num].innerHTML = "<a href=" + vis.userData.topSongsByCount_url[vis.songData[i]] + ">" + vis.songData[i] + "</a>"
        }
        document.getElementsByClassName('avg_playlist_length')[vis.num].innerHTML = "<u>Average Playlist Length:</u> " + Math.round(vis.userData.avgLengthPlaylist) + " tracks"
    }
}


