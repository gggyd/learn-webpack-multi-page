'use strict';

require('../css/lib/reset.css');
require('../css/common/global.css');
require('../css/index.css');

var app = app || {};

app = (function(){
  var init = function() {
    $('h1').append('<p>this is js generate...</p>');
  }

  return {
    init: init
  }
}());

app.init();
