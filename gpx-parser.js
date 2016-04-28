function gpxParser() {
	this.parseGPX = function() {

		/* Example */
		var params = {
			name: 'TipTop track',
			trkpts: [{
				attributes: {
					lat: '46.57608333',
					lon: '8.89241667' 
				},
				ele: '2373',
				time: '2007-10-02T07:51:30Z'
			}, {
				attributes: {
					lat: '46.57619444',
					lon: '8.89252778' 
				},
				ele: '2375',
				time: '2007-10-02T07:56:30Z'
			}, {
				attributes: {
					lat: '46.57641667',
					lon: '8.89266667' 
				},
				ele: '2372',
				time: '2007-10-02T07:59:30Z'
			}]
		};

		return _toGPX(params);
	}

	this.parseJSON = function() {
		/* Will be implemented as soon as possible */
	}

	var _toJSON = function(track) {
		var parser = new DOMParser();
	};

	var _toGPX = function(params) {

		var name = params.name;
		var trkpts = params.trkpts;
		
		/* Create gpx document*/
		var gpxDoc = document.implementation.createDocument('', '', null);

		var gpxElem = _createRoot(gpxDoc);
		var metadataElem = gpxDoc.createElement('metadata');

		if(name) {
			var nameElem = gpxDoc.createElement('name');
			var nameVal = gpxDoc.createTextNode(name);
			nameElem.appendChild(nameVal);
		}

		var trkElem = gpxDoc.createElement('trk');
		var trksegElem = gpxDoc.createElement('trkseg');

		trksegElem = _createTrkPts(gpxDoc, trkpts, trksegElem);

		/* Mounting of the GPX tree */
		metadataElem.appendChild(nameElem);
		gpxElem.appendChild(metadataElem);
		trkElem.appendChild(trksegElem);
		gpxElem.appendChild(trkElem);

		return gpxElem;
	};

	var _createRoot = function(gpxDoc) {

		/* Attributes for GXP 1.1 version */
		var VERSION = '1.1';
		var CREATOR = ''; //Creator name. Example: Application name.
		var XMLNS_XSI = 'http://www.w3.org/2001/XMLSchema-instance';
		var XMLNS = 'http://www.topografix.com/GPX/1/1';
		var XSI_SCHEMALOCATION = 'http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd';

		var gxpElem = gpxDoc.createElement('gpx');
		gxpElem.setAttribute('version', VERSION);
		gxpElem.setAttribute('creator', CREATOR);
		gxpElem.setAttribute('xmlns:xsi', XMLNS_XSI);
		gxpElem.setAttribute('xmlns', XMLNS);
		gxpElem.setAttribute('xsi:schemaLocation', XSI_SCHEMALOCATION);

		return gxpElem;
	};

	var _createMetadata = function() {

	};

	var _createTrkPts = function(gpxDoc, trkpts, trksegElem) {
		var trkpt,
			latVal,
			lonVal,
			eleElem,
			eleVal,
			timeElem,
			timeVal;

		for (var pt = 0; trkpts.length > pt; pt++) {
			trkpt = gpxDoc.createElement('trkpt');

			/* Get LatLng attributes */
			latVal = trkpts[pt].attributes.lat;
			lonVal = trkpts[pt].attributes.lon;

			/* Get elevation/altitude value */
			eleElem = gpxDoc.createElement('ele');
			eleVal = gpxDoc.createTextNode(trkpts[pt].ele);
			eleElem.appendChild(eleVal);

			/* Get point time */
			timeElem = gpxDoc.createElement('time');
			timeVal = gpxDoc.createTextNode(trkpts[pt].time);
			timeElem.appendChild(timeVal);

			/* Mounting of the point tree */
			trkpt.setAttribute('lat', latVal);
			trkpt.setAttribute('lon', lonVal);
			trkpt.appendChild(eleElem);
			trkpt.appendChild(timeElem);

			trksegElem.appendChild(trkpt);
		}

		return trksegElem;
	};
};


var gpxParser =  new gpxParser()
console.log(gpxParser.createGPX());