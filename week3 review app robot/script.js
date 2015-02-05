var app = app || {};

app.firebase = 'https://botappreviewweek3.firebaseio.com/';

app.robots = [];

app.robot = function (name, metal, image) {
    this.name = name;
    this.metal = metal;
    this.image = image;
};

app.addRobot = function () {
    var name = $('#inputName').val();
    var metal = $('#inputMetal').val();
    var image = $('#inputImage').val();

    var robot = new app.robot(name, metal, image);
    console.log(robot);
    app.PostAJAX(robot, app.postCallback);

    $('#inputName').val('');
    $('#inputMetal').val('');
    $('#inputImage').val('');
};

app.GetAJAX = function (callback) {
    var request = new XMLHttpRequest();
    request.open('GET', app.firebase + '.json', true);
    request.onload = function () {
        if (this.status >= 200 && this.status < 400) {
            var parse = JSON.parse(this.response);
            callback(parse);
        } else {
            console.log('You have an error in the GET!');
        }
    };
    request.send();
};

app.getCallback = function (response) {
    for (var prop in response) {
        response[prop].key = prop;
        app.robots.push(response[prop]);
    }
    app.displayRobots();
};

    app.PostAJAX = function (sendObj, callback) {
        var request = new XMLHttpRequest();
        request.open('POST', app.firebase + '.json', true);
        request.onload = function () {
            if (this.status >= 200 && this.status < 400) {
                callback(this.response, sendObj);
            } else {
                console.log('You have an error in the POST!');
            }
        };
        request.send(JSON.stringify(sendObj));
    };

    app.postCallback = function (response, sendObj) {
        app.robots.push(sendObj);
        app.updatePage();
    };

    app.editRobot = function (index) {
        var robot = app.robots[index];
        $('#inputName').val(robot.name);
        $('#inputMetal').val(robot.metal);
        $('#inputImage').val(robot.image);
        $('#button').html('<button class="btn btn-success" onclick="app.saveEdit(' + index + ');">Save Robot</button><button class="btn btn-danger" onclick="app.cancelEdit();">Cancel</button>');
    };

    app.saveEdit = function (index) {
        var name = $('#inputName').val();
        var metal = $('#inputMetal').val();
        var image = $('#inputImage').val();

        var robot = new app.robot(name, metal, image);
        var oldRobot = app.robots[index];
        app.PutAJAX(robot, oldRobot, app.putCallback);

        $('#inputName').val('');
        $('#inputMetal').val('');
        $('#inputImage').val('');
    };

    app.putCallback = function (sendObj, oldObj) {
        for (var i = 0; i < app.robots.length; i++) {
            if (app.robots[i].key = oldObj.key) {
                app.robots[i].name = sendObj.name;
                app.robots[i].metal = sendObj.metal;
                app.robots[i].image = sendObj.image;
                break;
            }
        }
        app.cancelEdit();
        app.displayRobots();
    };

    app.PutAJAX = function (sendObj, oldObj, callback) {
        var request = new XMLHttpRequest();
        request.open('PUT', app.firebase + oldObj.key + '/.json', true);
        request.onload = function () {
            if (this.status >= 200 && this.status < 400) {
                callback(sendObj, oldObj);
            } else {
                console.log('You have an error in the Put');
            }
        };
        request.send(JSON.stringify(sendObj));
    };

        app.cancelEdit = function () {
            $('#inputName').val('');
            $('#inputMetal').val('');
            $('#inputImage').val('');
            $('#button').html('<button class="btn btn-primary" onclick="app.addRobot();">Add Robot</button>');
        };

        app.deleteRobot = function (index) {
            var key = app.robots[index].key;
            app.DeleteAJAX(key, app.deleteCallback);
        };

        app.DeleteAJAX = function (key, callback) {
            var request = new XMLHttpRequest();
            request.open('DELETE', app.firebase + key + '/.json', true);
            request.onload = function () {
                if (this.status >= 200 && this.status < 400) {
                    callback(key);
                } else {
                    console.log("there was an error");
                }
            };
            request.send();
        };

        app.deleteCallback = function (key) {
            for (var i = 0; i < app.robots.length; i++) {
                if (app.robots[i].key === key) {
                    app.robots.splice(i, 1);
                    break;
                }
            }
            app.displayRobots();
        };

        app.displayRobots = function () {
            console.log('in displayRobots');
            document.getElementById('displayRobots').innerHTML = '';
            for (var i = 0; i < app.robots.length; i++) {
                var robot = app.robots[i];
                document.getElementById('displayRobots').innerHTML += '<tr><td>' + robot.name + '</td><td>' + robot.metal + '</td><td><img src="' + robot.image + '" /></td><td><button class="btn btn-warning" onclick="app.editRobot(' + i + ');">EDIT</button></td><td><button class="btn btn-danger" onclick="app.deleteRobot(' + i + ');">DELETE</button></td></tr>';
            }

        };

        app.updatePage = function () {
            console.log('in updatePage');
            var robot = app.robots[app.robots.length - 1];
            i = app.robots.length - 1;
            document.getElementById('displayRobots').innerHTML += '<tr><td>' + robot.name + '</td><td>' + robot.metal + '</td><td><img src="' + robot.image + '" /></td><td><button class="btn btn-warning" onclick="app.editRobot(' + i + ');">EDIT</button></td><td><button class="btn btn-danger" onclick="app.deleteRobot(' + i + ');">DELETE</button></td></tr>';
        };

        app.GetAJAX(app.getCallback);