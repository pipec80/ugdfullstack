"use strict";
var mainApp = angular.module('home.controllers', []);
mainApp.controller('mainController', ['$scope', 'dataResource', function($scope, dataResource) {
        $scope.titulo = "Puntos de recarga BIP! en estaciones Metro";
        $scope.listado = {};
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                console.log(position.coords.Coordinates, 'current position');
                $scope.$apply(function() {
                    $scope.position = '';
                    $scope.latitude = position.coords.latitude;
                    $scope.longitude = position.coords.longitude;
                    $scope.position = $scope.longitude + '--' + $scope.latitude;

                    dataResource.query().$promise.then(function(data) {
                        $scope.listado = data.result.records;
                        $scope.totalItems = $scope.listado.length;
                        console.log('result: ', data.result.records);
                    }, function(errResponse) {
                        console.log('Failed: ', errResponse);
                    });

                });
            });
        }
    }])
    .factory('dataResource', ['$resource', function($resource) {
        return $resource('http://datos.gob.cl/api/action/datastore_search?resource_id=ba0cd493-8bec-4806-91b5-4c2b5261f65e&limit=5', //la url donde queremos consumir
            {}, //aquí podemos pasar variables que queramos pasar a la consulta
            //a la función get le decimos el método, y, si es un array lo que devuelve
            //ponemos isArray en true
            {
                'get': { method: 'GET' },
                'save': { method: 'POST' },
                'query': { method: 'GET', isArray: false },
                'remove': { method: 'DELETE' },
                'delete': { method: 'DELETE' }
            });
    }]);