(function() {

  $(function() {
    var rand;
    rand = function() {
      var max, min;
      if (arguments.length === 2) {
        min = arguments[0];
        max = arguments[1];
      } else {
        min = 0;
        max = arguments[0];
      }
      return Math.floor(Math.random() * max) + min;
    };
    return $("#space img").each(function() {
      var $cloud, $space, cloudInitialPosition, constraints, cssPositionFor, divisions, movements, nextPosition, wind;
      $cloud = $(this);
      $space = $cloud.offsetParent();
      divisions = {
        y: 10,
        x: 50
      };
      movements = [[-1, -1], [-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1]];
      constraints = {
        top: 0,
        left: 0,
        bottom: divisions.y,
        right: divisions.x
      };
      nextPosition = function(position, oldPosition) {
        var direction, directions, movement, result;
        directions = (function() {
          var _i, _len, _ref, _ref1, _results;
          _results = [];
          for (_i = 0, _len = movements.length; _i < _len; _i++) {
            movement = movements[_i];
            result = [position.left + movement[0], position.top + movement[1]];
            if (!((constraints.left <= (_ref = result[0]) && _ref <= constraints.right)) || !((constraints.top <= (_ref1 = result[1]) && _ref1 <= constraints.bottom)) || (result[0] === oldPosition.left && result[1] === oldPosition.top)) {
              continue;
            }
            _results.push(result);
          }
          return _results;
        })();
        direction = directions[rand(directions.length)];
        return {
          left: direction[0],
          top: direction[1]
        };
      };
      cssPositionFor = function(position) {
        var constraintHeight, constraintWidth;
        constraintWidth = $space.outerWidth() - $cloud.outerWidth();
        constraintHeight = $space.outerHeight() - $cloud.outerHeight();
        return {
          left: "" + (Math.floor((position.left * constraintWidth) / divisions.x)) + "px",
          top: "" + (Math.floor((position.top * constraintHeight) / divisions.y)) + "px"
        };
      };
      wind = function(position, oldPosition) {
        position = nextPosition(position, oldPosition);
        oldPosition = position;
        return $cloud.animate(cssPositionFor(position), rand(1500, 2000), function() {
          return wind(position, oldPosition);
        });
      };
      cloudInitialPosition = {
        top: Math.floor(Math.random() * divisions.y),
        left: Math.floor(Math.random() * divisions.x)
      };
      $cloud.css(cssPositionFor(cloudInitialPosition));
      return wind(cloudInitialPosition, cloudInitialPosition);
    });
  });

}).call(this);
