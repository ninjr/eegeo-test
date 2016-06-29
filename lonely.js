'use_strict';

const q = require('Q');

// Module -- Place
function Place(name, lat, lon) {
    this.name = name;
    this.lat = lat;
    this.lon = lon;
}

Place.prototype.data = {name : this.name, lat: this.lat, lon : this.lon};

// Module -- Place Parser
function PlaceParser(inputFileName) {
    this._fileName = inputFileName
}

PlaceParser.prototype.parse = function() {
    var parsedItems = new Array();
    var deferred = Q.defer();
    var lineReader = require('readline').createInterface({
        input: require('fs').createReadStream(this._fileName)
    });

    lineReader.on('line', function (line) {
        var split = line.split(' ');
        var newPlace = new Place(split[0], split[1], split[2]);
        parsedItems.push(newPlace);
    });

    lineReader.on("close", function() {
        deffered.resolve(parsedItems);
    })

    return deffered;
}

// Exports
module.exports = PlaceParser;
module.exports = Place;

// Execution
var arguments = process.argv;
if (arguments.length > 2) {
    var parse = new PlaceParser(arguments[2]).parse();
    console.log(parse);
} else {
    console.log("######### PLEASE PROVIDE LOCATION OF INPUT FILE ex: ./problem.txt #########");
}