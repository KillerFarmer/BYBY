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
        var bioreactor_list;
        var poolData = {
            UserPoolId: _config.cognito.userPoolId,
            ClientId: _config.cognito.userPoolClientId
        };
        var userPool;
        var map;
        var authToken;
        var batch = {
            recipe: '',
            bioreactor: ''
        };
        var old_recipe;
        var old_bioreactor;
        var markers = [];
        var infowindows = [];

        userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
        window.authToken.then(function setAuthToken(token) {
            if (token) {
                authToken = token;
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
                var contentString = '<div id="content">' +
                    '<div id="siteNotice">' +
                    '</div>' +
                    '<h4 id="firstHeading" class="firstHeading">' + element.Name + '</h4>' +
                    '<div id="bodyContent">' +
                    '<p>' + element.Address + '</p>' +
                    '</div>' +
                    '</div>';

                var infowindow = new google.maps.InfoWindow({
                    content: contentString
                });
                var marker = new google.maps.Marker({
                    position: element.Coordinates,
                    map: map,
                    title: element.Name,
                    icon: image
                });
                markers.push(marker);
                infowindows.push(infowindow);
                marker.setMap(map);
                marker.addListener('click', function () {
                    infowindows.forEach(element => {
                        if (isInfoWindowOpen(element)) {
                            element.close();
                        }
                    });
                    var facility = facility_list.find(facl => facl.Name == marker.title);
                    infowindow.open(map, marker);
                    getBioreactorList(authToken, facility);
                });
                bounds.extend(marker.position);
            });
            map.fitBounds(bounds);
        }

        function isInfoWindowOpen(infoWindow) {
            var map = infoWindow.getMap();
            return (map !== null && typeof map !== "undefined");
        }

        initMap();

        function getBioreactorList(token, facility) {
            var req = {
                method: 'POST',
                url: _config.api.invokeUrl + '/getbioreactor',
                headers: {
                    Authorization: token
                },
                data: {
                    Facility: facility.City + '|' + facility.Zip
                }
            }
            $http(req).then(function successCallback(response) {
                console.log('Success');
                bioreactor_list = response.data.Items;
                $scope.facls = bioreactor_list;
                console.log($scope.facls);
            }, function errorCallback(response) {
                console.error('Error');

            });
        }

        $scope.addBioreactor = function (bioreactor) {
            if (old_bioreactor != null) {
                document.getElementById(old_bioreactor).setAttribute("class", "collection-item");
            }
            batch.bioreactor = bioreactor;
            document.getElementById(bioreactor).setAttribute("class", "collection-item active");
            old_bioreactor = bioreactor;
            console.log(batch);
        }

        $scope.addRecipe = function (recipe) {
            if (old_recipe != null) {
                document.getElementById(old_recipe).setAttribute("class", "collection-item");
            }
            batch.recipe = recipe;
            document.getElementById(recipe).setAttribute("class", "collection-item active");
            old_recipe = recipe;
            console.log(batch);
        }
    }]);