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

			var jsonGPX = {
				"gpx" : {}
			};

			/* Init XML parser */
			var xmlDoc = new DOMParser().parseFromString(gpxData, "text/xml");

			var gpx = _parseRoot(xmlDoc, jsonGPX);
			jsonGPX.gpx.metadata = _parseMetadata(gpx);
			jsonGPX.gpx.trk = _parseTrackData(gpx);

			return JSON.stringify(jsonGPX);
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

		var _parseRoot = function(xmlDoc, jsonGPX) {

			var gpx = xmlDoc.getElementsByTagName('gpx')[0];

			/* Check version */
			var version = gpx.getAttribute('version');
			if(version != '1.1') {
				throw new Error('The current version of the track is not supported');
			}
			jsonGPX.gpx.version = version;

			var creator = gpx.getAttribute('creator');
			if(creator) {
				jsonGPX.gpx.creator = creator;
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
			var metadata = {};

			/* Getting metadata values */
			var metadataElem = gpx.getElementsByTagName('metadata')[0];

			if(!metadataElem) {
				throw new Error('No important element: metadata');
			}

			var nameElem = metadataElem.getElementsByTagName('name')[0];
			if(nameElem) {
				metadata.name = nameElem.textContent;
			}
			var descElem = metadataElem.getElementsByTagName('desc')[0];
			if(descElem) {
				metadata.desc = descElem.textContent;
			}
			var authorElem = metadataElem.getElementsByTagName('author')[0];
			if(authorElem) {
				var authorElemName = metadataElem.getElementsByTagName('name')[0];
				if(authorElemName) {
					metadata.author = {};
					metadata.author.name = authorElemName.textContent;
				}
			}
			var timeElem = metadataElem.getElementsByTagName('time')[0];
			if(timeElem) {
				metadata.time = timeElem.textContent;
			}

			return metadata;
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
				latVal = trkpt[pt].lat;
				lonVal = trkpt[pt].lon;

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

		var _parseTrackData = function(gpx) {
			var trk = {};

			/* Getting metadata values */
			var trkElem = gpx.getElementsByTagName('trk')[0];
			if(!trkElem) {
				throw new Error('No important element: trk');
			}

			var trksegElem = trkElem.getElementsByTagName('trkseg')[0];
			if(!trksegElem) {
				throw new Error('No important element: trkseg');
			}

			var trkptElem = trkElem.getElementsByTagName('trkpt');
			if(!trkptElem) {
				throw new Error('No important element: trkpt');
			}

			trk.trkseg = {};
			trk.trkseg.trkpt = [];

			var	ptEle,
				ptTime;

			/* Parse and convert all points */
			for (var pt = 0; trkptElem.length > pt; pt++) {
				var ptObj = {};

				if(!trkptElem[pt].hasAttribute('lat')) {
					throw new Error('No important element: lat');
				}

				if(!trkptElem[pt].hasAttribute('lon')) {
					throw new Error('No important element: lon');
				}

				ptObj.lat = trkptElem[pt].getAttribute("lat");
				ptObj.lon = trkptElem[pt].getAttribute("lon");

				ptEle = trkptElem[pt].getElementsByTagName('ele')[0];
				if(ptEle) {
					ptObj.ele = ptEle.textContent;
				}

				ptTime = trkptElem[pt].getElementsByTagName('time')[0];;
				if(ptTime) {
					ptObj.time = ptTime.textContent;
				}

				trk.trkseg.trkpt.push(ptObj);
			}

			return trk;
		};
	};
})();