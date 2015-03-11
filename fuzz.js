'use strict';

var r = Math.random;
String.prototype.replaceAt = function(index, character) {
  return this.substr(0, index) + character + this.substr(index + character.length);
};


var genValue;

var chars = '0123456789abcdefghijklmnopqurstuvwxyz' +
  'ABCDEFGHIJKLMNOPQURSTUVWXYZ' +
  '~!@#$%^&*()_+`1234567890-=' +
  '';
var genChar = function() {
  return chars.substr(Math.floor(r() * chars.length), 1);
};

var genString = function(len) {
  var ret = '';
  for (var i = 0; i < len; i++) {
    ret += genChar();
  }
  return ret;
};

var rand = function(min, max) {
  return Math.random() * (max - min) + min;
};

var getRandomItem = function(list, weight) {
  var total_weight = weight.reduce(function(prev, cur) {
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

var MAX_STR_LEN = 10;
var genstring = function() {
  // TODO: generate escaped strings
  return '"' + genString(r() * MAX_STR_LEN) + '"';
};

var genMember = function() {
  return genstring() + ':' + genValue();
};

var genfalse = function() {
  return 'false';
};
var gennull = function() {
  return 'null';
};
var gentrue = function() {
  return 'true';
};
var P_ADD_MEMBER = 0.55;
var genobject = function() {

  var members = '';
  while (r() < P_ADD_MEMBER) {
    members += genMember() + ',';
  }
  members = members.substring(0, members.length - 1);

  return '{' + members + '}';
};

// TODO: configure separately
var P_ADD_VALUE = P_ADD_MEMBER;

var genarray = function() {
  var values = '';
  while (r() < P_ADD_VALUE) {
    values += genValue() + ',';
  }
  values = values.substring(0, values.length - 1);
  return '[' + values + ']';
};

var MAX_INT = 1e10;
var gennumber = function() {
  // TODO: generate exponential notation
  // TODO: generate integers
  return '' + ((r() - 0.5) * MAX_INT);
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
  50, // object
  50, // array
  20, // number
  20, // string
];
genValue = function() {
  return getRandomItem(genFs, weights)();
};

var ws = '\n\r\t ';
var gen1WS = function() {
  return ws[Math.floor(r() * ws.length)];
};


// TODO: generate whitespace
var MAXWS = 0;
var genWS = function() {
  var ret = '';
  for (var i = 0; i < r() * MAXWS; i++) {
    ret += gen1WS();
  }
  return ret;
};

var genJSON = function() {
  return genWS() + genValue() + genWS();
};


var mutate = function(json) {
  var pos = Math.floor(r() * json.length);
  return json.replaceAt(pos, genChar());
};


var N_CASES = 1000;
var N_MUTATIONS_PER_CHAR = 1;
var cases = 0;
for (var i = 0; i < N_CASES; i++) {
  var json = genJSON();
  var nMutations = json.length * N_MUTATIONS_PER_CHAR;
  for (var j = 0; j < nMutations; j++) {
    var s = j === 0 ? json : mutate(json);
    console.log(s);
    cases += 1;
    try {
      JSON.parse(s);
    } catch (e) {
      if (!(e instanceof SyntaxError)) {
        throw e;
      }
    }
  }
}
console.log('done:', cases, 'cases');
