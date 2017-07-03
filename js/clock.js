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
