// File origin: VS1LAB A2

/* eslint-disable no-unused-vars */

// This script is executed when the browser loads index.html.

// "console.log" writes to the browser's console. 
// The console window must be opened explicitly in the browser.
// Try to find this output in the browser...
console.log("The geoTagging script is going to start...");

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

        displayMap(helper.latitude, helper.longitude);
    }

    let latitude = $("#tagLatitude").val();
    let longitude = $("#tagLongitude").val();
    if (!latitude || !longitude) {
        console.log("update location");
        LocationHelper.findLocation(setLocation);
    } else {
        displayMap(latitude, longitude);
    }
}

function displayMap(latitude, longitude) {
    let taglist = $("#mapView").data("tags");
    if (!taglist) {
        taglist = [];
    }
    let mapManager = new MapManager("XtGxyGSmhZBkIbmGSOfBIoQ0Akq4OoUI");
    let mapUrl = mapManager.getMapUrl(parseFloat(latitude), parseFloat(longitude), taglist, 14);
    $("#mapView").attr("src", mapUrl);
}

// Wait for the page to fully load its DOM content, then call updateLocation
document.addEventListener("DOMContentLoaded", () => {
    updateLocation();
});