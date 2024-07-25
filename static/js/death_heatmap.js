// code for creating a heatmap of deaths by area

// // initializing the map
let myMap = L.map("map", {
    center: [39.09, -101.25],
    zoom: 5
  });
  
// Adding the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// PROBLEM
// can only query 1000 records, but 1000 records doesn't include every state
// need to figure out how to gather data for all states
    // randomly grab json results?
// ALSO there are no lat and lon coordinates for the states

// using $offset= to parse through the data 1000 rows at a time
let url = "https://data.cdc.gov/resource/muzy-jte6.json?$offset=1000";

// importing the data

d3.json(url).then(data => {
    // checking to see if the data got imported right
    console.log(data);
    let state_data = [];
    for (i = 0; i< data.length; i++) {
        if (data[i].jurisdiction_of_occurrence != "United States") {
            state_data.push(data[i]);
        }
    }
    console.log(state_data)
});

let deaths = new L.layerGroup()
let medicalCosts = new L.layerGroup()
let overlayMaps = {
    Deaths: deaths,
    "Medical Costs": medicalCosts
}

L.control.layers(overlayMaps).addTo(myMap);