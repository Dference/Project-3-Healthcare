// code for creating a chloropleth of deaths by state


// NOTE: I added Puerto Rico to the us-states.json file since the deaths dataset included it, it was not in the original file

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
let medCostPath = "Data/medical_cost.json"
let deathPath = "Data/Updated_Deaths_Sheet.json"

// just straight up importing the data

// chloropleth layer
// fetch(stateBoundariesPath)
//     .then(response => response.json())
//     .then(responseJson => {
//         stateJson = responseJson.features
//         L.geoJson(stateJson).addTo(myMap);
//     });

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
    toNumber(deathJson);

    // seperating state data only
    // remember that this returns an array of arrays
    stateDataGroupby= sortingYearandState(deathJson);
    console.log(stateDataGroupby)

    // creating empty lists to hold the data for types of death
    let allDeaths2020 = [];
    let allDeaths2021 = [];
    let allDeaths2022 = [];
    let allDeaths2023 = [];

    // creates an array for sums of each type of death to be used when using this data for popups
    arrayOfDeaths(stateDataGroupby[2020], allDeaths2020);
    arrayOfDeaths(stateDataGroupby[2021], allDeaths2021);
    arrayOfDeaths(stateDataGroupby[2022], allDeaths2022);
    arrayOfDeaths(stateDataGroupby[2023], allDeaths2023);

    console.log(allDeaths2020)
   
    // chloropleth layer
fetch(stateBoundariesPath)
    .then(response => response.json())
    .then(responseJson => {
        let stateJson = responseJson.features;  // narrowing down to just responses for simplicity
    L.geoJson(stateJson).addTo(myMap);          // adding the polygon layer to the map
cd 
        // adding the values we got from the death and medical cost array to the geojson file so it will be easier to create the popups
        // both the death json and states json are in alphabetical order (except with pr at the end) so the values match up
        addingKeys(stateJson, allDeaths2020, "2020")
        addingKeys(stateJson, allDeaths2021, "2021")
        addingKeys(stateJson, allDeaths2022, "2022")
        addingKeys(stateJson, allDeaths2023, "2023")

        console.log(stateJson)




        L.geoJSON(stateJson, {
            onEachFeature: (feature, layer) => {
            layer.bindPopup(
                `<h1 style='text-align: center'> ${feature.properties.name}</h1>
                <br><h2> Total Deaths in 2020: ${feature.properties[2020].all_cause} </h2>`
            )}
        }).addTo(myMap)


    });


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

    // dividing into year and the grouping by states
    // the lengths of each year are 2809, 2756, 2756, 1961
    let stateDataByYear = [];
    let stateDataGroupby = [];
    for (let i = 2020; i < 2024; i++) {
        stateDataByYear[i] = stateData.filter(year => year.mmwr_year == i);
        stateDataGroupby[i] = Object.groupBy(stateDataByYear[i], ({jurisdiction}) => jurisdiction);
    }
    // this returns an array of arrays
    // 4 arrays for each year, 50 arrays in each for every state, and x amount of weeks per state
    // yes this will make indexing a pain, but that's what for loops are for
    return stateDataGroupby;
}

// function that converts string values to numbers
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

// function that sums up the costs for each year and category
function costSums(yearArray, costCategory) {
    let sumArray = []
    // for each state in the dataset
    for (state in yearArray) {
        let sum = 0;
        // and every week of data that was collected
        // we're using Alabama here because its the first state in the data set and all the states have the same number of recorded weeks
        for (week in yearArray.Alabama) {
            // summing up
            sum += yearArray[state][week][costCategory]
        }
        sumArray.push(sum)
    }
    return sumArray
}

// function that creates an array of death sums w keys
function arrayOfDeaths(yearArray, emptyArray) {
    let deathCategories = ["all_cause", "nat_causes", "chron_causes", "non_chron_causes"];
    for (i = 0; i < deathCategories.length; i ++) {
        emptyArray[deathCategories[i]] = costSums(yearArray, deathCategories[i]);
    }
}

// adding the keys w sums to the state json array
function addingKeys(json, deathArray, year) {
    json.forEach((feature, index) => {
        feature.properties[year] = {}; // creating a key for the year
        for (cause in deathArray){
            feature.properties[year][cause] = deathArray[cause][index]; // adding each cause as a key w its respective sum
        }
    });
}