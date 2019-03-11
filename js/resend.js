'use strict';

angular.module('myApp.resend', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/resend', {
            templateUrl: 'views/resend.html',
        });
    }])
    .controller('ResendCtrl', ['$scope', function($scope) {

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
        $scope.resendVerify = function() {
            createCognitoUser($scope.email).resendConfirmationCode(function(err, result) {
                if (err) {
                    Swal.fire(err);
                } else {
                    window.location.href = "#!/verify";
                }
            });
        }
    }]);