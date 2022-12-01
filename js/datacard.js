class DataCard {

    // constructor method to initialize data card object
    constructor(parentElement, inputData, num) {
        this.parentElement = parentElement;
        this.inputData = inputData;
        this.num = num

        this.initTable()
    }

    initTable() {
        let vis = this;
        let artists = ['artist_1','artist_2','artist_3']
        let tracks = ['track_1','track_2','track_3']
        let index = selectedPerson;
        vis.userData = vis.inputData[index]
        console.log(vis.userData)
        console.log("artists Data^ for cards" + vis.num)
        vis.artistData = vis.userData.topArtistsByCount;
        vis.songData = vis.userData.topSongsByCount;

        for (let i = 0; i < 3; i++) {
            document.getElementsByClassName(artists[i])[vis.num].innerHTML = vis.artistData[i];
            document.getElementsByClassName(tracks[i])[vis.num].innerHTML = "<a href=" + vis.userData.topSongsByCount_url[vis.songData[i]] + ">" + vis.songData[i] + "</a>"
        }
        // document.getElementsByClassName('avg_playlist_length')[vis.num].innerHTML = "<u>Average Playlist Length:</u> " + Math.round(vis.userData.avgLengthPlaylist) + " tracks"
    }

}


