'use strict';

angular.module('myApp.home', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/home', {
            templateUrl: 'views/home.html',
        });
    }])
    .factory('batchService', function () {
        var savedData = {}
        function set(data) {
            savedData = data;
        }
        function get() {
            return savedData;
        }

        return {
            set: set,
            get: get
        }

    })
    .controller('HomeCtrl', ['$scope', '$http', 'batchService', function ($scope, $http, batchService) {
        $scope.batches;
        $scope.recipes;
        var poolData = {
            UserPoolId: _config.cognito.userPoolId,
            ClientId: _config.cognito.userPoolClientId
        };
        var userPool;
        userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
        var authToken;
        window.authToken.then(function setAuthToken(token) {
            if (token) {
                authToken = token;
                getBatchList(token);
                getrecipeList(token);
            } else {
                window.location.href = '#!/login';
            }
        }).catch(function handleTokenError(error) {
            Swal.fire({
                type: 'error',
                title: 'Something went wrong!',
                text: error
            });
            window.location.href = '#!/login';
        });
        function getBatchList(token) {
            var req = {
                method: 'POST',
                url: _config.api.invokeUrl + '/getbatch',
                headers: {
                    Authorization: token
                },
                data: {
                    Info: 'Data sent!'
                }
            }
            $http(req).then(function successCallback(response) {
                console.log('Success');
                $scope.batches = response.data.Items;
            }, function errorCallback(response) {
                console.error('Error');
            });

        }
        $scope.selectBatch = function (batch) {
            batchService.set(batch);
        }
        function getrecipeList(token) {
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
                var recipe_list = response.data.Items;
                $scope.recipes = recipe_list;
                $scope.loading = false;
            }, function errorCallback(response) {
                console.error('Error');

            });
        }

        $scope.changeStatus = function(batch){
            var icon;
            if (batch.Status == 'Ready to Start') {
                icon = "/stickers/red.png";
                return icon;
            }
            else if (batch.Status == 'In Progress') {
                icon = "/stickers/blue.png";
                return icon;
            }
            else if (batch.Status == 'Finished') {
                icon = "/stickers/check.png";
                return icon;
            } 
        }

        $scope.showRecipe = function(recipe){
            console.log(recipe);
            var ingredients = recipe.Ingredients;
            var restrictions = recipe.Restrictions;
            Swal.fire({
                position: 'top-end',
                type: 'success',
                title: recipe.Name,
                text: dateConvert(recipe.Timestamp),
                html: '<p ng-repeat="i in ingredients"> {{i}} : {{i.name}} | {{i.amount}}</p>',
            });
        }

        function dateConvert(timestamp) {

            var months_arr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            var date = new Date(timestamp * 1000);
            var year = date.getFullYear();
            var month = months_arr[date.getMonth()];
            var day = date.getDate();
            var convdataTime = month + '-' + day + '-' + year;

            return (convdataTime);
        }
    }]);