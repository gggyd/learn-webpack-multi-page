'use strict';

require('../css/lib/reset.css');
require('../css/common/global.css');
require('../css/about.css');

var app = app || {}

app = (function(){
  var init = function() {
    $('h1').append('<p>welcome you!</p>');
  };

  return {
    init: init
  }
}());

app.init();