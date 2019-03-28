'use strict';

angular.module('myApp.makeBatch', ['ngRoute']).
    config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/make-batch', {
            templateUrl: 'views/make-batch.html',
        });
    }])

    .controller('MakeBatchCtrl', ['$scope', '$http', function ($scope, $http) {
        $scope.loading = true;
        $scope.filled = true;
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
            bioreactor: '',
            status: '',
            timestamp: '',
            id: ''
        };
        var old_recipe;
        var markers = [];
        var infowindows = [];
        $scope.Facility = '';
        $scope.RecipeName = '';
        $scope.Bioreactor = '';

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
            var image = "../stickers/black.png";
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
                    var accepted = "../stickers/blue.png";
                    var image = "../stickers/black.png";
                    infowindows.forEach(element => {
                        if (isInfoWindowOpen(element)) {
                            element.close();
                        }
                    });
                    markers.forEach(element => {
                        element.setIcon(image);
                    });
                    marker.setIcon(accepted);
                    var facility = facility_list.find(facl => facl.Name == marker.title);
                    infowindow.open(map, marker);
                    getBioreactorList(authToken, facility);
                    $scope.Facility = facility.Name;
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
                if (bioreactor_list.length > 0) {
                    $scope.Bioreactor = bioreactor_list[0].Id;
                    if ($scope.RecipeName.length > 0 && bioreactor_list.length > 0) {
                        $scope.filled = false;
                    }
                    else {
                        $scope.filled = true;
                    }
                }
                else {
                    $scope.Bioreactor = "";
                    $scope.filled = true;
                    Swal.fire({
                        type: 'error',
                        title: 'Something went wrong!',
                        text: 'No Bioreactors available at this location!'
                    });
                }

            }, function errorCallback(response) {
                console.error('Error');

            });
        }


        $scope.addRecipe = function (recipe) {
            if (old_recipe != null) {
                document.getElementById(old_recipe).setAttribute("class", "collection-item");
            }
            batch.recipe = recipe;
            document.getElementById(recipe).setAttribute("class", "collection-item active");
            old_recipe = recipe;
            $scope.RecipeName = recipe;
            if ($scope.Facility.length > 0 && $scope.Bioreactor.length > 0) {
                $scope.filled = false;
            }
            else {
                $scope.filled = true;
            }
        }

        $scope.Confirm = function () {
            var timestamp = Math.floor(Date.now() / 1000);
            var ingredients = recipe_list.find(recipe => recipe.Name == $scope.RecipeName);
            var bioreactor = bioreactor_list.find(bio => bio.Id == $scope.Bioreactor);
            var status = "Ready to Start";
            var id = getId();
            var req = {
                method: 'POST',
                url: _config.api.invokeUrl + '/putbatch',
                headers: {
                    Authorization: authToken
                },
                data: {
                    Timestamp: timestamp,
                    Recipe: ingredients,
                    Status: status,
                    Bioreactor: bioreactor,
                    Id: id,
                }
            }
            $http(req).then(function successCallback(response) {
                console.log('Success');
                Swal.fire({
                    title: 'Success!',
                    text: 'You batch was created.',
                    imageUrl: '/stickers/victoryko.png',
                    imageWidth: 300,
                    imageHeight: 200,
                    imageAlt: 'success',
                    animation: true,
                    confirmButtonColor: '#f08080'
                })
                window.location.href = "#!/home"

            }, function errorCallback(response) {
                console.error('Error');
            });
        }

        function getId() {
            var s = '';
            for (var i = 0; i < 10; i++) {
                s += faker.random.alphaNumeric();
            }
            return s;
        }

    }]);