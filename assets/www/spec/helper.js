afterEach(function () {
  document.getElementById('stage').innerHTML = '';
});

var helper = {
  trigger:function (obj, name) {
    var e = document.createEvent('Event');
    e.initEvent(name, true, true);
    obj.dispatchEvent(e);
  }
};

beforeEach(function () {
  this.validResponse = function (responseText) {
    return [
      200,
      {"Content-Type":"application/json"},
      JSON.stringify(responseText)
    ];
  };
});
