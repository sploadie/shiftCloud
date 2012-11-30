(function() {
  var setPadding, shiftRange, speed;

  shiftRange = 10;

  speed = 4;

  setPadding = function() {
    var angle, dist, distances, radians, shiftPadding, string, _results;
    angle = 0;
    string = [];
    dist = 0;
    distances = [];
    _results = [];
    while (angle < 180) {
      angle += shiftRange;
      if (angle < 180) {
        radians = angle * (Math.PI / 180);
        dist = Math.sin(radians) * speed;
        distances.push(dist);
        _results.push(repeat(angle, string, dist, distances, rounded));
      } else {
        _results.push(shiftPadding = Math.floor(distances.reduce(function(x, y) {
          return x + y;
        })) + 1);
      }
    }
    return _results;
  };

  alert(setPadding());

}).call(this);
