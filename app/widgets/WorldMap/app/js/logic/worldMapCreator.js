var MapCreator = (function () {
    function MapCreator(canvas, mapData) {
        this.iCANVAS_START_X_POS = 0;
        this.iCANVAS_START_Y_POS = 0;
        this.iCANVAS_HEIGHT = 790;
        this.iCANVAS_WIDTH = 1580;
        this.iSPACE_FOR_LABEL = 30;
        this.iMAP_START_X_POS = this.iCANVAS_START_X_POS + this.iSPACE_FOR_LABEL;
        this.iMAP_START_Y_POS = this.iCANVAS_START_Y_POS + this.iSPACE_FOR_LABEL;
        this.iMAP_HEIGHT = this.iCANVAS_HEIGHT - (this.iSPACE_FOR_LABEL * 2);
        this.iMAP_WIDTH = this.iCANVAS_WIDTH - (this.iSPACE_FOR_LABEL * 2);
        console.warn("map DATA:");
        console.log(mapData);
        this.__mapData = mapData;

        if (canvas.getContext) {
            // Grab the context
            this.ctx = canvas.getContext('2d');
            this.canvas = canvas;
        } else {
            console.error("no support for HTML5 canvas, please use a modern browser");
            var x = 8 / 0;
        }
    }
    MapCreator.prototype.draw = function () {
        var iDEGREES_BETWEEN_LAT_GRID_LINES = 10, iDEGREES_BETWEEN_LON_GRID_LINES = 10;
        this.drawBackground(this.ctx);
        this.drawMapBackground(this.ctx);
        this.drawGraticule(this.ctx);
        this.drawLandMass(this.ctx, this.__mapData);
    };

    MapCreator.prototype.drawLandMass = function (ctx, mmm) {
        var landMass = mmm, iFirstScreenX = 0, iFirstScreenY = 0, shape, iLat, iLon, bFirst = false, iShapeCounter, iPointCouner;

        // A lighter shade of green
        //ctx.fillStyle = 'rgb(0,204,0)';
        ctx.fillStyle = 'rgb(51,51,51)';

        for (iShapeCounter = 0; iShapeCounter < landMass.shapes.length; iShapeCounter++) {
            shape = landMass.shapes[iShapeCounter];

            ctx.beginPath();

            for (iPointCouner = 0; iPointCouner < shape.length; iPointCouner++) {
                iLon = shape[iPointCouner].lat;
                iLat = shape[iPointCouner].lon;

                // Before plotting convert the lat/Lon to screen coordinates
                ctx.lineTo(this.degreesOfLongitudeToScreenX(iLat), this.degreesOfLatitudeToScreenY(iLon));
            }

            // Fill the path green
            ctx.fill();
            ctx.stroke();
        }
    };

    MapCreator.prototype.plotPosition = function (position) {
        // Grab a handle to the canvas
        var canvas = document.getElementById('map'), ctx;

        // Canvas supported?
        if (canvas.getContext) {
            // Grab the context
            ctx = canvas.getContext('2d');

            ctx.beginPath();

            // Draw a arc that represent the geo-location of the request
            ctx.arc(this.degreesOfLongitudeToScreenX(position.coords.longitude), this.degreesOfLatitudeToScreenY(position.coords.latitude), 5, 0, 2 * Math.PI, false);

            // Point style
            ctx.fillStyle = 'rgb(255,255,0)';
            ctx.fill();
            ctx.lineWidth = 3;
            ctx.strokeStyle = "black";

            ctx.stroke();
        }
    };

    MapCreator.prototype.drawGraticule = function (ctx) {
        // Set distance between lines
        var iDEGREES_BETWEEN_LAT_GRID_LINES = 10, iDEGREES_BETWEEN_LON_GRID_LINES = 10;

        // Style
        ctx.lineWidth = 0.2;
        ctx.strokeStyle = "rgba(0, 0, 0, 0.1)";
        ctx.fillStyle = 'rgb(255,255,255)';

        // Font styling
        ctx.font = 'italic 10px sans-serif';
        ctx.textBaseline = 'top';

        this.drawLatitudeLines(ctx, iDEGREES_BETWEEN_LAT_GRID_LINES);
        this.drawLongitudeLines(ctx, iDEGREES_BETWEEN_LON_GRID_LINES);
    };

    MapCreator.prototype.drawBackground = function (ctx) {
        // Black background
        ctx.fillStyle = "rgb(0,0,0)";

        // Draw rectangle for the background
        ctx.fillRect(this.iCANVAS_START_X_POS, this.iCANVAS_START_Y_POS, (this.iCANVAS_START_X_POS + this.iCANVAS_WIDTH), this.iCANVAS_START_Y_POS + this.iCANVAS_HEIGHT);
        ctx.stroke();
    };

    MapCreator.prototype.drawMapBackground = function (ctx) {
        // Ocean blue colour!
        //ctx.fillStyle = "rgb(10, 133, 255)";
        ctx.fillStyle = "rgb(153, 153, 153)"; //#666666

        // Draw rectangle for the map
        ctx.fillRect(this.iMAP_START_X_POS, this.iMAP_START_Y_POS, this.iMAP_WIDTH, this.iMAP_HEIGHT);
    };

    MapCreator.prototype.degreesOfLongitudeToScreenX = function (iDegreesOfLongitude) {
        // Make the value positive, so we can calculate the percentage
        var iAdjustedDegreesOfLongitude = (iDegreesOfLongitude * 1) + 180, iDegreesOfLongitudeToScreenX = 0;

        // Are we at the West -180 point?
        if (iAdjustedDegreesOfLongitude === 0) {
            // Screen X is the left of the map (avoid divide by zero)
            iDegreesOfLongitudeToScreenX = this.iMAP_START_X_POS;
        } else if (iAdjustedDegreesOfLongitude > 360) {
            // If the longitude crosses the 180 line fix it (doesn't translat to screen well)
            iDegreesOfLongitudeToScreenX = this.iMAP_START_X_POS + this.iMAP_WIDTH;
        } else {
            // Convert the longitude value to screen X
            iDegreesOfLongitudeToScreenX = (this.iMAP_START_X_POS + (iAdjustedDegreesOfLongitude * (this.iMAP_WIDTH / 360)));
        }

        return iDegreesOfLongitudeToScreenX;
    };

    MapCreator.prototype.degToRad = function (angle) {
        // Degrees to radians
        return ((angle * Math.PI) / 180);
    };

    MapCreator.prototype.radToDeg = function (angle) {
        // Radians to degree
        return ((angle * 180) / Math.PI);
    };

    MapCreator.prototype.drawLatitudeLines = function (ctx, iDEGREES_BETWEEN_GRID_LINES) {
        var iMIN_LONGITUDE = -180, iMAX_LONGITUDE = 180, iDegreesScreenY = 0, iLineOfLongitude, iDegreesScreenX, iCentralMeridian = this.degToRad(0), iRadius = this.iMAP_HEIGHT / 2;

        for (iLineOfLongitude = iMIN_LONGITUDE; iLineOfLongitude <= iMAX_LONGITUDE; iLineOfLongitude += iDEGREES_BETWEEN_GRID_LINES) {
            // Convert the longitude value and move the pen to the start of the line
            iDegreesScreenX = this.degreesOfLongitudeToScreenX(iLineOfLongitude);

            //iDegreesScreenX = iRadius * (degToRad(iLineOfLongitude) - (degToRad(iLineOfLongitude) * iCentralMeridian));
            ctx.moveTo(iDegreesScreenX, this.iMAP_START_Y_POS);

            // Plot the line
            ctx.lineTo(iDegreesScreenX, this.iMAP_START_Y_POS + this.iMAP_HEIGHT);

            // Put the label on the line
            ctx.fillText(iLineOfLongitude, iDegreesScreenX - 10, this.iCANVAS_START_Y_POS + 10);

            ctx.stroke();
        }
    };

    MapCreator.prototype.degreesOfLatitudeToScreenY = function (iDegreesOfLatitude) {
        // Make the value positive, so we can calculate the percentage
        var iAdjustedDegreesOfLatitude = (iDegreesOfLatitude * 1) + 90, iDegreesOfLatitudeToScreenY = 0;

        // Are we at the South pole?
        if (iAdjustedDegreesOfLatitude === 0) {
            // Screen Y is the botton of the map (avoid divide by zero)
            iDegreesOfLatitudeToScreenY = this.iMAP_HEIGHT + this.iMAP_START_Y_POS;
        } else if (iAdjustedDegreesOfLatitude > 180) {
            // Are we at the North pole (or beyond)?
            // Screen Y is the top of the map
            iDegreesOfLatitudeToScreenY = this.iMAP_START_Y_POS;
        } else {
            // Convert the latitude value to screen X
            iDegreesOfLatitudeToScreenY = (this.iMAP_HEIGHT - (iAdjustedDegreesOfLatitude * (this.iMAP_HEIGHT / 180)) + this.iMAP_START_Y_POS);
        }

        return iDegreesOfLatitudeToScreenY;
    };

    MapCreator.prototype.drawLongitudeLines = function (ctx, iDEGREES_BETWEEN_GRID_LINES) {
        var iNORTH_LATITUDE = 90, iSOUTH_LATITUDE = -90, iDegreesScreenY = 0, iLineOfLatitude;

        for (iLineOfLatitude = iNORTH_LATITUDE; iLineOfLatitude >= iSOUTH_LATITUDE; iLineOfLatitude -= iDEGREES_BETWEEN_GRID_LINES) {
            // Convert the latitude value and move the pen to the start of the line
            iDegreesScreenY = this.degreesOfLatitudeToScreenY(iLineOfLatitude);
            ctx.moveTo(this.iMAP_START_X_POS, iDegreesScreenY);

            // Plot the line
            ctx.lineTo(this.iMAP_START_X_POS + this.iMAP_WIDTH, iDegreesScreenY);

            // Put the label on the line
            ctx.fillText(iLineOfLatitude, this.iCANVAS_START_X_POS + 5, iDegreesScreenY - 5);

            ctx.stroke();
        }
    };
    return MapCreator;
})();
//# sourceMappingURL=worldMapCreator.js.map
