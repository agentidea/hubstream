/// <reference path="../../../../../includes/typescript/angular.d.ts" />
angular.module('wsAngular.services1', []).factory('gitEventFactory', [
    '$rootScope', function ($rootScope) {
        var host = "";
        host = "ws://localhost:5000";

        var ws = new WebSocket(host);
        ws.onmessage = function (message) {
            var obj = JSON.parse(message.data);
            $rootScope.$broadcast('locationUpdate', {
                coords: {
                    longitude: obj.geo.lng,
                    latitude: obj.geo.lat
                }
            });
            //position.coords.longitude
            /*var msg = obj.user.name;
            console.log(obj);
            if(msg!=null && msg!=="")
            $rootScope.$broadcast('onMsg',msg);
            */
        };
    }
]);
//# sourceMappingURL=gitEventService.js.map
