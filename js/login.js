'use strict';

angular.module('myApp.login', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/login', {
            templateUrl: 'views/login.html',
        });
    }])
    .controller('LoginCtrl', ['$scope', function ($scope) {
        $scope.handleSignin = function () {
            var email = $scope.email;
            var password = $scope.pswd;
            event.preventDefault();
            signin(email, password,
                function signinSuccess() {
                    console.log('Successfully Logged In');
                    window.location.href = '#!/home';
                },
                function signinError(err) {
                    Swal.fire(err);
                    if (err == 'UserNotConfirmedException: User is not confirmed.') {
                        window.location.href = '#!/verify';
                    }
                }
            );
        }

        function signin(email, password, onSuccess, onFailure) {
            var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
                Username: email,
                Password: password
            });

            var cognitoUser = createCognitoUser(email);
            cognitoUser.authenticateUser(authenticationDetails, {
                onSuccess: onSuccess,
                onFailure: onFailure
            });

        }
        var poolData = {
            UserPoolId: _config.cognito.userPoolId,
            ClientId: _config.cognito.userPoolClientId
        };

        var userPool;

        userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

        if (typeof AWSCognito !== 'undefined') {
            AWSCognito.config.region = _config.cognito.region;
        }

        function createCognitoUser(email) {
            return new AmazonCognitoIdentity.CognitoUser({
                Username: email,
                Pool: userPool
            });
        }
        if (userPool.getCurrentUser() != null) {
            window.location.href = '#!/home';
        }
    }]);