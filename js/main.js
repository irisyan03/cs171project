/* * * * * * * * * * * * * *
*           MAIN           *
* * * * * * * * * * * * * */

// init global variables, switches, helper functions
let playlistLineChart;
let bubbleChart;
let barChart;
let promises;
let dataCardPersonal;
let dataCardAggregate;
let recordList = [];

let selectedPerson =  document.getElementById('personSelector').value;
console.log("initial value" + selectedPerson);

function personChange() {
    selectedPerson = document.getElementById("personSelector").value;
    console.log(selectedPerson)
    playlistLineChart.wrangleData();
    dataCardPersonal.initTable();
    for (let i = 0; i < 5; i++) {
        recordList[i].wrangleData();
    }
    // wrangle data for last barchart vis also
}

// load data using promises
promises = [
    d3.json("data/IY_data/IY_data_cleaned.json"),
    d3.json("data/IY_data/IY_top_stats.json"),
    d3.json("data/IY_data/IY_top_songs_attributes.json"),
    d3.json("data/LW_data/LW_data_cleaned.json"),
    d3.json("data/LW_data/LW_top_stats.json"),
    d3.json("data/LW_data/LW_top_songs_attributes.json"),
    d3.json("data/CL_data/CL_data_cleaned.json"),
    d3.json("data/CL_data/CL_top_stats.json"),
    d3.json("data/CL_data/CL_top_songs_attributes.json"),
    d3.json("data/aggregate_data/general_top_stats.json"),
    d3.csv("data/aggregate_data/decade_data.csv")

    // d3.json("data/CL_data/CL_data_cleaned.json"),
    // d3.json("data/CL_data/CL_top_stats.json"),
    // d3.json("data/aggregate_data/general_top_stats.json"),
    // d3.json("data/CL_data/CL_top_songs_attributes.json"),
    // d3.csv("data/aggregate_data/decade_data.csv")
];

Promise.all(promises)
    .then( function(data){
        initMainPage(data) })
    .catch( function (err){console.log(err)} );

// initMainPage
function initMainPage(dataArray) {

    // log data
    console.log("TODO: log data here")
    console.log(dataArray);

    // instantiate line chart
    playlistLineChart = new LineChart('playlistLineChartDiv', [dataArray[0], dataArray[3], dataArray[6]]);

    // instantiate stacked bar chart
    // let selectedYear = document.getElementById('dateSlider').value;
    barChart = new BarChart('barChartDiv', dataArray[0]);

    // instantiate data cards
    dataCardPersonal = new DataCard('personal-card', [dataArray[1], dataArray[4], dataArray[7]],1);
    dataCardAggregate = new DataCard('aggregate-card',[dataArray[9], dataArray[9], dataArray[9]],0);

    bubbleChart = new BubbleChart('bubbleChartDiv', dataArray[10]);
    // initiate records

    for (let i = 0; i < 5; i++) {
        let r= new Record(`recordVis${i+1}`, [dataArray[2][i], dataArray[5][i], dataArray[8][i]], i);
        recordList.push(r);
        console.log("record list");
        console.log(recordList);
    }

    new ColorLegend('recordLegend', "Danceability")
    new ColorLegend('recordLegend2', "Attribute")
}

let selected =  document.getElementById('categorySelector').value;

function categoryChange() {
    selected = document.getElementById("categorySelector").value;
    bubbleChart.wrangleData(); // maybe you need to change this slightly depending on the name of your MapVis instance
}

function updateAllVisualizations(){
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
