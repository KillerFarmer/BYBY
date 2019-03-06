'use strict';

angular.module('myApp.registerRecipe', ['ngRoute']).
config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/register-recipe', {
        templateUrl: 'views/register-recipe.html',
        controller: 'RegisterRecipeCtrl'
    });
}])

.controller('RegisterRecipeCtrl', ['$scope', '$http', function($scope, $http) {
    var range = document.getElementById('slider-temp');

    noUiSlider.create(range, {
        start: [ 20, 80 ], // Handle start position
        step: 10, // Slider moves in increments of '10'
        margin: 20, // Handles must be more than '20' apart
        connect: true, // Display a colored bar between the handles
        direction: 'rtl', // Put '0' at the bottom of the slider
        orientation: 'vertical', // Orient the slider vertically
        behaviour: 'tap-drag', // Move handle on tap, bar is draggable
        range: { // Slider can select '0' to '100'
            'min': 0,
            'max': 100
        },
        pips: { // Show a scale with the slider
            mode: 'steps',
            density: 2
        }
    });

    var valueInput = document.getElementById('value-input'),
            valueSpan = document.getElementById('value-span');

    // When the slider value changes, update the input and span
    range.noUiSlider.on('update', function( values, handle ) {
        if ( handle ) {
            valueInput.value = values[handle];
        } else {
            valueSpan.innerHTML = values[handle];
        }
    });

    // When the input changes, set the slider value
    valueInput.addEventListener('change', function(){
        range.noUiSlider.set([null, this.value]);
    });
}]);