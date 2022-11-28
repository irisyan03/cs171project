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
        let index = selectedPerson;
        vis.userData = vis.inputData[index]
        console.log(vis.userData)
        console.log("artists Data^ for cards" + vis.num)
        vis.artistData = vis.userData.topArtistsByCount;
        vis.songData = vis.userData.topSongsByCount;


        document.getElementsByClassName('artist_1')[vis.num].innerHTML = vis.artistData[0];
        document.getElementsByClassName('artist_2')[vis.num].innerHTML = vis.artistData[1];
        document.getElementsByClassName('artist_3')[vis.num].innerHTML = vis.artistData[2];
        document.getElementsByClassName('track_1')[vis.num].innerHTML = vis.songData[0];
        document.getElementsByClassName('track_2')[vis.num].innerHTML = vis.songData[1];
        document.getElementsByClassName('track_3')[vis.num].innerHTML = vis.songData[2];
    }
}


