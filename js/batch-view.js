'use strict';

angular.module('myApp.batchView', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/batch-view', {
            templateUrl: 'views/batch-view.html',
        });
    }])
    .controller('BatchViewCtrl', ['$scope', '$http', 'batchService', function ($scope, $http, batchService) {
        var temps = [];
        var phs = [];
        var pres = [];

        var temps_labels = [];
        var phs_labels = [];
        var press_labels = [];

        var batch = batchService.get();
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
            Swal.fire({
                type: 'error',
                title: 'Something went wrong!',
                text: error
            });
            window.location.href = '#!/login';
        });
        var test = [{
            Batch: "{Batch PK}|{Batch SK}",
            Timestamp: 1552596209,
            Data:
            {
                Temperature: 200,
                Ph: 10,
                Pressure: 200
            }

        },
        {
            Batch: "{Batch PK}|{Batch SK}",
            Timestamp: 1552597209,
            Data:
            {
                Temperature: 10,
                Ph: 5,
                Pressure: 100
            }

        },
        {
            Batch: "{Batch PK}|{Batch SK}",
            Timestamp: 1552598209,
            Data:
            {
                Temperature: 120,
                Ph: 6,
                Pressure: 150
            }

        },
        ];
        getData(test);
        var temp = document.getElementById('tempChart');
        var ph = document.getElementById('phChart');
        var press = document.getElementById('pressChart');

        var tempChart = new Chart(temp, {
            type: 'line',
            data: {
                labels: temps_labels,
                datasets: [{
                    label: 'Temp',
                    data: temps,
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                },
                elements: {
                    line: {
                        tension: 0
                    }
                }
            }
        });
        var phChart = new Chart(ph, {
            type: 'line',
            data: {
                labels: phs_labels,
                datasets: [{
                    label: 'Ph',
                    data: phs,
                    backgroundColor: 'rgba(255, 206, 86, 0.2)',
                    borderColor: 'rgba(255, 206, 86, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                },
                elements: {
                    line: {
                        tension: 0
                    }
                }
            }
        });
        var presChart = new Chart(press, {
            type: 'line',
            data: {
                labels: press_labels,
                datasets: [{
                    label: 'Pressure',
                    data: pres,
                    backgroundColor: 'rgba(255, 159, 64, 0.2)',
                    borderColor: 'rgba(255, 159, 64, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                },
                elements: {
                    line: {
                        tension: 0
                    }
                }
            }
        });
        function getData(sensorData) {
            sensorData.forEach(element => {
                temps.push(element.Data.Temperature);
                phs.push(element.Data.Ph);
                pres.push(element.Data.Pressure);
                temps_labels.push((dateConvert(element.Timestamp)));
                phs_labels.push((dateConvert(element.Timestamp)));
                press_labels.push((dateConvert(element.Timestamp)));
            });
        }

        function dateConvert(timestamp) {
            var date = new Date(timestamp * 1000);
            var seconds = date.getSeconds();
            var minutes = date.getMinutes();
            var hour = date.getHours();

            var convdataTime = hour + ':' + minutes + ':' + seconds;

            return (convdataTime);
        }
    }]);