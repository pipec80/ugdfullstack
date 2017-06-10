"use strict";
var mainApp = angular.module('home.controllers', []);
mainApp.controller('mainController', ['$scope', 'dataResource', function($scope, dataResource) {
        $scope.titulo = "Puntos de recarga BIP! en estaciones Metro";
        $scope.listado = {};
        $scope.mostrar = false;
        $scope.puntosRegargas = [];
        $scope.puntoCercano = [];
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                $scope.$apply(function() {
                    $scope.position = '';
                    $scope.latitude = position.coords.latitude;
                    $scope.longitude = position.coords.longitude;
                    $scope.position = $scope.latitude + '|--|' + $scope.longitude;
                    $scope.consulta = [$scope.latitude, $scope.longitude];
                    $scope.mapsGeocode = { "lat": $scope.latitude, "lng": $scope.longitude };
                    //lamado a servicio
                    dataResource.query({ longitude: $scope.longitude, latitude: $scope.latitude, radio: 1 }).$promise.then(function(data) {
                        $scope.listado = data;
                        $scope.totalItems = $scope.listado.length;
                    }, function(errResponse) {
                        console.log('Failed: ', errResponse);
                    });
                    $scope.mostrar = true;
                });
            });
        }
    }])
    .factory('dataResource', ['$resource', 'URL_API', function($resource, URL_API) {
        return $resource(URL_API, //la url donde queremos consumir
            {}, //aquí podemos pasar variables que queramos pasar a la consulta
            //a la función get le decimos el método, y, si es un array lo que devuelve
            //ponemos isArray en true
            {
                'get': { method: 'GET' },
                'save': { method: 'POST' },
                'query': { method: 'GET', isArray: true },
                'remove': { method: 'DELETE' },
                'delete': { method: 'DELETE' }
            });
    }]);