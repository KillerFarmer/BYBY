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
                recipe_list = response.data.Items;
                $scope.recipes = recipe_list;
                $scope.loading = false;
            }, function errorCallback(response) {
                console.error('Error');

            });
        }
    }]);