/// <reference path="../../../../../includes/typescript/angular.d.ts" />
angular.module('wsAngular.services', []).factory('landMassFactory', [
    '$http', function ($http) {
        return $http.get('assets/landMass.json');
    }
]);
//# sourceMappingURL=getLastMassService.js.map
