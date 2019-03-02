'use strict';

angular.module('myApp.registerRecipe', ['ngRoute']).
config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/register-recipe', {
        templateUrl: 'views/register-recipe.html',
        controller: 'RegisterRecipeCtrl'
    });
}])

.controller('RegisterRecipeCtrl', ['$scope', '$http', function($scope, $http) {
    var recipe_list;
    var req = {
        method: 'POST',
        url: _config.api.invokeUrl + '/getrecipe',
        headers: {
            Authorization: token
        },
        data: { info: 'Data was sent' }
    }
    $http(req).then(function successCallback(response) {
        console.log('Success');
        recipe_list = response.data.Items;
    }, function errorCallback(response) {
        console.error('Error');
    });
    $scope.confirm = function() {
        $scope.timestamp;
        $scope.name;
        $scope.water;
        $scope.hops;
        $scope.yeast;
        var req = {
            method: 'POST',
            url: _config.api.invokeUrl + '/putrecipe',
            headers: {
                Authorization: token
            },
            data: {
                Timestamp: timestamp,
                Ingredients: {
                    Water: { water },
                    Hops: { hops },
                    Yeast: { yeast }
                },
                Name: name
            }
        }
        $http(req).then(function successCallback(response) {
            console.log('Success');
            alert("Successfully added recipe!")
            window.location.href = "#!/home"
        }, function errorCallback(response) {
            console.error('Error');
        });
    }
}]).directive('nameDirective', function() {
    return {
        require: 'ngModel',
        link: function(scope, element, attr, mCtrl) {
            function nameValidation(value) {
                if (value.indexOf("e") > -1) {
                    mCtrl.$setValidity('charE', true);
                } else {
                    mCtrl.$setValidity('charE', false);
                }
                return value;
            }
            mCtrl.$parsers.push(myValidation);
        }
    };
});