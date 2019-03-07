'use strict';

angular.module('myApp.registerRecipe', ['ngRoute']).
config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/register-recipe', {
        templateUrl: 'views/register-recipe.html',
        controller: 'RegisterRecipeCtrl'
    });
}])

.controller('RegisterRecipeCtrl', ['$scope', '$http', function($scope, $http) {

    var slidertemp = document.getElementById('slider-temp');
    noUiSlider.create(slidertemp, {
        start: [20, 80],
        connect: true,
        step: 1,
        orientation: 'horizontal', // 'horizontal' or 'vertical'
        range: {
            'min': 0,
            'max': 100
        },
        format: wNumb({
            decimals: 0
        })
    });
    var sliderph = document.getElementById('slider-ph');
    noUiSlider.create(sliderph, {
        start: [20, 80],
        connect: true,
        step: 1,
        orientation: 'horizontal', // 'horizontal' or 'vertical'
        range: {
            'min': 0,
            'max': 100
        },
        format: wNumb({
            decimals: 0
        })
    });
    var sliderpressure = document.getElementById('slider-pressure');
    noUiSlider.create(sliderpressure, {
        start: [20, 80],
        connect: true,
        step: 1,
        orientation: 'horizontal', // 'horizontal' or 'vertical'
        range: {
            'min': 0,
            'max': 100
        },
        format: wNumb({
            decimals: 0
        })
    });
}]);