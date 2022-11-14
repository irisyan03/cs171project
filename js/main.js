/* * * * * * * * * * * * * *
*           MAIN           *
* * * * * * * * * * * * * */

// init global variables, switches, helper functions
let playistLineChart;

function updateAllVisualizations(){
    stackedBarChart.updateVis()
}

// load data using promises
let promises = [
    d3.json("data/IY_data_cleaned.json")
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
    console.log(selectedYear);
    stackedBarChart = new StackedBarChart('stackedBarChartDiv', dataArray[0]);

}

