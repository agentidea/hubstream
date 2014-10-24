/// <reference path="../../../../../includes/typescript/angular.d.ts" />
angular.module('wsAngular', [])
    .constant('production', typeof(window.production) !== 'undefined' || !!window.production );