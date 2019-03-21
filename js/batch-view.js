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
        var batch = "";

        var temp_rest = [];
        var ph_rest = [];
        var press_rest = [];

        var poolData = {
            UserPoolId: _config.cognito.userPoolId,
            ClientId: _config.cognito.userPoolClientId
        };
        var userPool;
        userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

        var authToken;
        batch = batchService.get();
        if (Object.entries(batch).length === 0 && batch.constructor === Object) {
            Swal.fire({
                type: 'error',
                title: 'Something went wrong!',
                text: 'No batch has been selected!'
            });
            window.location.href = '#!/home';
        }
        else if (batch.Status != 'In Progress') {
            Swal.fire({
                type: 'error',
                title: 'Something went wrong!',
                text: 'Batch has not started yet!'
            });
            window.location.href = '#!/home';
        }
        else {
            temp_rest = batch.Recipe.Restrictions[0];
            ph_rest = batch.Recipe.Restrictions[1];
            press_rest = batch.Recipe.Restrictions[2];
        }
        window.authToken.then(function setAuthToken(token) {
            if (token) {
                authToken = token;
                getBatchData(batch.Id);
            }
            else {
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


        var temp = document.getElementById('tempChart');
        var ph = document.getElementById('phChart');
        var press = document.getElementById('pressChart');
        var tempChart = new Chart(temp, {
            type: 'line',
            data: {
                labels: temps_labels,
                datasets: [{
                    label: 'Temperature',
                    data: temps,
                    backgroundColor: 'rgba(51, 123, 255, 0.2)',
                    borderColor: 'rgba(51, 123, 255, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: false,
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
                },
                annotation: {
                    drawTime: "afterDraw",
                    annotations: [{
                        id: "min",
                        type: 'line',
                        mode: 'horizontal',
                        scaleID: 'y-axis-0',
                        value: temp_rest.min,
                        borderColor: 'red',
                        borderWidth: 1,
                        label: {
                            backgroundColor: 'rgba(255, 51, 51, 0.2)',
                            content: "Min Value",
                            enabled: true
                        }
                    }, {
                        id: "max",
                        type: 'line',
                        mode: 'horizontal',
                        scaleID: 'y-axis-0',
                        value: temp_rest.max,
                        borderColor: 'red',
                        borderWidth: 1,
                        label: {
                            backgroundColor: 'rgba(255, 51, 51, 0.2)',
                            content: "Max Value",
                            enabled: true
                        }

                    }]
                },
                legend: {
                    display: false
                },
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
                responsive: false,
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
                },
                annotation: {
                    drawTime: "afterDraw",
                    annotations: [{
                        id: "min",
                        type: 'line',
                        mode: 'horizontal',
                        scaleID: 'y-axis-0',
                        value: ph_rest.min,
                        borderColor: 'red',
                        borderWidth: 1,
                        label: {
                            backgroundColor: 'rgba(255, 51, 51, 0.2)',
                            content: "Min Value",
                            enabled: true
                        }
                    }, {
                        id: "max",
                        type: 'line',
                        mode: 'horizontal',
                        scaleID: 'y-axis-0',
                        value: ph_rest.max,
                        borderColor: 'red',
                        borderWidth: 1,
                        label: {
                            backgroundColor: 'rgba(255, 51, 51, 0.2)',
                            content: "Max Value",
                            enabled: true
                        }

                    }],
                },
                legend: {
                    display: false
                },
            }
        });
        var presChart = new Chart(press, {
            type: 'line',
            data: {
                labels: press_labels,
                datasets: [{
                    label: 'Pressure',
                    data: pres,
                    backgroundColor: 'rgba(0, 153, 0, 0.2)',
                    borderColor: 'rgba(0, 153, 0, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: false,
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
                },
                annotation: {
                    drawTime: "afterDraw",
                    annotations: [{
                        id: "min",
                        type: 'line',
                        mode: 'horizontal',
                        scaleID: 'y-axis-0',
                        value: press_rest.min,
                        borderColor: 'red',
                        borderWidth: 1,
                        label: {
                            backgroundColor: 'rgba(255, 51, 51, 0.2)',
                            content: "Min Value",
                            enabled: true
                        }
                    }, {
                        id: "max",
                        type: 'line',
                        mode: 'horizontal',
                        scaleID: 'y-axis-0',
                        value: press_rest.max,
                        borderColor: 'red',
                        borderWidth: 1,
                        label: {
                            backgroundColor: 'rgba(255, 51, 51, 0.2)',
                            content: "Max Value",
                            enabled: true
                        }

                    }],

                },
                legend: {
                    display: false
                },
            }
        });
        function getDataList(sensorData) {
            temps = [];
            phs = [];
            pres = [];
            temps_labels = [];
            phs_labels = [];
            press_labels = [];
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
            var months_arr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            var month = months_arr[date.getMonth()];
            var day = date.getDate();
            var seconds = date.getSeconds();
            var minutes = date.getMinutes();
            var hour = date.getHours();
            var year = date.getFullYear().toString().substr(-2);

            var convdataTime = day + '/' + month + '/' + year + ' ' + hour + ':' + minutes + ':' + seconds;

            return (convdataTime);
        }
        function getBatchData(batch) {
            var req = {
                method: 'POST',
                url: _config.api.invokeUrl + '/getmeasurement',
                headers: {
                    Authorization: authToken
                },
                data: {
                    Batch: batch,
                }
            }
            $http(req).then(function successCallback(response) {
                console.log('Success');
                getDataList(response.data.Items);
                reload();

            }, function errorCallback(response) {
                console.error('Error');
            });
        }
        $scope.reloadData = function () {
            getBatchData(batch.Id);
            reload();
        }
        function reload() {
            addData(tempChart, temps_labels, temps);
            addData(phChart, phs_labels, phs);
            addData(presChart, press_labels, pres);
        }
        function addData(chart, label, data) {
            chart.data.labels = label;
            chart.data.datasets.forEach((dataset) => {
                dataset.data = data;
            });
            chart.update();
        }

    }]);