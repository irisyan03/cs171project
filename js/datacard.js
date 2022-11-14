class DataCard {

    // constructor method to initialize data card object
    constructor(parentElement, userData, num) {
        this.parentElement = parentElement;
        this.userData = userData;
        this.artistData = userData.topArtistsByCount;
        this.songData = userData.topSongsByCount;
        this.num = num

        this.initTable()
    }

    initTable() {
        let vis = this;
        console.log(vis.artistData[0])
        document.getElementsByClassName('artist_1')[vis.num].innerHTML = vis.artistData[0];
        document.getElementsByClassName('artist_2')[vis.num].innerHTML = vis.artistData[1];
        document.getElementsByClassName('artist_3')[vis.num].innerHTML = vis.artistData[2];
        document.getElementsByClassName('track_1')[vis.num].innerHTML = vis.songData[0];
        document.getElementsByClassName('track_2')[vis.num].innerHTML = vis.songData[1];
        document.getElementsByClassName('track_3')[vis.num].innerHTML = vis.songData[2];
    }
}