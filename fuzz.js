

var r = Math.random;
var genChar = function() {
  return (Math.random()).toString(36).substr(2,1);
};

var genString = function(len) {
  var ret = '';
  for (var i = 0; i<len; i++) {
    ret += genChar();
  }
  return ret;
};

var rand = function(min, max) {
  return Math.random() * (max - min) + min;
};
 
var getRandomItem = function(list, weight) {
  var total_weight = weight.reduce(function (prev, cur, i, arr) {
    return prev + cur;
  });
  var random_num = rand(0, total_weight);
  var weight_sum = 0;
  
  for (var i = 0; i < list.length; i++) {
    weight_sum += weight[i];
    weight_sum = +weight_sum.toFixed(2);
        
    if (random_num <= weight_sum) {
      return list[i];
    }
  }
};

var genMember = function() {
  return genstring() + ':' + genValue();
};

var genfalse = function() {return 'false'};
var gennull = function () {return 'null'};
var gentrue = function() {return 'true'};
var P_ADD_MEMBER = 0.5;
var genobject = function() {
  
  var members = '';
  while (r() < P_ADD_MEMBER) {
    members += genMember() + ',';
  }
  members = members.substring(0,members.length-1);

  return '{' + members + '}';
};

// TODO: configure separately
var P_ADD_VALUE = P_ADD_MEMBER;

var genarray = function() {
  var values = '';
  while (r() < P_ADD_VALUE) {
    values += genValue() + ',';
  }
  values = values.substring(0,values.length-1);
  return '[' + values + ']';
};

var MAX_INT = 1e10;
var gennumber = function() {
  // TODO: generate exponential notation
  // TODO: generate integers
  return ''+((r()-0.5)*MAX_INT);
};
var MAX_STR_LEN = 10;
var genstring = function() {
  // TODO: generate escaped strings
  return '"' + genString(r()*MAX_STR_LEN) + '"';
};

var genFs = [
  genfalse, 
  gennull,
  gentrue,
  genobject,
  genarray, 
  gennumber,
  genstring
];
var weights = [
  1, // false
  1, // null
  1, // true
  10, // object
  10, // array
  2, // number
  2, // string
];
var genValue = function() {
  return getRandomItem(genFs, weights)();   
};

var ws = '\n\r\t ';
var gen1WS = function() {
  return ws[Math.floor(r() * ws.length)];
};


var MAXWS = 5;
var genWS = function() {
  var ret = '';
  for (var i = 0; i<r()*MAXWS; i++) {
    ret += gen1WS();
  }
  return ret;
};

var gen = function() {
  return genWS() + genValue() + genWS();
};

for (var i = 0; i<1000; i++) {
  var s = gen();
  console.log(s);
  try {
    JSON.parse(s);
  } catch (e) {
    throw e;
  }
}



