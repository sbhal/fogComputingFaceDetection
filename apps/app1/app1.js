
var path = require("path");
var io;
var conn_established = 0;
var cv = require('opencv');
var PythonShell = require('python-shell');
var fs = require('fs');

module.exports = function (myAllApps) {
    var fogAPI = require(path.join(__dirname, '../..', "lib", "fogAPI.js"))(myAllApps);
    var appJS = require(path.join(__dirname, 'app1_refined.js'));
    var module = {};
    module.on_create = function (socket) {
        if (fogAPI.queryLevel() == 0) {
            appJS.step1_onCreate(socket);
        } else if (fogAPI.queryLevel() == 1) {
            appJS.step2_onCreate(socket);
        } else {
            appJS.step3_onCreate(socket);
        }
    },
        module.on_sense = function () {
            //called only for passive sensors
            console.log("on sense");
        },
        module.on_message = function (data) {
            //console.log("on message created");
            if (fogAPI.queryLevel() == 0) {
                appJS.step1_onMessage(data);
            } else if (fogAPI.queryLevel() == 1) {
                appJS.step2_onMessage(data);
            } else {
                appJS.step3_onMessage(data);
            }
        },
        module.on_new_child = function () {
            console.log("on new child");
        },
        module.on_new_parent = function () {
            console.log("on new parent");
        },
        module.on_child_leave = function () {
            console.log("on child leave");
        },
        module.on_parent_leave = function () {
            console.log("on parent leave");
        }
    return module;
}