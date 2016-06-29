import sys
import string
import math
from fractions import gcd

class Lonely:

    processPlaceArray = []

    def __init__(self, inputFileName):
        self.inputFileName = inputFileName
        self.processFile()

    def processFile(self):
        print "Processing File : %s" % self.inputFileName
        with open(self.inputFileName) as file:
            for l in file:
                self.processLine(l)
        
        self.processEuclidean()

    def processLine(self, line):
        splitLine = line.split(' ')
        name = self.normaliseString(splitLine[0])
        lat = self.normaliseString(splitLine[1])
        lon = self.normaliseString(splitLine[2])
        self.processPlaceArray.append({"name": name, "lat": lat, "lon": lon})
    
    def processEuclidean(self):
        'process each place, loop remaining (excluding) find largest distance, at end produce final check for each place'
        largestFromPlace = []
        lengthOfPlaceArray = len(self.processPlaceArray)

        for (placeIndex, place) in enumerate(self.processPlaceArray):
            largestDistancePlace = {}
            largestDistancePlain = "0%"
            largestDistanceBetweenPoints = 0.0
            
            percentage = "{0:.0f}%".format(100 * float(placeIndex)/float(lengthOfPlaceArray))

            print percentage,"complete                          \r",

            pointA = [float(place["lat"]), float(place["lon"])]

            for subPlace in self.processPlaceArray:
                if(place['name'] != subPlace['name']):
                    pointB = [float(subPlace["lat"]), float(subPlace["lon"])]
                    dist = self.distance(pointA, pointB)
                    if(dist > largestDistanceBetweenPoints):
                        largestDistanceBetweenPoints = dist
                        largestDistancePlace = subPlace
            
            largestFromPlace.append({"distance" : largestDistanceBetweenPoints, "origin" : place, "destination" : largestDistancePlace});

        largestDistance = 0.0
        largestInCollection = {}
        for placeCollection in largestFromPlace:
            dist = placeCollection["distance"]
            if(dist > largestDistance):
                largestDistance = dist
                largestInCollection = placeCollection
            
        print "Result: Place[%s] has a distance of [%s] from Place[%s]" % (largestInCollection["origin"]["name"], largestInCollection["distance"], largestInCollection["destination"]["name"])
              
            
    def distance(self, pointA, pointB):
        return math.sqrt((pointA[0] - pointB[0])**2 + (pointA[1] - pointB[1])**2)

    def normaliseString(self, variable):
        return variable.strip("\n").strip("\r")


if not sys.argv[1]:
    print "Please provide an input file name ex: input.txt"
else:
    Lonely(sys.argv[1]);



