'use strict';

angular.module('myApp.makeBatch', ['ngRoute']).
    config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/make-batch', {
            templateUrl: 'views/make-batch.html',
        });
    }])

    .controller('MakeBatchCtrl', ['$scope', '$http', function ($scope, $http) {
        $scope.loading = true;
        var recipe_list;
        var poolData = {
            UserPoolId: _config.cognito.userPoolId,
            ClientId: _config.cognito.userPoolClientId
        };
        var userPool;
        userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

        var authToken;
        window.authToken.then(function setAuthToken(token) {
            if (token) {
                getrecipeList(token);
            } else {
                window.location.href = '#!/login';
            }
        }).catch(function handleTokenError(error) {
            Swal.fire(error);
            window.location.href = '#!/login';
        });

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

        $scope.orderByMe = function (x) {
            $scope.myOrderBy = x;
        }

        $scope.dateConvert = function (timestamp) {

            var months_arr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            var date = new Date(timestamp * 1000);
            var year = date.getFullYear();
            var month = months_arr[date.getMonth()];
            var day = date.getDate();
            var convdataTime = month + '-' + day + '-' + year;

            return (convdataTime);
        }
        $scope.test = function (name) {
            Swal.fire(name);
        }
        function initMap() {
            var map;
            map = new google.maps.Map(document.getElementById('map'), {
                center: { lat: -34.397, lng: 150.644 },
                zoom: 6
            });
            var infoWindow;
            infoWindow = new google.maps.InfoWindow;

            // Try HTML5 geolocation.
            if (navigator.geolocation) {
                console.log('Geolocation is supported!');
                navigator.geolocation.getCurrentPosition(function (position) {
                    var pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    infoWindow.setPosition(pos);
                    infoWindow.setContent('Location found.');
                    infoWindow.open(map);
                    map.setCenter(pos);
                }, function () {
                    handleLocationError(true, infoWindow, map.getCenter());
                });
            } else {
                // Browser doesn't support Geolocation
                handleLocationError(false, infoWindow, map.getCenter());
                console.log('Your browser doesnt support geolocation');
            }
        }

        function handleLocationError(browserHasGeolocation, infoWindow, pos) {
            infoWindow.setPosition(pos);
            infoWindow.setContent(browserHasGeolocation ?
                'Error: The Geolocation service failed.' :
                'Error: Your browser doesn\'t support geolocation.');
            infoWindow.open(map);
            console.log(pos);
            console.log('Map should be showing');
        }
        initMap();
    }]);