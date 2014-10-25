/// <reference path="../../../../../includes/typescript/angular.d.ts" />
angular.module('wsAngular', ['wsAngular.services'])
    .constant('production', typeof(window.production) !== 'undefined' || !!window.production );