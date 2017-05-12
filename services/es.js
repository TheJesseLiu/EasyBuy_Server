var elasticClient = require('elasticsearch').Client({
    hosts: 'https://search-goodies-yd7w3wdxqefjfkxzr2nq345ybi.us-east-1.es.amazonaws.com',
    connectionClass: require('http-aws-es'),
    amazonES: {
        region: require('./../config/aws-config.json').region,
        accessKey: require('./../config/aws-config.json').accessKeyId,
        secretKey: require('./../config/aws-config.json').secretAccessKey

    }
});

var indexName = "test-index";
var indexType = "goodie";

// Delete an existing index
function deleteIndex() {
    return elasticClient.indices.delete({
        index: indexName
    });
}
exports.deleteIndex = deleteIndex;

// Create the index
function initIndex() {
    return elasticClient.indices.create({
        index: indexName
    });
}
exports.initIndex = initIndex;

// Check if the index exists
function indexExists() {
    return elasticClient.indices.exists({
        index: indexName
    });
}
exports.indexExists = indexExists;

// initialize the map
function initMapping() {
    console.log("init mapping");
    return elasticClient.indices.putMapping({
        index: indexName,
        type: indexType,
        body: {
            properties: {
                userName: {
                    type: "string",
                    index: "analyzed"
                },
                itemName: {
                    type: "string",
                    index: "analyzed"
                },
                tag: {
                    type: "string",
                    index: "analyzed"
                },
                geo: {
                    type: "geo_point"
                },
                created: {
                    type: "date",
                    index: "not_analyzed"
                },
                description: {
                    type: "string",
                    index: "analyzed"
                },
                link: {
                    type: "string",
                    index: "analyzed"
                },
                contact: {
                    type: "string"
                },
                price: {
                    "type": "scaled_float",
                    "scaling_factor": 100
                }
            }
        }
    });
}
exports.initMapping = initMapping;

// Add document to the index
function addDocument(document) {
    return elasticClient.index({
        index: indexName,
        type: indexType,
        body: {
            userName: document.username,
            itemName: document.title,
            tag: document.tag,
            geo: {
                lat: document.geo[0],
                lon: document.geo[1]
            },
            created: document.created,
            description: document.description,
            link: document.url,
            price: document.price,
            contact: document.contact
        }
    });
}
exports.addDocument = addDocument;


// Get all documents
function getAllContent(callback) {
    var allResults = [];
    elasticClient.search({
        index: indexName,
        type: indexType,
        scroll: "30s",
        body: {
            query: {
                match_all: {
                }
            }
        }
    }, function getMoreUntilDone(error, response) {
        // collect the title from each response
        response.hits.hits.forEach(function (hit) {
            // console.log(hit);
            allResults.push(hit._source);
        });

        if (response.hits.total !== allResults.length) {
            // now we can call scroll over and over
            elasticClient.scroll({
                scrollId: response._scroll_id,
                scroll: '30s'
            }, getMoreUntilDone);
        } else {
            callback(allResults);
        }
    });
}
exports.getAllContent = getAllContent;

// Search through title
function searchTitle(input, callback) {
    var allResults = [];
    elasticClient.search({
        index: indexName,
        type: indexType,
        scroll: "30s",
        body: {
            query: {
                match: {
                    itemName: input
                }
            }
        }
    }, function getMoreUntilDone(error, response) {
        // collect the title from each response
        response.hits.hits.forEach(function (hit) {
            allResults.push(hit._source);
        });

        if (response.hits.total !== allResults.length) {
            // now we can call scroll over and over
            elasticClient.scroll({
                scrollId: response._scroll_id,
                scroll: '30s'
            }, getMoreUntilDone);
        } else {
            callback(allResults);
        }
    });
}
exports.searchTitle = searchTitle;

// Search through description
function searchDescription(input, callback) {
    var allResults = [];
    elasticClient.search({
        index: indexName,
        type: indexType,
        scroll: "30s",
        body: {
            query: {
                match: {
                    description: input
                }
            }
        }
    }, function getMoreUntilDone(error, response) {
        // collect the title from each response
        response.hits.hits.forEach(function (hit) {
            allResults.push(hit._source);
        });

        if (response.hits.total !== allResults.length) {
            // now we can call scroll over and over
            elasticClient.scroll({
                scrollId: response._scroll_id,
                scroll: '30s'
            }, getMoreUntilDone);
        } else {
            callback(allResults);
        }
    });
}
exports.searchDescription = searchDescription;

// Search through title and description
function searchTitleDescription(input, callback) {
    var allResults = [];
    elasticClient.search({
        index: indexName,
        type: indexType,
        scroll: "30s",
        body: {
            query: {
                bool: {
                    should: [
                        { match: { itemName: input } },
                        { match: { description: input } }
                    ]
                }
            }
        }
    }, function getMoreUntilDone(error, response) {
        // collect the title from each response
        response.hits.hits.forEach(function (hit) {
            allResults.push(hit._source);
        });

        if (response.hits.total !== allResults.length) {
            // now we can call scroll over and over
            elasticClient.scroll({
                scrollId: response._scroll_id,
                scroll: '30s'
            }, getMoreUntilDone);
        } else {
            callback(allResults);
        }
    });
}
exports.searchTitleDescription = searchTitleDescription;

// Search through documents by geo
function searchGeo(distance, lat, lon, callback) {
    var allResults = [];
    elasticClient.search({
        index: indexName,
        type: indexType,
        scroll: "30s",
        body: {
            query: {
                filtered: {
                    filter: {
                        geo_distance: {
                            distance: distance,
                            geo: {
                                lat: lat,
                                lon: lon
                            }
                        }
                    }
                }
            }
        }
    }, function getMoreUntilDone(error, response) {
        // collect the title from each response
        response.hits.hits.forEach(function (hit) {
            allResults.push(hit._source);
        });

        if (response.hits.total !== allResults.length) {
            // now we can call scroll over and over
            elasticClient.scroll({
                scrollId: response._scroll_id,
                scroll: '30s'
            }, getMoreUntilDone);
        } else {
            callback(allResults);
        }
    });
}
exports.searchGeo = searchGeo;

// Search through documents by created time
function searchCreated(period, callback) {
    var allResults = [];
    elasticClient.search({
        index: indexName,
        type: indexType,
        scroll: "30s",
        body: {
            query: {
                constant_score: {
                    filter: {
                        range: {
                            created: {
                                gt: "now-" + period
                            }
                        }
                    }
                }
            }
        }
    }, function getMoreUntilDone(error, response) {
        // collect the title from each response
        response.hits.hits.forEach(function (hit) {
            allResults.push(hit._source);
        });

        if (response.hits.total !== allResults.length) {
            // now we can call scroll over and over
            elasticClient.scroll({
                scrollId: response._scroll_id,
                scroll: '30s'
            }, getMoreUntilDone);
        } else {
            callback(allResults);
        }
    });
}
exports.searchCreated = searchCreated;

// Search through documents by created time
function count() {
    return elasticClient.count({
        index: indexName
    });
}
exports.count = count;
