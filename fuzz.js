'use strict';

var _ = _ || require('lodash');

var r = Math.random;
String.prototype.replaceAt = function(index, character) {
  return this.substr(0, index) + character + this.substr(index + character.length);
};


var chars = '0123456789abcdefghijklmnopqurstuvwxyz' +
  'ABCDEFGHIJKLMNOPQURSTUVWXYZ' +
  '~!@#$%^&*()_+`1234567890-=' +
  '';
var genChar = function() {
  return chars.substr(Math.floor(r() * chars.length), 1);
};
var getRandomItem = function(list, weight) {
  var total_weight = weight.reduce(function(prev, cur) {
    return prev + cur;
  });
  var random_num = r() * total_weight
  var weight_sum = 0;

  for (var i = 0; i < list.length; i++) {
    weight_sum += weight[i];
    weight_sum = +weight_sum.toFixed(2);

    if (random_num <= weight_sum) {
      return list[i];
    }
  }
};

var id = function(x) {
  return function() {
    return x;
  };
};
var JSON_GRAMMAR = {
  // root
  root: [
    ['ws', 'value', 'ws'],
  ],
  // whitespace
  ws: [
    [id('')],
    //[id('\n')],
    //[id('\t')],
    //[id('\r')],
    //[id(' ')],
    //['ws', 'ws'],
  ],
  // structural chars
  beginarray: [
    ['ws', id('['), 'ws']
  ],
  beginobject: [
    ['ws', id('{'), 'ws']
  ],
  endarray: [
    ['ws', id(']'), 'ws']
  ],
  endobject: [
    ['ws', id('}'), 'ws']
  ],
  nameseparator: [
    ['ws', id(':'), 'ws']
  ],
  valueseparator: [
    ['ws', id(','), 'ws']
  ],

  // values
  // false / null / true / object / array / number / string
  value: [
    //[id('true')],
    //[id('false')],
    //[id('null')],
    //['object'],
    //['array'],
    ['number'],
    //['string'],
  ],

  // object
  object: [
    ['beginobject', 'members', 'endobject'],
    ['beginobject', 'endobject']
  ],
  members: [
    ['member'],
    ['members', 'valueseparator', 'member'],
  ],
  member: [
    ['string', 'nameseparator', 'value'],
  ],

  // array
  array: [
    ['beginarray', 'endarray'],
    ['beginarray', 'list', 'endarray']
  ],
  list: [
    ['value'],
    ['value', 'valueseparator', 'list']
  ],

  // number
  number: [
    ['maybeMinus', 'int', 'maybeFrac', 'maybeExp'],
  ],
  maybeMinus: [
    [id('')],
    [id('-')],
  ],
  maybeFrac: [
    [id('')],
    [id('.'), 'natDigit'],
  ],
  natDigit: [
    ['digit'],
    ['digit', 'natDigit'],
  ],
  maybeExp: [
    [id('')],
    ['e', 'minusPlus', 'natDigit'],
  ],
  minusPlus: [
    [id('-')],
    [id('+')],
  ],
  e: [
    [id('e')],
    [id('E')],
  ],
  int: [
    [id('0')],
    ['digit19', 'digits']
  ],
  digit19: [
    [id('1')],
    [id('2')],
    [id('3')],
    [id('4')],
    [id('5')],
    [id('6')],
    [id('7')],
    [id('8')],
    [id('9')],
  ],
  digits: [
    [id('')],
    ['digits', 'digit']
  ],
  digit: [
    [id('0')],
    [id('1')],
    [id('2')],
    [id('3')],
    [id('4')],
    [id('5')],
    [id('6')],
    [id('7')],
    [id('8')],
    [id('9')],

  ],

  // string
  string: id('"hello world"'),

};

var genFromGrammar = function(grammar) {
  var stack = ['root'];
  var s = '';
  while (stack.length !== 0) {
    //console.log('stack', stack);
    var current = stack.pop();
    //console.log('current', current);
    // current is a terminal 
    if (_.isFunction(current)) {
      s += current();
      continue;
    }

    var rules = grammar[current];
    // rules is an array of arrays, containing all derivation rules
    if (_.isArray(rules)) {

      // rule is an array of symbols to be added to the stack
      var rule = _.sample(rules);
      var symbols = _.clone(rule).reverse();
      stack.push.apply(stack, symbols);

    } else if (_.isFunction(rules)) {
      s += rules();
    } else {
      throw new Error('Invalid grammar definition at ' + current);
    }
  }

  return s;
};

var genJSON = function() {
  return genFromGrammar(JSON_GRAMMAR);
};

var mutate = function(json) {
  var pos = Math.floor(r() * json.length);
  return json.replaceAt(pos, genChar());
};


var N_CASES = 1000;
var N_MUTATIONS_PER_CHAR = 1;
var cases = 0;
for (var i = 0; i < N_CASES; i++) {
  console.log('case', i);
  var json = genJSON();
  var nMutations = 1; //json.length * N_MUTATIONS_PER_CHAR;
  for (var j = 0; j < nMutations; j++) {
    var s = j === 0 ? json : mutate(json);
    console.log('json:<', s, '>');
    cases += 1;
    try {
      var obj = JSON.parse(s);
      console.log('parsed', obj);
    } catch (e) {
      //if (!(e instanceof SyntaxError)) {
      throw e;
      //}
    }
  }
}
console.log('done:', cases, 'cases');
