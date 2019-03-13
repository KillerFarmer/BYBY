'use strict';

angular.module('myApp.makeBatch', ['ngRoute']).
    config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/make-batch', {
            templateUrl: 'views/make-batch.html',
        });
    }])

    .controller('MakeBatchCtrl', ['$scope', '$http', function ($scope, $http) {
        $scope.loading = true;
        var bounds = new google.maps.LatLngBounds();
        var recipe_list;
        var facility_list;
        var poolData = {
            UserPoolId: _config.cognito.userPoolId,
            ClientId: _config.cognito.userPoolClientId
        };
        var userPool;
        var map;
        var authToken;
        var batch = {
            recipe: '',
            facility: ''
        };
        var old_recipe;
        var old_facility;

        userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
        window.authToken.then(function setAuthToken(token) {
            if (token) {
                getrecipeList(token);
                getFacilityList(token);
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

        function getFacilityList(token) {
            var req = {
                method: 'POST',
                url: _config.api.invokeUrl + '/getfacility',
                headers: {
                    Authorization: token
                },
                data: {
                    Coordinates: {
                        lat: 32.505836,
                        lng: -116.924076
                    }
                }
            }
            $http(req).then(function successCallback(response) {
                console.log('Success');
                facility_list = response.data.Items;
                $scope.facls = facility_list;
                setMarkers(facility_list);
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

        function initMap() {
            var position = {
                lat: 32.505836,
                lng: -116.924076
            }
            map = new google.maps.Map(document.getElementById('map'), {
                center: { lat: -34.397, lng: 150.644 },
                zoom: 6
            });
            var pos = {
                lat: position.lat,
                lng: position.lng
            };
            var userPos = new google.maps.Marker({
                position: position,
                map: map,
                title: 'You are here!'
            });
            userPos.setMap(map);
            map.setZoom(15);
            map.setCenter(pos);
        }

        function handleLocationError(browserHasGeolocation, infoWindow, pos) {
            infoWindow.setPosition(pos);
            infoWindow.setContent(browserHasGeolocation ?
                'Error: The Geolocation service failed.' :
                'Error: Your browser doesn\'t support geolocation.');
            infoWindow.open(map);
            console.log('Map should be showing');
        }

        function setMarkers(facilities) {
            var image = "../stickers/byby.png"
            facilities.forEach(element => {
                var marker = new google.maps.Marker({
                    position: element.Coordinates,
                    map: map,
                    title: element.Name,
                    icon: image
                });
                marker.setMap(map);
                bounds.extend(marker.position);
            });
            map.fitBounds(bounds);
        }

        initMap();

        $scope.addFacility = function (facility) {
            if(old_facility != null){
                document.getElementById(old_facility).setAttribute("class","collection-item");
            }
            batch.facility = facility;
            document.getElementById(facility).setAttribute("class","collection-item active");
            old_facility = facility;
            console.log(batch);
        }

        $scope.addRecipe = function (recipe) {
            if(old_recipe != null){
                document.getElementById(old_recipe).setAttribute("class","collection-item");
            }
            batch.recipe = recipe;
            document.getElementById(recipe).setAttribute("class","collection-item active");
            old_recipe = recipe;
            console.log(batch);
        }
    }]);