// File origin: VS1LAB A2

/* eslint-disable no-unused-vars */

// This script is executed when the browser loads index.html.

// "console.log" writes to the browser's console. 
// The console window must be opened explicitly in the browser.
// Try to find this output in the browser...
console.log("The geoTagging script is going to start...");

class GeoTag {

    /**
     * 
     * @param {string} name 
     * @param {number} latitude 
     * @param {number} longitude 
     * @param {string} hashtag 
     */
    constructor(name, latitude, longitude, hashtag) {
        this.name = name;
        this.latitude = latitude;
        this.longitude = longitude;
        this.hashtag = hashtag;
    }
    
}

/**
 * A function to retrieve the current location and update the page.
 * It is called once the page has been fully loaded.
 */
function updateLocation() {
    /**
     * Sets the location from the helper in the corresponding html input fields
     * @param {LocationHelper} helper
     */
    function setLocation(helper) {
        $("#tagLatitude").val(helper.latitude);
        $("#tagLongitude").val(helper.longitude);

        $("#discoveryLatitude").val(helper.latitude);
        $("#discoveryLongitude").val(helper.longitude);

        displayMap($("#mapView").data("tags"), helper.latitude, helper.longitude);
    }

    let latitude = $("#tagLatitude").val();
    let longitude = $("#tagLongitude").val();
    if (!latitude || !longitude) {
        console.log("update location");
        LocationHelper.findLocation(setLocation);
    } else {
        displayMap($("#mapView").data("tags"), latitude, longitude);
    }
}

function displayMap(taglist, latitude, longitude) {
    if (!taglist) {
        taglist = [];
    }
    let mapManager = new MapManager("XtGxyGSmhZBkIbmGSOfBIoQ0Akq4OoUI");
    let mapUrl = mapManager.getMapUrl(parseFloat(latitude), parseFloat(longitude), taglist, 14);
    $("#mapView").attr("src", mapUrl);
}

async function onTaggingFormSubmit() {
    let latitude = document.getElementById("tagLatitude").value;
    let longitude = document.getElementById("tagLongitude").value;
    let name = document.getElementById("name").value;
    let hashtag = document.getElementById("hashtag").value;
    let tag = new GeoTag(name, latitude, longitude, hashtag);

    let response = await fetch("http://localhost:3000/api/geotags", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(tag)
    });

    let url = `http://localhost:3000/api/geotags?latitude=${latitude}&longitude=${longitude}`;

    response = await fetch(url);

    document.getElementById("name").value = "";
    document.getElementById("hashtag").value = "";

    return await response.json();
}

async function onDiscoveryFormSubmit() {
    let latitude = document.getElementById("discoveryLatitude").value;
    let longitude = document.getElementById("discoveryLongitude").value;
    let searchterm = document.getElementById("searchterm").value;
    let url = "http://localhost:3000/api/geotags?";

    if (searchterm) {
        url += `searchterm=${encodeURIComponent(searchterm)}&`; //encode hashtag symbol
    }

    if (latitude && longitude) {
        url += `latitude=${latitude}&longitude=${longitude}`;
    }
    let response = await fetch(url);
    return await response.json();
}

/**
 * Adds a new geotag to the displayed list
 * @param {GeoTag} tag 
 */
function addTagToList(tag) {
    let tagList = document.getElementById("discoveryResults");
    let li = document.createElement("li");
    li.innerHTML = `${tag.name} (${tag.latitude},${tag.longitude}) ${tag.hashtag}`;
    tagList.appendChild(li);
}

/**
 * Replaces the displayed taglist with a new list consisting of the given tags
 * @param {Array<GeoTag>} tags 
 */
function displayNewTagList(tags) {
    let tagList = document.getElementById("discoveryResults");
    let listElements = [];
    tags.forEach(tag => {
        let li = document.createElement("li");
        li.innerHTML = `${tag.name} (${tag.latitude},${tag.longitude}) ${tag.hashtag}`;
        listElements.push(li);
    });
    tagList.replaceChildren(...listElements);
}

// Wait for the page to fully load its DOM content, then call updateLocation
document.addEventListener("DOMContentLoaded", () => {
    updateLocation();

    document.getElementById("tag-form").addEventListener("submit", (event) => {
        event.preventDefault();
        onTaggingFormSubmit()
            .then(response => addTagToList(response))
            .catch(err => alert(err));
    });

    document.getElementById("discoveryFilterForm").addEventListener("submit", (event) => {
        event.preventDefault();
        onDiscoveryFormSubmit()
            .then(response => displayNewTagList(response))
            .catch(err => alert(err));
    });
});