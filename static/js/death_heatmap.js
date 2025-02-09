// code for creating a chloropleth of deaths by state

// PROBLEM: need to adjust death numbers by population
// PROBLEM: click events don't occur unless you open the console on the side and refresh the page?

// NOTE: I added DC, NYC, and Puerto Rico to the us-states.json file since the deaths dataset included it, it was not in the original file

// assigning the json paths to variables
    let stateBoundariesPath = `Data/us-states.json`
    let deathPath = "Data/Updated_Deaths_Sheet.json"

    // declaring a global variable so that the event listener will work later
    var selectedButton;
    let choroplethLayer = null;
    // initializing the map
    let myMap = L.map("map", {
        center: [41.728983, -102.209124],
        zoom: 4
    });


    // Adding the tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(myMap);

    myMap.invalidateSize();

    // adding layers to display data for different years
    let year1 = new L.layerGroup();
    let year2 = new L.layerGroup();
    let year3 = new L.layerGroup();
    let year4 = new L.layerGroup();
    let overlayMaps = {
        "2020" : year1,
        "2021" : year2,
        "2022" : year3,
        "2023" : year4
    }
    // L.control.layers(overlayMaps).addTo(myMap);
    L.control.layers(overlayMaps, {}, {
        collapsed: false
      }).addTo(myMap);
    stateDataGroupby = []

Promise.all([
    fetch(deathPath).then(data => data.json()),
    fetch(stateBoundariesPath).then(response => response.json())
    ]).then(([deathJson, responseJson]) => {


// WORKING WITH THE DATA
    // checking to see if the data got imported right
    // console.log(deathJson);

    // converting string data to numbers
    toNumber(deathJson);

    // seperating state data only
    // remember that this returns an array of arrays
    let stateDataGroupby = sortingYearandState(deathJson);
    console.log(stateDataGroupby)

    // this next part is going to be tedious
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

    // console.log(allDeaths2020)
    
   
    // chloropleth layer
        
        let stateJson = responseJson.features;  // narrowing down to just responses for simplicity
    L.geoJson(stateJson).addTo(myMap);          // adding the polygon layer to the map
 
        // adding the values we got from the death and medical cost array to the geojson file so it will be easier to create the popups
        // both the death json and states json are in alphabetical order (except with pr at the end) so the values match up
        addingKeys(stateJson, allDeaths2020, "2020");
        addingKeys(stateJson, allDeaths2021, "2021");
        addingKeys(stateJson, allDeaths2022, "2022");
        addingKeys(stateJson, allDeaths2023, "2023");

        console.log(stateJson);

        
        var radioButtons = document.querySelectorAll('input[class="leaflet-control-layers-selector"]'); // the html tag for the radio buttons, creates an array w each radio button inside
    radioButtons.forEach(radio => {
        radio.addEventListener('click', function () {
            selectedButton = this.nextElementSibling.textContent.trim(); // getting the name of the button
            choroplethMap(responseJson, selectedButton);
        })
    }); // this is the end of the addEventListener code fetch

    }).catch(error => console.error('Error fetching data:', error));  // this is the end of the promise.all

    myMap.invalidateSize();

// FUNCTIONS USED IN THE CODE ABOVE

// function for creating a choropleth map, to be used in the event listener
function choroplethMap(geojson, selectedButton) {
    // console.log()
    if (choroplethLayer) {
        myMap.removeLayer(choroplethLayer);
    }

    choroplethLayer = L.choropleth(geojson, {
        valueProperty: feature => (feature.properties[selectedButton].chron_causes / feature.properties[selectedButton].all_cause),
        scale: ["#ffffb2", "#b10026"],
        steps: 7,
        mode: 'q',
        style: {
            color: '#fff',
            weight: 2,
            fillOpacity: 0.8
        },
        onEachFeature: (feature, layer) => {    // changing the popup based on which button is selected
            layer.bindPopup(
                `<h1 style='text-align: center'> ${feature.properties.name}</h1>
                <table class="tg"><thead>
                    <tr>
                        <th class="tg-0lax"></th>
                        <th class="tg-0lax">Totals</th>
                        <th class="tg-0lax">% of All Causes</th>
                    </tr></thead>
                    <tbody>
                    <tr>
                        <td class="tg-0lax">All Causes</td>
                        <td class="tg-0lax">${feature.properties[selectedButton].all_cause}</td>
                    </tr>
                    <tr>
                        <td class="tg-0lax">Natural Causes</td>
                        <td class="tg-0lax">${feature.properties[selectedButton].nat_causes}</td>
                        <td class="tg-0lax">${(feature.properties[selectedButton].nat_causes / feature.properties[selectedButton].all_cause * 100).toFixed(2)}%</td>
                    </tr>
                    <tr>
                        <td class="tg-0lax">Chronic Causes</td>
                        <td class="tg-0lax">${feature.properties[selectedButton].chron_causes}</td>
                        <td class="tg-0lax">${(feature.properties[selectedButton].chron_causes / feature.properties[selectedButton].all_cause * 100).toFixed(2)}%</td>
                    </tr>
                    <tr>
                        <td class="tg-0lax">Non-Chronic Causes</td>
                        <td class="tg-0lax">${feature.properties[selectedButton].non_chron_causes}</td>
                        <td class="tg-0lax">${(feature.properties[selectedButton].non_chron_causes / feature.properties[selectedButton].all_cause * 100).toFixed(2)}%</td>
                    </tr>
                    </tbody>
                    </table>`
            )}
    }).addTo(myMap);
}
// function that converts string values to numbers
function toNumber(json) {
    // for every key that exists
    for (key in json[0]) {
        // replace the value of the key with a float, iterating over every index
        for (i = 0; i < json.length; i++) {
            if (key != "jurisdiction" && key != "week_end" // NaN keys in med death json
                && key != "region" && key != "sex" && key != "smoker") // NaN keys in cost json
            {
                json[i][key] = parseFloat(json[i][key]);
            }
        }
    }
}

// function to sort data by year and then by state
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

// function that sums up the costs for each year and category
function costSums(yearArray, costCategory) {
    let sumArray = []
    // for each state in the dataset
    for (state in yearArray) {
        let sum = 0;
        // and every week of data that was collected
        // we're using Alabama here because its the first state in the data set and all the states have the same number of recorded weeks
        for (week in yearArray.Alabama) {
            sum += yearArray[state][week][costCategory] // summing up
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