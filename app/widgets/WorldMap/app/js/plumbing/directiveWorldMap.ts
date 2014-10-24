/// <reference path="../../../../../includes/typescript/angular.d.ts" />
angular.module('wsAngular').directive('worldMap', function ($timeout) {
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

            var canvas = document.getElementById('map');
            var mc = new MapCreator(canvas);
            mc.draw();



        }
    };
});
