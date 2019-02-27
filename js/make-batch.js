'use strict';

angular.module('myApp.makeBatch', ['ngRoute']).
    config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/make-batch', {
            templateUrl: 'views/make-batch.html',
            controller: 'MakeBatchCtrl'
        });
    }])

    .controller('MakeBatchCtrl', ['$scope', '$http', function ($scope, $http) {
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
                authToken = token;
            } else {
                window.location.href = '#!/login';
            }
        }).catch(function handleTokenError(error) {
            alert(error);
            window.location.href = '#!/login';
        });
        window.authToken.then(function updateAuthMessage(token) {
            authToken = token;
        });
        var req = {
            method: 'POST',
            url: _config.api.invokeUrl + '/getrecipe',

            headers: {
                Authorization: authToken,
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "*",
                "Access-Control-Allow-Credentials": true,
                "Access-Control-Allow-Headers": "*",
            },
            data: {

            },
            contentType: undefined,
            cors: true,
        }
        $http(req).then(function mySuccess(response) {
            console.log('Succes');
        }, function myError(response) {
            console.log('Error');
        });

        function orderListABC(data) {
            alert(data);//response
        }
    }]);