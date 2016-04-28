function gpxParser() {
	this.parseJSON = function() {

		/* Example */
		var jsonExampleData = {
			metadata: {
				name: 'The name of the GPX file',
				desc: 'A description of the contents of the GPX file',
				author: {
					name: 'Author name'
				},
				time: '2007-10-02T07:51:30Z',
			},
			trkdata: {
				name: 'GPS name of track',
				cmt: 'GPS comment for track',
				desc: 'User description of track',
				number: '1',
			},
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

		return _toGPX(jsonExampleData);
	}

	this.parseGPX = function() {
		/* Will be implemented as soon as possible */
	}

	var _toJSON = function(gpxData) {
		var parser = new DOMParser();
	};

	var _toGPX = function(jsonData) {

		var metadata = jsonData.metadata;
		var trkdata = jsonData.trkdata;
		var trkpts = jsonData.trkpts;
		
		/* Create gpx document*/
		var gpxDoc = document.implementation.createDocument('', '', null);

		/* Initialize gpx element */
		var gpxElem = _createRoot(gpxDoc);

		/* Initialize metadata */
		var metadataElem = gpxDoc.createElement('metadata');
		metadataElem = _createMetadata(gpxDoc, metadata, metadataElem);

		/* Initialize track info */
		var trkElem = gpxDoc.createElement('trk');
		trkElem = _createTrackData(gpxDoc, trkdata, trkElem);

		/* Initialize tack segments info */
		var trksegElem = gpxDoc.createElement('trkseg');
		trksegElem = _createTrkPts(gpxDoc, trkpts, trksegElem);

		/* Mounting of the GPX tree */
		gpxElem.appendChild(metadataElem);
		trkElem.appendChild(trksegElem);
		gpxElem.appendChild(trkElem);

		return gpxElem;
	};

	var _createRoot = function(gpxDoc) {

		/* Attributes for GXP 1.1 version */
		var VERSION = '1.1';
		var CREATOR = 'Software that created your GPX document'; //Creator name. Example: Application name.
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

			authorVal = gpxDoc.createTextNode(author.name);
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

	var _createTrackData = function(gpxDoc, trkdata, trkElem) {
		var name = trkdata.name;
		var cmt = trkdata.cmt;
		var descTrack = trkdata.desc;
		var number = trkdata.number;

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

		return trkElem;
	};

	var _createTrkPts = function(gpxDoc, trkpts, trksegElem) {
		var trkpt,
			latVal,
			lonVal,
			eleElem,
			eleVal,
			ptTimeElem,
			ptTimeVal;

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
			ptTimeElem = gpxDoc.createElement('time');
			ptTimeVal = gpxDoc.createTextNode(trkpts[pt].time);
			ptTimeElem.appendChild(ptTimeVal);

			/* Mounting of the point tree */
			trkpt.setAttribute('lat', latVal);
			trkpt.setAttribute('lon', lonVal);
			trkpt.appendChild(eleElem);
			trkpt.appendChild(ptTimeElem);

			trksegElem.appendChild(trkpt);
		}

		return trksegElem;
	};
};
