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
            var x, i = "";
            //Aqui pon la primera vez que se organiza esque es asincrono entonces le vale el tiempo, andrade.
            for (i in recipe_list) {
                x += "<li class='collection-item deep-purple accent-1'><div>" + recipe_list.Name + "<a class='secondary-content black-text'><i>dateConvert" + dateConvert(recipe_list.Timestamp) + "</i></a></div></li><br>";
              }
            document.getElementById("rlist").innerHTML = x;
        }, function errorCallback(response) {
            console.error('Error');

        });
    }

    function dateConvert(timestamp){
       
        var months_arr = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        var date = new Date(timestamp*1000);
        var year = date.getFullYear();
        var month = months_arr[date.getMonth()];
        var day = date.getDate();
        var convdataTime = month+'-'+day+'-'+year;

        return(convdataTime);
       }
}]);