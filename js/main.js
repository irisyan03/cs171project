/* * * * * * * * * * * * * *
*           MAIN           *
* * * * * * * * * * * * * */

// init global variables, switches, helper functions
let playistLineChart;
let bubbleChart;
let stackedBarChart;



// load data using promises
let promises = [
    d3.json("data/IY_data_cleaned.json"),
    d3.json("IY_top_stats.json"),
    d3.json("general_top_stats.json"),
    d3.json("IY_data/IY_top_songs_attributes.json"),
    d3.csv("decade_data.csv")
];

Promise.all(promises)
    .then( function(data){ initMainPage(data) })
    .catch( function (err){console.log(err)} );

// initMainPage
function initMainPage(dataArray) {

    // log data
    console.log("TODO: log data here")
    console.log(dataArray);

    // instantiate line chart
    playistLineChart = new LineChart('playlistLineChartDiv', dataArray[0]);

    // instantiate stacked bar chart
    let selectedYear = document.getElementById('dateSlider').value;
    stackedBarChart = new StackedBarChart('stackedBarChartDiv', dataArray[0]);

    // instantiate data cards
    let dataCardPersonal = new DataCard('personal-card',dataArray[1],1);
    let dataCardAggregate = new DataCard('aggregate-card',dataArray[2],0);

    bubbleChart = new BubbleChart('bubbleChartDiv', dataArray[4]);
    // initiate records
    for (let i = 0; i < 5; i++) {
        new Record(`recordVis${i+1}`, dataArray[3][i], i);
    }
}

function updateAllVisualizations(){
    stackedBarChart.wrangleData();
    bubbleChart.updateVis()
}

function downloadCard(type){
    let download = document.createElement('a');
    download.href = "data/"+ type + ".png";
    download.download = "download" + type + ".png";
    download.click()
}

function downloadPersonalCard(){
    downloadCard("PersonalCard")
}

function downloadAggregateCard(){
    downloadCard("AggregateCard")
}