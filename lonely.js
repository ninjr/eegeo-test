'use_strict';

const promise = require("Promise");

// Module -- Place
function Place(name, lat, lon) {
    this.name = name;
    this.lat = lat;
    this.lon = lon;
    this.root = lat-lon;
}

Place.prototype.distance = function(placeB) {
    var a = this.lat - placeB.lat
    var b = this.lon - placeB.lon

    var c = Math.sqrt( a*a + b*b );
    return c
// 
}

// Module -- Place Parser
function PlaceParser(inputFileName) {
    this._fileName = inputFileName
}

PlaceParser.prototype.parse = function() {
    var fname = this._fileName;
    var promise = new Promise(function (resolve, reject) {
        var parsedItems = new Array();
        var lineReader = require('readline').createInterface({
            input: require('fs').createReadStream(fname)
        });

        lineReader.on('line', function (line) {
            var split = line.split(' ');
            var newPlace = new Place(split[0], split[1], split[2]);
            parsedItems.push(newPlace);
        });

        lineReader.on("close", function() {
            resolve(parsedItems);
        })
    });

    return promise;
}


function Logger() {}
Logger.prototype.print = function(text, shouldReturn = false) {
    const returnValue = (shouldReturn) ? "    \n" : "    \r";
    process.stdout.write(text + returnValue);
}


// Exports
module.exports = PlaceParser;
module.exports = Place;
module.exports = Logger;

// Execution
const log = new Logger;
var arguments = process.argv;
if (arguments.length > 2) {
    log.print("Parsing started...");
    var parse = new PlaceParser(arguments[2]).parse();
    parse.then(function(data, int) {
        log.print(data.length + " places parsed", true);
        var superDistance = 0;
        var superPlaceA = null;
        var superPlaceB = null;
        
        data.forEach(function(place, int) {
            var minorDistance = 0;
            var minorPlace = null;

            log.print("-- " + int + "/" + data.length + " -- processed");

            data.forEach(function(placeB, int) {
                var compared = place.distance(placeB);
                if(compared > minorDistance) {
                    minorDistance = compared;
                    minorPlace = placeB
                }
            });

            if(int == data.length - 1) {
                if(minorDistance > superDistance) {
                    superDistance = minorDistance
                    superPlaceA = place;
                    superPlaceB = minorPlace;
                }
            }
        });

        log.print("Finished Process", true);
        log.print("The greatest distance is [" + superDistance + "] between ["+ superPlaceA.name +"] and [" + superPlaceB.name + "]", true);

    })
} else {
    console.log("######### PLEASE PROVIDE LOCATION OF INPUT FILE ex: ./problem.txt #########");
}