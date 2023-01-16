// File origin: VS1LAB A3, A4

/**
 * This script defines the main router of the GeoTag server.
 * It's a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/**
 * Define module dependencies.
 */

const express = require('express');
const bodyparser = require('body-parser');
const router = express.Router();

/**
 * The module "geotag" exports a class GeoTagStore. 
 * It represents geotags.
 */
// eslint-disable-next-line no-unused-vars
const GeoTag = require('../models/geotag');

/**
 * The module "geotag-store" exports a class GeoTagStore. 
 * It provides an in-memory store for geotag objects.
 */
// eslint-disable-next-line no-unused-vars
const GeoTagStore = require('../models/geotag-store');

router.use(express.json());
router.use(bodyparser.urlencoded({ extended: true }));

var tagStore = new GeoTagStore();
var entriesPerPage = 5;

// App routes (A3)

/**
 * Route '/' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests cary no parameters
 *
 * As response, the ejs-template is rendered without geotag objects.
 */

router.get('/', (req, res) => {
    res.render('index', { 
        taglist: [],
        latitude: "",
        longitude: "",
        taglist_json: ""
    });
});

// API routes (A4)

/**
 * Route '/api/geotags' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests contain the fields of the Discovery form as query.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * As a response, an array with Geo Tag objects is rendered as JSON.
 * If 'searchterm' is present, it will be filtered by search term.
 * If 'latitude' and 'longitude' are available, it will be further filtered based on radius.
 */

router.get('/api/geotags', (req, res) => {
    ///api/geotags?searchterm=home&latitude=49.01&longitude=8.4&page=1
    let results = tagStore.getNearbyGeoTags(req.query.latitude, req.query.longitude);

    if (req.query.searchterm) {
        results = tagStore.searchNearbyGeoTags(
            req.query.latitude, 
            req.query.longitude, 
            decodeURIComponent(req.query.searchterm) //decode hastag symbol
        );
    }
    let tagsAmount = results.length;

    let page = 1;
    if (req.query.page) {
        page = req.query.page;
    }
    let start = (page - 1) * entriesPerPage;
    let end = page * entriesPerPage;
    results = results.slice(start, end);

    results.push({amount: tagsAmount});

    res.json(results);
});


/**
 * Route '/api/geotags' for HTTP 'POST' requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests contain a GeoTag as JSON in the body.
 * (http://expressjs.com/de/4x/api.html#req.query)
 *
 * The URL of the new resource is returned in the header as a response.
 * The new resource is rendered as JSON in the response.
 */

router.post('/api/geotags', (req, res) => {
    let newId = tagStore.addGeoTag(req.body);
    res.setHeader("Content-Location", `${req.url}/${newId}`);
    res.status(201).json(tagStore.getGeoTagById(newId));
});


/**
 * Route '/api/geotags/:id' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 *
 * The requested tag is rendered as JSON in the response.
 */

router.get('/api/geotags/:id', (req, res) => {
    let id = req.params.id;
    if (!tagStore.getGeoTagById(id)) {
        res.status(404).end();
    } else {
        res.json(tagStore.getGeoTagById(id));
    }
});


/**
 * Route '/api/geotags/:id' for HTTP 'PUT' requests.
 * (http://expressjs.com/de/4x/api.html#app.put.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 * 
 * Requests contain a GeoTag as JSON in the body.
 * (http://expressjs.com/de/4x/api.html#req.query)
 *
 * Changes the tag with the corresponding ID to the sent value.
 * The updated resource is rendered as JSON in the response. 
 */

router.put('/api/geotags/:id', (req, res) => {
    let id = req.params.id;
    if (!tagStore.getGeoTagById(id)) {
        res.status(404).end();
    } else {
        tagStore.updateGeotag(id, req.body);
        res.status(202).json(tagStore.getGeoTagById(id));
    } 
});


/**
 * Route '/api/geotags/:id' for HTTP 'DELETE' requests.
 * (http://expressjs.com/de/4x/api.html#app.delete.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 *
 * Deletes the tag with the corresponding ID.
 * The deleted resource is rendered as JSON in the response.
 */

router.delete('/api/geotags/:id', (req, res) => {
    let id = req.params.id;
    let oldTag = tagStore.removeGeoTagById(req.params.id);
    if (!oldTag) {
        res.status(404).end();
    } else {
        res.json(oldTag);
    }
});

module.exports = router;
