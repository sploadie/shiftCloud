(function() {
  var setPadding, shiftRange, speed;

  shiftRange = 10;

  speed = 4;

  setPadding = function(speed, angleChange) {
    var angle, dist, distances, radians, _results;
    angle = 0;
    distances = [];
    _results = [];
    while (angle < 180) {
      angle += shiftRange;
      if (angle < 180) {
        radians = angle * (Math.PI / 180);
        dist = Math.sin(radians) * speed;
        _results.push(distances.push(dist));
      } else {
        _results.push(alert(Math.floor(distances.reduce(function(x, y) {
          return x + y;
        })) + 1));
      }
    }
    return _results;
  };

  setPadding(speed, shiftRange);

}).call(this);
