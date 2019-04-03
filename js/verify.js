'use strict';

angular.module('myApp.verify', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/verify', {
            templateUrl: 'views/verify.html',
        });
    }])
    .controller('VerifyCtrl', ['$scope', function ($scope) {
        var poolData = {
            UserPoolId: _config.cognito.userPoolId,
            ClientId: _config.cognito.userPoolClientId
        };
        var userPool;

        userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

        if (typeof AWSCognito !== 'undefined') {
            AWSCognito.config.region = _config.cognito.region;
        }

        $scope.handleVerify = function () {
            var email = $scope.email;
            var code = $scope.vcode;
            event.preventDefault();
            verify(email, code,
                function verifySuccess(result) {
                    console.log('call result: ' + result);
                    console.log('Successfully verified');
                    Swal.fire('Verification successful. You will now be redirected to the login page.');
                    window.location.href = '#!/login';
                },
                function verifyError(err) {
                    Swal.fire({
                        title: 'Something went wrong!',
                        text: 'Verification code is incorrect.',
                        imageUrl: '/stickers/naniko.png',
                        imageWidth: 250,
                        imageHeight: 200,
                        imageAlt: 'wrong-code',
                        animation: true,
                        confirmButtonColor: '#f08080'
                    });
                }
            );
        }

        function verify(email, code, onSuccess, onFailure) {
            createCognitoUser(email).confirmRegistration(code, true, function confirmCallback(err, result) {
                if (!err) {
                    onSuccess(result);
                } else {
                    onFailure(err);
                }
            });
        }

        function createCognitoUser(email) {
            return new AmazonCognitoIdentity.CognitoUser({
                Username: email,
                Pool: userPool
            });
        }
    }]);