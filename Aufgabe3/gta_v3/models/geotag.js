// File origin: VS1LAB A3

/**
 * This script is a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/** * 
 * A class representing geotags.
 * GeoTag objects should contain at least all fields of the tagging form.
 */
class GeoTag {

    /**
     * 
     * @param {string} name 
     * @param {number} lat 
     * @param {number} lon 
     * @param {string} hashtag 
     */
    constructor(name, lat, lon, hashtag) {
        this.name = name;
        this.lat = lat;
        this.lon = lon;
        this.hashtag = hashtag;
    }
    
}

module.exports = GeoTag;
