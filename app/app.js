var app = angular.module('myApp', ['home.controllers', 'ngResource', 'ngMap', 'App.config.constant']);
app.config(['$resourceProvider', function($resourceProvider) {
    // Don't strip trailing slashes from calculated URLs
    $resourceProvider.defaults.stripTrailingSlashes = false;
}]);