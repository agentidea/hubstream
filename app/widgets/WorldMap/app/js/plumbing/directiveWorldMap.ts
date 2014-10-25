/// <reference path="../../../../../includes/typescript/angular.d.ts" />
angular.module('wsAngular').directive('worldMap', function ($timeout,landMassFactory) {
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

            landMassFactory.success(function(mapDatum) {


                var canvas = document.getElementById('map');
                var mc = new MapCreator(canvas, mapDatum);
                mc.draw();



                // One-shot position request. (f supported)
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(function (pos) {
                        console.log(pos);
                        mc.plotPosition(pos);
                    });
                }


            });





        }
    };
});
