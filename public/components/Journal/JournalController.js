angular.module('dreamApp.journal')
  .controller('JournalController', function($scope, $http) {
                
  
  
        if (localStorage.getItem('journals') == null) {
                    $scope.journals = [];
                } else {
                    $scope.journals = JSON.parse(localStorage['journals']);
                }
                edit_index = -1;

                $scope.save = function() {
                    var jEntry = $scope.newEntry;
                    var jSumm = $scope.newSummary;
                    if (edit_index != -1) {
                        $scope.journals[edit_index] = {'entry': jEntry, 'summary': jSumm,
                                                       'date': document.getElementById('datepicker').value};
                    } else {
                        $scope.journals.unshift({'entry': jEntry, 'summary': jSumm,
                                                 'date': document.getElementById('datepicker').value});
                    }
                    $scope.journals.sort(compare);
                    localStorage.setItem('journals', angular.toJson($scope.journals));
                    edit_index = -1;
                };

                $scope.remove = function(item) {
                    for (var i = item.$index; i < $scope.journals.length-1; i++) {
                        $scope.journals[i] = $scope.journals[i + 1];
                    }
                    $scope.journals.pop();
                    localStorage.setItem('journals', angular.toJson($scope.journals));
                };

                $scope.edit = function(item) {
                    document.getElementById('datepicker').value = $scope.journals[item.$index]['date'];
                    document.getElementById('summary').value = $scope.journals[item.$index]['summary'];
                    document.getElementById('entry').value = $scope.journals[item.$index]['entry'];
                    $scope.newEntry = $scope.journals[item.$index]['entry'];
                    $scope.newSummary = $scope.journals[item.$index]['summary'];
                    edit_index = item.$index;
                };

                $scope.view = function(item) {
                    var journalid = "#journal" + item.$index;
                    var viewid = "#view" + item.$index;
                    $(journalid).toggleClass('collapse');
                    if ($(viewid).html() == "View Entry »") {
                        $(viewid).html("Hide Entry &raquo;");
                    } else {
                        $(viewid).html("View Entry &raquo;");
                    }
                }

                function compare(a,b) {
                    a_date = a['date'].split('/');
                    b_date = b['date'].split('/')
                    if (a_date[2] < b_date[2]) {
                        return -1;
                    } else if (a_date[2] > b_date[2]) {
                        return 1;
                    } else if (a_date[0] < b_date[0]) {
                        return -1;
                    } else if (a_date[0] > b_date[0]) {
                        return 1;
                    } else if (a_date[1] < b_date[1]) {
                        return -1;
                    } else if (a_date[1] > b_date[1]) {
                        return 1;
                    } else {
                        return 0;
                    }
                }
  
      

        });