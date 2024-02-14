
module.exports = {
    traducirGMTformat: (gmt) => {
      switch(gmt) {
        case "(GMT-06:00) Mexico Time":
          return "America/Mexico_City";
        case "(GMT-05:00) Eastern Time":
          return "America/New_York";
        case "(GMT-04:00) Atlantic Time":
          return "America/Halifax";
        case "(GMT-03:00) Buenos Aires":
          return "America/Argentina/Buenos_Aires";
        case "(GMT+00:00) London":
          return "Europe/London";
        case "(GMT+01:00) Madrid":
          return "Europe/Madrid";
        case "(GMT+02:00) Athens":
          return "Europe/Athens";
        case "(GMT+03:00) Moscow":
          return "Europe/Moscow";
        case "(GMT+04:00) Dubai":
          return "Asia/Dubai";
        case "(GMT+05:00) Karachi":
          return "Asia/Karachi";
        case "(GMT+06:00) Dhaka":
          return "Asia/Dhaka";
        case "(GMT+07:00) Bangkok":
          return "Asia/Bangkok";
        case "(GMT+08:00) Beijing":
          return "Asia/Shanghai";
        case "(GMT+09:00) Tokyo":
          return "Asia/Tokyo";
        case "(GMT+10:00) Sydney":
          return "Australia/Sydney";
        case "(GMT+11:00) Solomon Islands":
          return "Pacific/Guadalcanal";
        case "(GMT+12:00) Fiji":
          return "Pacific/Fiji";
        case "(GMT+02:00) GTB Time":
          return "Europe/Istanbul";
        case "(GMT+02:00) Jerusalem":
          return "Asia/Jerusalem";
        case "(GMT+02:00) Helsinki":
          return "Europe/Helsinki";
        case "(GMT+02:00) Cairo":
          return "Africa/Cairo";
        case "(GMT+02:00) Harare":
          return "Africa/Harare";
        case "(GMT+02:00) Pretoria":
          return "Africa/Johannesburg";
        case "(GMT+02:00) Kaliningrad":
          return "Europe/Kaliningrad";
        case "(GMT+02:00) Amman":
          return "Asia/Amman";
        case "(GMT+02:00) Beirut":
          return "Asia/Beirut";
        case "(GMT+02:00) Damascus":
          return "Asia/Damascus";
        case "(GMT+02:00) Nicosia":
          return "Asia/Nicosia";
        case "(GMT+02:00) Kiev":
          return "Europe/Kiev";
        case "(GMT+02:00) Riga":
          return "Europe/Riga";
        case "(GMT+02:00) Sofia":
          return "Europe/Sofia";
        case "(GMT+02:00) Tallinn":
          return "Europe/Tallinn";
        case "(GMT+02:00) Vilnius":
          return "Europe/Vilnius";
        case "(GMT+02:00) Windhoek":
          return "Africa/Windhoek";
        case "(GMT+02:00) Tripoli":
          return "Africa/Tripoli";
        case "(GMT+02:00) Bucharest":
          return "Europe/Bucharest";
        case "(GMT+02:00) Chisinau":
          return "Europe/Chisinau";
        case "(GMT+02:00) Athens":
          return "Europe/Athens";
        case "(GMT+02:00) Istanbul":
          return "Europe/Istanbul";
        case "(GMT+02:00) Minsk":
          return "Europe/Minsk";
        default:
          return null;
      }
    }
  };