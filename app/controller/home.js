"use strict";
var mainApp = angular.module('home.controllers', []);
mainApp.controller('mainController', ['$scope', 'dataResource', function($scope, dataResource) {
        $scope.titulo = "Puntos de recarga BIP! en estaciones Metro";
        $scope.listado = {};
        $scope.mostrar = false;
        $scope.puntosRegargas = [];

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                $scope.$apply(function() {

                    $scope.position = '';
                    $scope.latitude = position.coords.latitude;
                    $scope.longitude = position.coords.longitude;
                    $scope.position = $scope.longitude + '|--|' + $scope.latitude;
                    $scope.consulta = [$scope.latitude, $scope.longitude];
                    $scope.mapsGeocode = { "lat": $scope.latitude, "lng": $scope.longitude };

                    dataResource.query({ resource_id: 'ba0cd493-8bec-4806-91b5-4c2b5261f65e' }).$promise.then(function(data) {
                        $scope.listado = data.result.records;
                        $scope.totalItems = $scope.listado.length;
                        angular.forEach($scope.listado, function(value, key) {
                            var nItem = [value._id, value.LATITUD, value.LONGITUD];
                            $scope.puntosRegargas.push(nItem);
                        });

                        console.log('$scope.puntosRegargas: ', $scope.puntosRegargas);
                        $scope.NearestCity($scope.latitude, $scope.longitude);

                    }, function(errResponse) {
                        console.log('Failed: ', errResponse);
                    });
                    $scope.mostrar = true;
                });
            });
        }



        $scope.NearestCity = function(latitude, longitude) {
            console.log("latitude, longitude", latitude, longitude);
            var mindif = 99999;
            var closest;

            for (var index = 0; index < $scope.puntosRegargas.length; ++index) {
                var dif = PythagorasEquirectangular(latitude, longitude, $scope.puntosRegargas[index][1], $scope.puntosRegargas[index][2]);
                if (dif < mindif) {
                    closest = index;
                    mindif = dif;
                }
            }

            // echo the nearest city
            console.log("cities[closest]", $scope.puntosRegargas[closest]);

        };

        // Convert Degress to Radians
        function Deg2Rad(deg) {
            return deg * Math.PI / 180;
        }

        function PythagorasEquirectangular(lat1, lon1, lat2, lon2) {
            lat1 = Deg2Rad(lat1);
            lat2 = Deg2Rad(lat2);
            lon1 = Deg2Rad(lon1);
            lon2 = Deg2Rad(lon2);
            var R = 6371; // km
            var x = (lon2 - lon1) * Math.cos((lat1 + lat2) / 2);
            var y = (lat2 - lat1);
            var d = Math.sqrt(x * x + y * y) * R;
            return d;
        }

    }])
    .factory('dataResource', ['$resource', function($resource) {
        return $resource('http://datos.gob.cl/api/action/datastore_search', //la url donde queremos consumir
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