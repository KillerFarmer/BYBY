'use strict';

angular.module('myApp.makeBatch', ['ngRoute']).
config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/make-batch', {
        templateUrl: 'views/make-batch.html',
        controller: 'MakeBatchCtrl'
    });
}])

.controller('MakeBatchCtrl', ['$scope', '$http', function($scope, $http) {
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
        alert(error);
        window.location.href = '#!/login';
    });


    function getrecipeList(token) {
        var req = {
            method: 'POST',
            url: _config.api.invokeUrl + '/getrecipe',
            headers: {
                Authorization: token
            },
            data: { test: 'test' }
        }
        $http(req).then(function successCallback(response) {
            console.log('Success');
            recipe_list = response.data.Items;
            //Aqui pon la primera vez que se organiza esque es asincrono entonces le vale el tiempo, andrade.
        }, function errorCallback(response) {
            console.error('Error');

        });
    }
}]);