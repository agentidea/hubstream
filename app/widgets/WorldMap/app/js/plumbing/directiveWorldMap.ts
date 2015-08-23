/// <reference path="../../../../../includes/typescript/angular.d.ts" />
angular.module('wsAngular').directive('worldMap',
    ['$timeout','landMassFactory','gitEventFactory',
        function ($timeout,landMassFactory,gitEventFactory) {
    var templateUrl = 'xoxox/widgets/WorldMap/app/template/worldMap.html';
    if (!window.production) {
        templateUrl = 'template/worldMap.html';
    }

    return {
        restrict: 'A',
        templateUrl: templateUrl,
        scope: {
            mapData: '='
        },

        link: function (scope, element) {
            scope.actionProcessing = false;
            scope.actionComplete = false;
            var _mapData = null;
            var mc = null;
            landMassFactory.success(function(mapDatum) {
                var canvas = document.getElementById('map');
                mc = new MapCreator(canvas, mapDatum);
                mc.draw();
                // One-shot position request. (f supported)
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(function (pos) {
                        console.log(pos);
                        mc.plotPosition(pos,'rgb(255,0,0)',12);
                    });
                }
            });

            scope.$on('locationUpdate', function(event, latLong) {
                mc.plotPosition(latLong,'rgb(255,255,0)',2);
                scope.locationBlob = [latLong.coords.longitude,latLong.coords.latitude];
                scope.$apply();
            });





        }
    };
}]);