// File origin: VS1LAB A3

const GeoTag = require("./geotag");
const { tagList } = require("./geotag-examples");
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
    #geoTags = new Map();
    #nearbyRadius = 500;
    #id = 1;
    #current = [];

    constructor() {
        let exampleTags = GeoTagExamples.tagList;
        exampleTags.forEach((elem) => {
            let tag = new GeoTag(elem[0], elem[1], elem[2], elem[3]);
            this.#geoTags.set(this.#id, tag);
            this.#current[this.#id - 1] = tag;
            this.#id++;
        });
    }

    /**
     * 
     * @param {GeoTag} geoTag 
     * @return this
     */
    addGeoTag(geoTag) {
        let newId = this.#id++;
        this.#geoTags.set(newId, geoTag);
        this.#current = [...this.#geoTags.values()]
        return newId;
    }

    /**
     * 
     * @param {string} geoTag 
     */
    removeGeoTag(tagName) {
        this.#geoTags.forEach((k, v) => {
            if (v.name == tagName) {
                this.#geoTags.delete(k);
                return;
            }
        });
        this.#current = [...this.#geoTags.values()]
    }

    /**
     * 
     * @param {number} id
     * @param {GeoTag} geoTag 
     */
    updateGeotag(id, geoTag) {
        this.#geoTags.set(parseInt(id), geoTag);
        this.#current = [...this.#geoTags.values()]
    }

    /**
     * 
     * @param {number} id 
     * @returns {GeoTag}
     */
    removeGeoTagById(id) {
        let oldElement = this.getGeoTagById(id);
        this.#geoTags.delete(parseInt(id));
        this.#current = [...this.#geoTags.values()]
        return oldElement;
    }

    /**
     * 
     * @param {number} id 
     * @returns {GeoTag}
     */
    getGeoTagById(id) {
        return this.#geoTags.get(parseInt(id));
    }

    /**
     * 
     * @param {number} latitude 
     * @param {number} longitude 
     * @returns {Array<GeoTag>}
     */
    getNearbyGeoTags(latitude, longitude) {
        if (latitude == undefined || longitude == undefined) {
            this.#current = [...this.#geoTags.values()];
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

        this.#current = [...this.#geoTags.values()].filter(tag => 
            (tag.latitude <= maxLat) && (tag.latitude >= minLat) 
            && (tag.longitude <= maxLon) && (tag.longitude >= minLon));             
    }

    /**
     * 
     * @param {number} latitude 
     * @param {number} longitude 
     * @param {string} query 
     */
    searchNearbyGeoTags(latitude, longitude, query) { 
        this.getNearbyGeoTags(latitude, longitude);
        let nearbyTags = this.#current;
        
        this.#current = nearbyTags.filter(tag => tag.name.toLowerCase().includes(query.toLowerCase()) 
                        || tag.hashtag.toLowerCase().includes(query.toLowerCase()));
    }

    /**
     * 
     * @param {number} page 
     * @param {number} pagelength 
     */
    getCurrent(page, pagelength) {
        if (this.#current.length < (page - 1) * pagelength || page < 1) {
            console.error("not enough error");
        }
        let tags = [];
        for (let i = 0; i < pagelength; i++) {
            if (this.#current[i + (page - 1) * pagelength]) {
                tags[i] = this.#current[i + (page - 1) * pagelength];
            }
        }
        return tags;
    }

    getCurrentSize() {
        return this.#current.length;
    }

    getCurrentPages(pagelength) {
        if (this.#current.length % pagelength == 0) {
            return this.#current.length / pagelength;
        }
        return (this.#current.length / pagelength + 1);
    }

}

module.exports = InMemoryGeoTagStore
