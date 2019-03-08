'use strict';

angular.module('myApp.registerRecipe', ['ngRoute']).
    config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/register-recipe', {
            templateUrl: 'views/register-recipe.html',
        });
    }])

    .controller('RegisterRecipeCtrl', ['$scope', '$http', function ($scope, $http) {
        var recipe_list = [];
        var tempVals = [-16, 80];
        var phVals = [3, 11];
        var pressVals = [500, 940];
        $scope.notfound = false;
        var nameList = [];

        $scope.grainid = 0;

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
                getrecipeList(token);
            } else {
                window.location.href = '#!/login';
            }
        }).catch(function handleTokenError(error) {
            alert(error);
            window.location.href = '#!/login';
        });

        $scope.grainlist = [{ name: '', amount: '' }];

        $scope.newGrain = function ($event) {
            $scope.grainid++;
            $scope.grainlist.push({ name: '', amount: '' });
            $event.preventDefault();
        }

        $scope.yeastlist = [{ name: '', amount: '' }];

        $scope.newYeast = function ($event) {
            $scope.yeastlist.push({ name: '', amount: '' });
            $event.preventDefault();
        }

        $scope.syruplist = [{ name: '', amount: '' }];

        $scope.newSyrup = function ($event) {
            $scope.syruplist.push({ name: '', amount: '' });
            $event.preventDefault();
        }

        var temp = document.getElementById('slider-temp');
        noUiSlider.create(temp, {
            start: [-16, 80],
            connect: true,
            step: 1,
            orientation: 'horizontal',
            range: {
                'min': -55,
                'max': 125
            },
            format: wNumb({
                decimals: 0
            })
        });
        var ph = document.getElementById('slider-ph');
        noUiSlider.create(ph, {
            start: [3, 11],
            connect: true,
            step: 1,
            orientation: 'horizontal',
            range: {
                'min': 0,
                'max': 14
            },
            format: wNumb({
                decimals: 0
            })
        });
        var press = document.getElementById('slider-press');
        noUiSlider.create(press, {
            start: [500, 940],
            connect: true,
            step: 1,
            orientation: 'horizontal',
            range: {
                'min': 300,
                'max': 1100
            },
            format: wNumb({
                decimals: 0
            })
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
                recipe_list.forEach(function (element) {
                    nameList.push(element.Name);
                });
            }, function errorCallback(response) {
                console.error('Error');
            });
        }
        $scope.confirm = function () {
            var timestamp = Math.floor(Date.now() / 1000);
            var name = $scope.name;
            var water = $scope.water;
            var hops = $scope.grainlist;
            var yeasts = $scope.yeastlist;
            var syrups = $scope.syruplist;
            var restrictions = [
                { Sensor: "Temperaure", min: tempVals[0], max: tempVals[1] },
                { Sensor: "PH", min: phVals[0], max: phVals[1] },
                { Sensor: "Pressure", min: pressVals[0], max: pressVals[1] }
            ];
            var req = {
                method: 'POST',
                url: _config.api.invokeUrl + '/putrecipe',
                headers: {
                    Authorization: authToken
                },
                data: {
                    Timestamp: timestamp,
                    Ingredients: {
                        Water: water,
                        Hops: hops,
                        Yeast: yeasts,
                        Syrup: syrups
                    },
                    Name: name,
                    Restrictions: restrictions,
                }
            }
            $http(req).then(function successCallback(response) {
                console.log('Success');
                alert("Successfully added recipe!")
                window.location.href = "#!/home"
            }, function errorCallback(response) {
                console.log(req);
                console.error(response);
                console.error('Error');
            });
        }
        temp.noUiSlider.on('update', function (values, handle) {
            tempVals[handle] = values[handle];
        });
        ph.noUiSlider.on('update', function (values, handle) {
            phVals[handle] = values[handle];
        });
        press.noUiSlider.on('update', function (values, handle) {
            pressVals[handle] = values[handle];
        });
        $scope.search = function () {
            if (nameList.includes($scope.name) && nameList.length > 0) {
                $scope.notfound = true;
            }
            else {
                $scope.notfound = false;
            }
        }
    }]);