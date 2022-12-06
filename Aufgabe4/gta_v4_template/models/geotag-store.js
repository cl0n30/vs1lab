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
     * @param {number} latitude 
     * @param {number} longitude 
     * @returns {Array<GeoTag>}
     */
    getNearbyGeoTags(latitude, longitude) {
        if (latitude == undefined || longitude == undefined) {
            return this.#geoTags;
        }
        //1 degree of latitude ~ 111111 m in y direction
        //1 degree of longitude ~ 111111 * cos(lat) m in x direction
        const oneDegreeInMeters = 111111;
        const latOffset = this.#nearbyRadius / oneDegreeInMeters;
        const lonOffset = this.#nearbyRadius / (oneDegreeInMeters * Math.cos(latitude));

        let maxLat = parseFloat(latitude) + parseFloat(latOffset);
        let minLat = parseFloat(latitude) - parseFloat(latOffset);
        let maxLon = parseFloat(longitude) + parseFloat(lonOffset);
        let minLon = parseFloat(longitude) - parseFloat(lonOffset);

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
     * @param {number} latitude 
     * @param {number} longitude 
     * @param {string} query 
     * @returns {Array<GeoTag>}
     */
    searchNearbyGeoTags(latitude, longitude, query) {
        let nearbyTags = this.getNearbyGeoTags(latitude, longitude);
        if (nearbyTags.length == 0) {
            return [];
        }

        let foundTags = nearbyTags.filter(tag => tag.name.toLowerCase().includes(query.toLowerCase()) 
            || tag.hashtag.toLowerCase().includes(query.toLowerCase()));
        return foundTags;
    }

}

module.exports = InMemoryGeoTagStore