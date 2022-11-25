// File origin: VS1LAB A3

const GeoTag = require("./geotag");
const GeoTagExamples = require("./geotag-examples");

/**
 * This script is a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/**
 * A class for in-memory-storage of geotags
 * 
 * Use an array to store a multiset of geotags.
 * - The array must not be accessible from outside the store.
 * 
 * Provide a method 'addGeoTag' to add a geotag to the store.
 * 
 * Provide a method 'removeGeoTag' to delete geo-tags from the store by name.
 * 
 * Provide a method 'getNearbyGeoTags' that returns all geotags in the proximity of a location.
 * - The location is given as a parameter.
 * - The proximity is computed by means of a radius around the location.
 * 
 * Provide a method 'searchNearbyGeoTags' that returns all geotags in the proximity of a location that match a keyword.
 * - The proximity constrained is the same as for 'getNearbyGeoTags'.
 * - Keyword matching should include partial matches from name or hashtag fields. 
 */
class InMemoryGeoTagStore{
    #geoTags = [];
    #nearbyRadius = 500;

    constructor() {
        let exampleTags = GeoTagExamples.tagList;
        exampleTags.forEach((elem) => {
            let tag = new GeoTag(elem[0], elem[1], elem[2], elem[3]);
            this.#geoTags.push(tag);
        });
    }

    /**
     * 
     * @param {GeoTag} geoTag 
     */
    addGeoTag(geoTag) {
        this.#geoTags.push(geoTag);
    }

    /**
     * 
     * @param {string} geoTag 
     */
    removeGeoTag(tagName) {
        for (let i = 0; i < this.#geoTags.length; i++) {
            if (this.#geoTags[i].name == tagName) {
                this.#geoTags.splice(i, 1);
            }
        }
    }

    /**
     * 
     * @param {GeolocationPosition} location 
     * @returns {Array<GeoTag>}
     */
    getNearbyGeoTags(location) {
        let lat = location.coords.latitude; 
        let lon = location.coords.longitude;

        //1 degree of latitude ~ 111111 m in y direction
        //1 degree of longitude ~ 111111 * cos(lat) m in x direction
        const oneDegreeInMeters = 111111;
        const latOffset = this.#nearbyRadius / oneDegreeInMeters;
        const lonOffset = this.#nearbyRadius / (oneDegreeInMeters * Math.cos(lat));

        let maxLat = lat + latOffset;
        let minLat = lat - latOffset;
        let maxLon = lon + lonOffset;
        let minLon = lon - lonOffset;

        let nearbyTags = [];
        this.#geoTags.forEach((tag) => {
            let isInRadius = (tag.latitude <= maxLat) && (tag.latitude >= minLat) 
                && (tag.longitude <= maxLon) && (tag.longitude >= minLon);

            if (isInRadius) {
                nearbyTags.push(tag);
            }
        });
        return nearbyTags;
    }

    /**
     * 
     * @param {GeolocationPosition} location 
     * @param {string} query 
     * @returns {Array<GeoTag>}
     */
    searchNearbyGeoTags(location, query) {
        let nearbyTags = this.getNearbyGeoTags(location);
        if (nearbyTags.length == 0) {
            return [];
        }

        let foundTags = nearbyTags.filter(tag => tag.name.startsWith(query) || tag.hashtag.startsWith(query));
        return foundTags;
    }

}

module.exports = InMemoryGeoTagStore
