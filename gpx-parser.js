(function(){

	'use strict';

	function GPXParser() {
		this.parseJSON = function(jsonData) {
			try {
				if(!jsonData) {
					throw new Error('Error: No loaded data');
				}
				return _toGPX(jsonData);
			} catch(err) {
				console.error(err);
			}	
		};

		this.parseGPX = function(gpxData) {
			try{
				if(!gpxData) {
					throw new Error('No loaded data');
				}
				return _toJSON(gpxData);
			} catch(err) {
				console.error(err);
			}
		};

		var _toJSON = function(gpxData) {

			var jsonGPX = {};

			/* Init XML parser */
			var xmlDoc = new DOMParser().parseFromString(gpxData, "text/xml");

			var gpx = _parseRoot(xmlDoc);

			jsonGPX.metadata = _parseMetadata(gpx);
			jsonGPX.trk = _parseTrackData();

			var fileName = '';
			var descript = '';
			var author = '';
			var time = '';

			return jsonGPX;
		};

		var _toGPX = function(jsonData) {

			var creator = jsonData.gpx._creator;
			var metadata = jsonData.gpx.metadata;
			var trk = jsonData.gpx.trk;
			
			/* Create gpx document*/
			var gpxDoc = document.implementation.createDocument('', '', null);

			/* Initialize gpx element */
			var gpxElem = _createRoot(gpxDoc, creator);

			/* Initialize metadata */
			var metadataElem = gpxDoc.createElement('metadata');
			metadataElem = _createMetadata(gpxDoc, metadata, metadataElem);

			/* Initialize track info */
			var trkElem = gpxDoc.createElement('trk');
			trkElem = _createTrackData(gpxDoc, trk, trkElem);

			/* Mounting of the GPX tree */
			gpxElem.appendChild(metadataElem);
			gpxElem.appendChild(trkElem);

			return gpxElem;
		};

		var _createRoot = function(gpxDoc, creator) {

			/* Attributes for GXP 1.1 version */
			var VERSION = '1.1';
			var XMLNS_XSI = 'http://www.w3.org/2001/XMLSchema-instance';
			var XMLNS = 'http://www.topografix.com/GPX/1/1';
			var XSI_SCHEMALOCATION = 'http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd';

			var gxpElem = gpxDoc.createElement('gpx');
			gxpElem.setAttribute('version', VERSION);
			gxpElem.setAttribute('creator', creator); // Software that created your GPX document
			gxpElem.setAttribute('xmlns:xsi', XMLNS_XSI);
			gxpElem.setAttribute('xmlns', XMLNS);
			gxpElem.setAttribute('xsi:schemaLocation', XSI_SCHEMALOCATION);

			return gxpElem;
		};

		var _parseRoot = function(xmlDoc) {

			var gpx = xmlDoc.getElementsByTagName('gpx')[0];

			/* Check version */
			var version = gpx.getAttribute('version');

			if(version != '1.1') {
				throw new Error('The current version of the track is not supported');
			}

			return gpx;
		};

		var _createMetadata = function(gpxDoc, metadata, metadataElem) {

			var name = metadata.name;
			var descFile = metadata.desc;
			var author = metadata.author;
			var fileTime = metadata.time;

			/* The name of the GPX file */
			if(name) {
				var nameElem = gpxDoc.createElement('name');
				var nameVal = gpxDoc.createTextNode(name);

				nameElem.appendChild(nameVal);
				metadataElem.appendChild(nameElem);
			}

			/* A description of the contents of the GPX file */
			if(descFile) {
				var descElem = gpxDoc.createElement('desc');
				var descVal = gpxDoc.createTextNode(descFile);

				descElem.appendChild(descVal);
				metadataElem.appendChild(descElem);
			}

			/* Author name or URL */
			if(author.name) {
				var authorElem = gpxDoc.createElement('author');
				var authorNameElem = gpxDoc.createElement('name');
				var authorVal = gpxDoc.createTextNode(author.name);

				authorNameElem.appendChild(authorVal);
				authorElem.appendChild(authorNameElem);
				metadataElem.appendChild(authorElem);
			}

			/* The creation date of the file */
			if(fileTime) {
				var fileTimeElem = gpxDoc.createElement('time');
				var fileTimeVal = gpxDoc.createTextNode(fileTime);

				fileTimeElem.appendChild(fileTimeVal);
				metadataElem.appendChild(fileTimeElem);
			}

			return metadataElem;
		};

		var _parseMetadata = function(gpx) {
			/* Getting metadata values */
			var metadata = gpx.getElementsByTagName('metadata');

			if(!metadata) {
				throw new Error('No important element: metadata');
			}
		};

		var _createTrackData = function(gpxDoc, trk, trkElem) {
			var name = trk.name;
			var cmt = trk.cmt;
			var descTrack = trk.desc;
			var number = trk.number;
			var trkseg = trk.trkseg;
			var trkpt = trk.trkseg.trkpt;

			/* GPS name of track */
			if(name) {
				var nameElem = gpxDoc.createElement('name');
				var nameVal = gpxDoc.createTextNode(name);

				nameElem.appendChild(nameVal);
				trkElem.appendChild(nameElem);
			}

			/* GPS comment for track */
			if(cmt) {
				var cmtElem = gpxDoc.createElement('cmt');
				var cmtVal = gpxDoc.createTextNode(cmt);

				cmtElem.appendChild(cmtVal);
				trkElem.appendChild(cmtElem);
			}

			/* A description of the contents of the GPX file */
			if(descTrack) {
				var descElem = gpxDoc.createElement('desc');
				var descVal = gpxDoc.createTextNode(descTrack);

				descElem.appendChild(descVal);
				trkElem.appendChild(descElem);
			}

			/* GPS track number */
			if(number) {
				var numberElem = gpxDoc.createElement('number');
				var numberVal = gpxDoc.createTextNode(number);

				numberElem.appendChild(numberVal);
				trkElem.appendChild(numberElem);
			}

			/* Create trkpt */
			var trkptElem,
				latVal,
				lonVal,
				eleElem,
				eleVal,
				ptTimeElem,
				ptTimeVal;

			/* Initialize tack segments info */
			var trksegElem = gpxDoc.createElement('trkseg');

			for (var pt = 0; trkpt.length > pt; pt++) {
				trkptElem = gpxDoc.createElement('trkpt');

				/* Get LatLng attributes */
				latVal = trkpt[pt]._lat;
				lonVal = trkpt[pt]._lon;

				/* Get elevation/altitude value */
				eleElem = gpxDoc.createElement('ele');
				eleVal = gpxDoc.createTextNode(trkpt[pt].ele);
				eleElem.appendChild(eleVal);

				/* Get point time */
				ptTimeElem = gpxDoc.createElement('time');
				ptTimeVal = gpxDoc.createTextNode(trkpt[pt].time);
				ptTimeElem.appendChild(ptTimeVal);

				/* Mounting of the point tree */
				trkptElem.setAttribute('lat', latVal);
				trkptElem.setAttribute('lon', lonVal);
				trkptElem.appendChild(eleElem);
				trkptElem.appendChild(ptTimeElem);

				trksegElem.appendChild(trkptElem);
			}

			trkElem.appendChild(trksegElem);

			return trkElem;
		};

		var _parseTrackData = function() {

		};
	};

	/* Example */
	var jsonExampleData = {
		"gpx": {
			"_creator": "Software that created your GPX document",
			"metadata": {
				"name": "The name of the GPX file",
			 	"desc": "A description of the contents of the GPX file",
				"author": { "name": "Author name" },
			 	"time": "2007-10-02T07:51:30Z"
			},
			"trk": {
				"name": "GPS name of track",
				"cmt": "GPS comment for track",
				"desc": "User description of track",
				"number": "1",
				"trkseg": {
					"trkpt": [{
						"_lat": "46.57608333",
						"_lon": "8.89241667",
						"ele": "2373",
						"time": "2007-10-02T07:51:30Z"
				  	}, {
						"_lat": "46.57619444",
						"_lon": "8.89252778",
						"ele": "2375",
						"time": "2007-10-02T07:56:30Z"
				  	}, {
						"_lat": "46.57641667",
						"_lon": "8.89266667",
						"ele": "2372",
						"time": "2007-10-02T07:59:30Z"
					}]
				}
			}
		}
	};

	var gpxExampleData = '<gpx version="1.1" creator="Software that created your GPX document" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://www.topografix.com/GPX/1/1" xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd"><metadata><name>The name of the GPX file</name><desc>A description of the contents of the GPX file</desc><author><name>Author name</name></author><time>2007-10-02T07:51:30Z</time></metadata><trk><name>GPS name of track</name><cmt>GPS comment for track</cmt><desc>User description of track</desc><number>1</number><trkseg><trkpt lat="46.57608333" lon="8.89241667"><ele>2373</ele><time>2007-10-02T07:51:30Z</time></trkpt><trkpt lat="46.57619444" lon="8.89252778"><ele>2375</ele><time>2007-10-02T07:56:30Z</time></trkpt><trkpt lat="46.57641667" lon="8.89266667"><ele>2372</ele><time>2007-10-02T07:59:30Z</time></trkpt></trkseg></trk></gpx>';


	var GParser = new GPXParser();
	GParser.parseGPX(gpxExampleData);
	console.log(GParser.parseJSON(jsonExampleData));

})();

