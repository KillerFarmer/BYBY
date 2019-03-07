'use strict';

angular.module('myApp.registerRecipe', ['ngRoute']).
    config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/register-recipe', {
            templateUrl: 'views/register-recipe.html',
        });
    }])

    .controller('RegisterRecipeCtrl', ['$scope', '$http', function ($scope, $http) {
        $scope.addTextBox = function () {
            alert('hola');
        }
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
            } else {
                window.location.href = '#!/login';
            }
        }).catch(function handleTokenError(error) {
            alert(error);
            window.location.href = '#!/login';
        });
        var grainCounter=0;
        $scope.grainlist = [ {id:grainCounter, name : '', amount : '',inline:true} ];
    
        $scope.newGrain = function($event){
            grainCounter++;
            $scope.grainlist.push(  { id:grainCounter, name : '', amount : '',inline:true} );
            $event.preventDefault();
        }
    
        var yeastCounter=0;
        $scope.yeastlist = [ {id:yeastCounter, name : '', amount : '',inline:true} ];
    
        $scope.newYeast = function($event){
            yeastCounter++;
            $scope.yeastlist.push(  { id:yeastCounter, name : '', amount : '',inline:true} );
            $event.preventDefault();
        }
    
        var syrupCounter=0;
        $scope.syruplist = [ {id:syrupCounter, name : '', amount : '',inline:true} ];
    
        $scope.newSyrup = function($event){
            syrupCounter++;
            $scope.syruplist.push(  { id:syrupCounter, name : '', amount : '',inline:true} );
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
    }]);