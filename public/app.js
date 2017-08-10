var app  = angular.module('app',['btford.socket-io'])

app.controller('mainCtrl', function($scope, chatSocket) {
    $scope.nameIn = ''
    $scope.messageIn = ''
    $scope.currentUser = null
    $scope.users = []
    $scope.messages = [];
    $scope.showLogin = true;

    chatSocket.on('message', function(data) {
        $scope.messages.unshift(data);
    })
    chatSocket.on('update users', function(data) {
        $scope.users = data.users;
    })
    chatSocket.on('logged in', function(data) {
        $scope.currentUser = data.currentUser;
        $scope.showLogin = !data.loggedIn;
        $scope.messages = data.history.reverse();
    })

    $scope.sendMessage = function() {
        if ($scope.messageIn){
            chatSocket.emit('send message', {
                msg: $scope.messageIn,
                user: $scope.currentUser
            })
            $scope.messageIn = '';
        }
    }
    $scope.login = function () {
        chatSocket.emit('login', $scope.nameIn)
    }
})

app.factory('chatSocket', function (socketFactory) {
    return socketFactory();
})