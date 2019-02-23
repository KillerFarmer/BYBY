'use strict';

angular.module('myApp.makeBatch', ['ngRoute']).
config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/make-batch', {
        templateUrl: 'views/make-batch.html',
        controller: 'MakeBatchCtrl'
    });
}])

.controller('MakeBatchCtrl', ['$scope', function($scope) {
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
}]);