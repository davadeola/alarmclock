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
