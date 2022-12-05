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
let colorLegend;
let colorLegend2;

let selectedPerson =  document.getElementById('personSelector').value;

function changePerson() {
    selectedPerson = document.getElementById("personSelector").value;
    d3.selectAll("svg").remove();
    barChart.initVis();
    playlistLineChart.initVis();
    dataCardPersonal.initTable();
    for (let i = 0; i < 5; i++) {
        recordList[i].initVis();
    }
    bubbleChart.initVis();
    colorLegend.initVis();
    colorLegend2.initVis();
}

// load data using promises
// 0, 3, and 6 : Personal Data
// 1, 4, and 7 : Top Stats
// 2, 5, and 8 : Top Songs Attributes
// 9 : General Top Stats
// 10 : Decade Data
promises = [
    d3.json("data/IY_data/IY_data_cleaned.json"), // 0
    d3.json("data/IY_data/IY_top_stats.json"), // 1
    d3.json("data/IY_data/IY_top_songs_attributes.json"), // 2
    d3.json("data/LW_data/LW_data_cleaned.json"), // 3
    d3.json("data/LW_data/LW_top_stats.json"), // 4
    d3.json("data/LW_data/LW_top_songs_attributes.json"), // 5
    d3.json("data/CL_data/CL_data_cleaned.json"), // 6
    d3.json("data/CL_data/CL_top_stats.json"), // 7
    d3.json("data/CL_data/CL_top_songs_attributes.json"), // 8
    d3.json("data/aggregate_data/general_top_stats.json"), // 9
    d3.csv("data/aggregate_data/decade_data.csv") // 10
];

Promise.all(promises)
    .then( function(data){
        initMainPage(data) })
    .catch( function (err){console.log(err)} );

// initMainPage
function initMainPage(dataArray) {

    // log data
    console.log(dataArray);

    // instantiate line chart
    playlistLineChart = new LineChart('playlistLineChartDiv', [dataArray[0], dataArray[3], dataArray[6]]);

    // instantiate stacked bar chart
    barChart = new BarChart('barChartDiv', [dataArray[0],dataArray[3], dataArray[6]]);

    // instantiate data cards
    dataCardPersonal = new DataCard('personal-card', [dataArray[1], dataArray[4], dataArray[7]],1);
    dataCardAggregate = new DataCard('aggregate-card',[dataArray[9], dataArray[9], dataArray[9]],0);

    bubbleChart = new BubbleChart('bubbleChartDiv', dataArray[10]);
    // initiate records

    for (let i = 0; i < 5; i++) {
        let r = new Record(`recordVis${i+1}`, [dataArray[2][i], dataArray[5][i], dataArray[8][i]]);
        recordList.push(r);
        console.log("record list");
        console.log(recordList);
    }

    colorLegend = new ColorLegend('recordLegend', "Danceability", 0, 1)
    colorLegend2 = new ColorLegend('recordLegend2', "Attribute", "small", "large")
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
    download.href = "data/card/"+ type + ".png";
    download.download = "download" + type + ".png";
    download.click()
}

function downloadPersonalCard(){
    downloadCard(selectedPerson)
}

function downloadAggregateCard(){
    downloadCard("AggregateCard")
}

