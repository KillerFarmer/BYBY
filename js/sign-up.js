'use strict';

angular.module('myApp.signUp', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/sign-up', {
        templateUrl: 'views/sign-up.html',
        controller: 'SignUpCtrl'
    });
}])

.controller('SignUpCtrl', ['$scope', function($scope) {
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
    $scope.handleRegister = function() {
        var email = $scope.email;
        var password = $scope.pswd;
        var password2 = $scope.pswd2;

        var onSuccess = function registerSuccess(result) {
            var cognitoUser = result.user;
            console.log('user name is ' + cognitoUser.getUsername());
            var confirmation = ('Registration successful. Please check your email inbox or spam folder for your verification code.');
            if (confirmation) {
                window.location.href = '#!/verify';
            }
        };
        var onFailure = function registerFailure(err) {
            alert(err);
            if (err == 'UsernameExistsException: User already exists') {
                window.location.href = '#!/verify';
            }
        };
        event.preventDefault();

        if (password === password2) {
            register(email, password, onSuccess, onFailure);
        } else {
            alert('Passwords do not match');
        }
    }

    function register(email, password, onSuccess, onFailure) {
        var dataEmail = {
            Name: 'email',
            Value: email
        };
        var attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail);

        userPool.signUp(email, password, [attributeEmail], null,
            function signUpCallback(err, result) {
                if (!err) {
                    onSuccess(result);
                } else {
                    onFailure(err);
                }
            }
        );

    }
}]);