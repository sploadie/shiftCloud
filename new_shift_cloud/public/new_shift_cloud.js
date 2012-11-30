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
      return Math.floor(Math.random() * ((max + 1) - min)) + min;
    };
    return $("#space img").each(function() {
      var $cloud, $space, $this, limit, shift, wind;
      $this = $(this);
      $cloud = {
        self: $this,
        point: {
          x: 0,
          y: 0,
          cssInput: {
            left: "0px",
            top: "0px"
          },
          convertFormat: function() {
            return $cloud.point.cssInput = {
              left: "" + (Math.floor($cloud.point.x)) + "px",
              top: "" + (Math.floor($space.height - $cloud.point.y)) + "px"
            };
          }
        },
        speed: {
          actual: 5,
          max: 5,
          min: 5,
          shiftRange: 1,
          changeRandomly: function() {
            if ($cloud.speed.max !== $cloud.speed.min) {
              switch ($cloud.speed.actual) {
                case $cloud.speed.max:
                  $cloud.speed.actual -= rand(1, $cloud.speed.shiftRange);
                  break;
                case $cloud.speed.min:
                  $cloud.speed.actual += rand(1, $cloud.speed.shiftRange);
                  break;
                default:
                  $cloud.speed.actual += rand($cloud.speed.shiftRange * -1, $cloud.speed.shiftRange);
              }
              if ($cloud.speed.actual > $cloud.speed.max) {
                return $cloud.speed.actual = $cloud.speed.max;
              } else if ($cloud.speed.actual < $cloud.speed.min) {
                return $cloud.speed.actual = $cloud.speed.min;
              }
            }
          }
        },
        direction: {
          actual: 0,
          shiftRange: 10,
          facing: {
            check: function() {
              var _ref, _ref1;
              $cloud.direction.fix();
              $cloud.direction.facing.left = false;
              $cloud.direction.facing.right = false;
              $cloud.direction.facing.up = false;
              $cloud.direction.facing.down = false;
              if ((90 < (_ref = $cloud.direction.actual) && _ref <= 270)) {
                $cloud.direction.facing.left = true;
              } else {
                $cloud.direction.facing.right = true;
              }
              if ((0 < (_ref1 = $cloud.direction.actual) && _ref1 <= 180)) {
                return $cloud.direction.facing.up = true;
              } else {
                return $cloud.direction.facing.down = true;
              }
            },
            up: false,
            right: false,
            down: false,
            left: false
          },
          fix: function() {
            if ($cloud.direction.actual > 360) {
              $cloud.direction.actual -= 360;
              $cloud.direction.fix();
            }
            if ($cloud.direction.actual < 1) {
              $cloud.direction.actual += 360;
              return $cloud.direction.fix();
            }
          }
        },
        update: function() {
          var radians;
          $cloud.direction.fix();
          radians = $cloud.direction.actual * Math.PI / 180;
          $cloud.point.x += $cloud.speed.actual * Math.cos(radians);
          $cloud.point.y += $cloud.speed.actual * Math.sin(radians);
          return $cloud.point.convertFormat();
        }
      };
      $space = {
        self: $cloud.self.offsetParent(),
        realWidth: $cloud.self.offsetParent().outerWidth(),
        realHeight: $cloud.self.offsetParent().outerHeight(),
        width: $cloud.self.offsetParent().outerWidth() - $cloud.self.outerWidth(),
        height: $cloud.self.offsetParent().outerHeight() - $cloud.self.outerHeight()
      };
      shift = {
        shiftLimits: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0
        },
        setShiftLimits: function() {
          var angle, dist, distances, radians, shiftPadding;
          angle = 0;
          distances = [];
          shiftPadding = 0;
          while (angle < 180) {
            angle += $cloud.direction.shiftRange;
            if (angle < 180) {
              radians = angle * (Math.PI / 180);
              dist = Math.sin(radians) * $cloud.speed.actual;
              distances.push(dist);
            } else {
              shiftPadding = Math.floor(distances.reduce(function(x, y) {
                return x + y;
              })) + 1;
            }
          }
          return shift.shiftLimits = {
            top: $space.height - shiftPadding,
            right: $space.width - shiftPadding,
            bottom: shiftPadding,
            left: shiftPadding
          };
        },
        changeDir: 0,
        dirMod: 0,
        ClockwiseIf: function(bool) {
          if (bool === true) {
            return shift.changeDir -= shift.dirMod;
          } else {
            return shift.changeDir += shift.dirMod;
          }
        },
        CounterclockwiseIf: function(bool) {
          if (bool === true) {
            return shift.changeDir += shift.dirMod;
          } else {
            return shift.changeDir -= shift.dirMod;
          }
        },
        begin: function() {
          $cloud.direction.facing.check();
          shift.changeDir = 0;
          shift.dirMod = $cloud.direction.shiftRange;
          if ($cloud.point.x <= shift.shiftLimits.left && $cloud.direction.facing.left) {
            shift.ClockwiseIf($cloud.direction.facing.up);
          }
          if ($cloud.point.x >= shift.shiftLimits.right && $cloud.direction.facing.right) {
            shift.CounterclockwiseIf($cloud.direction.facing.up);
          }
          if (shift.changeDir !== 0) {
            shift.dirMod = shift.dirMod * -1;
          }
          if ($cloud.point.y <= shift.shiftLimits.bottom && $cloud.direction.facing.down) {
            shift.CounterclockwiseIf($cloud.direction.facing.right);
          }
          if ($cloud.point.y >= shift.shiftLimits.top && $cloud.direction.facing.up) {
            shift.ClockwiseIf($cloud.direction.facing.right);
          }
          if (shift.changeDir !== 0) {
            return $cloud.direction.actual += shift.changeDir;
          } else {
            return shift.cloudRandomly();
          }
        },
        cloudRandomly: function() {
          $cloud.direction.actual += rand($cloud.direction.shiftRange * -1, $cloud.direction.shiftRange);
          return $cloud.speed.changeRandomly;
        }
      };
      wind = {
        initialize: function() {
          shift.setShiftLimits();
          $cloud.point.x = rand(shift.shiftLimits.left, shift.shiftLimits.right);
          $cloud.point.y = rand(shift.shiftLimits.bottom, shift.shiftLimits.top);
          $cloud.self.css($cloud.point.convertFormat());
          return $cloud.direction.actual = rand(1, 360);
        },
        blowTheCloud: function() {
          shift.begin();
          $cloud.update();
          limit += 1;
          if (limit <= 500) {
            console.log(limit);
            return $cloud.self.animate($cloud.point.cssInput, 60, function() {
              return wind.blowTheCloud();
            });
          }
        }
      };
      wind.initialize();
      limit = 0;
      return wind.blowTheCloud($cloud, $space);
    });
  });

}).call(this);
