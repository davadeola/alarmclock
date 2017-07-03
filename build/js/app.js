(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
function AlarmCompare(hour,min,sec,ampm) {
  this.hour = hour;
  this.min = min;
  this.sec = sec;
  this.ampm = ampm;
}

AlarmCompare.prototype.alarmState = function () {
  return(this.hour+':'+this.min+':'+this.sec+' '+this.ampm);
};



exports.alarmModule=AlarmCompare;

},{}],2:[function(require,module,exports){
var AlarmCompare = require('./../js/clock.js').alarmModule;
var alarm;
$(document).ready(function(){

  var timeStr;
  var alarms = [];

  var update = function() {
    var time = moment().format('h:mm:ss a');
    var timeStr = $('#timedis').text(time.toString());
    // alert(timeStr[1]);
    console.log(typeof time);

    $('form.form').submit(function(event){
      event.preventDefault();

      alarms = [];
      var hour = ($('input#hour').val()).toString();
      var min = ($('input#min').val()).toString();
      var sec = ($('input#sec').val()).toString();
      var ampm = ($('select#ampm').val()).toString();

      alarm = new AlarmCompare(hour,min,sec,ampm);
      alarms.push(alarm);


    });

  

    if ( (alarms[0].alarmState()) == time) {
      $("div.audio").append(`
        <audio loop autoplay>
        <source src="ala.mp3" type="audio/mpeg">

        Your browser does not support the audio tag.
        </audio>
        `);
      }


    };
    setInterval(update, 1000);

    $("button#stop").click(function () {
      $("div.audio").text("");
    });

  });

},{"./../js/clock.js":1}]},{},[2]);
