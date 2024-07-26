// code for creating a chloropleth of deaths by state


// PROBLEM TO FIX LATER: all the numbers are strings instead of integers

// // initializing the map
let myMap = L.map("map", {
    center: [39.09, -101.25],
    zoom: 5
  });
  
// Adding the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// loading in json data
let stateBoundariesPath = `static/archive/us-states.json`
let medCostPath = "medical_cost.json"
let deathPath = "Updated_Deaths_Sheet.json"

// just straight up importing the data

// chloropleth layer
fetch(stateBoundariesPath)
    .then(response => response.json())
    .then(responseJson => {
        stateJson = responseJson.features
        L.geoJson(stateJson).addTo(myMap);
    });

fetch(deathPath)
    .then(data => data.json())
    .then(deathJson => {
    // checking to see if the data got imported right
    // console.log(deathJson);
    });

fetch(medCostPath)
.then(response => response.json())
.then(costJson => {
    // console.log(costJson)
})

// experimenting with adding layers, these are all blank right now
let deaths = new L.layerGroup();
let medicalCosts = new L.layerGroup();
let overlayMaps = {
    Deaths: deaths,
    "Medical Costs": medicalCosts
}

L.control.layers(overlayMaps).addTo(myMap);



// WORKING WITH THE DATA
stateDataGroupby = []
fetch(deathPath)
    .then(data => data.json())
    .then(deathJson => {
    // checking to see if the data got imported right
    console.log(deathJson[1]);

    // converting string data to numbers
    toNumber(deathJson)

    // seperating state data only
    stateDataGroupby= sortingYearandState(deathJson);
    console.log(stateDataGroupby)
    let data2020 = stateDataGroupby[2020]

    // console.log(data2020.Alabama[0].all_cause)
    
    let sum = 0;
    for (state in data2020) {
        for (week in data2020.Alabama) {
            sum 
        }
    }

    });

// function for creating map, will circle back to later
function chloroplethMap(deaths) {

    // initializing the map
    let myMap = L.map("map", {
        center: [39.09, -101.25],
        zoom: 5
        // layers: [whatever]
      });
      
    // Adding the tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(myMap);
    
}

// function to sort 
function sortingYearandState(json) {
    // getting just the state specific data
    let stateData = [];
    for (i = 0; i< json.length; i++) {
        if (json[i].jurisdiction != "United States") {
            stateData.push(json[i]);
        }
    }
    // console.log(stateData);

    // dividing into year and the grouping by states
    // the lengths of each year are 2809, 2756, 2756, 1961
    let stateDataByYear = [];
    let stateDataGroupby = [];
    for (let i = 2020; i < 2024; i++) {
        stateDataByYear[i] = stateData.filter(year => year.mmwr_year == i);
        stateDataGroupby[i] = Object.groupBy(stateDataByYear[i], ({jurisdiction}) => jurisdiction);
    }
    // console.log(stateDataByYear)
    // console.log(stateDataGroupby)
    return stateDataGroupby;
}

function toNumber(json) {
    // for every key that exists
    for (key in json[0]) {
        // replace the value of the key with a float, iterating over every index
        for (i = 0; i < json.length; i++) {
            if (key != "jurisdiction" && key != "week_end") {
                json[i][key] = parseFloat(json[i][key])
            }
        }
    }
}