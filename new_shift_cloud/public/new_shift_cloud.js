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
      var $cloud, $space, $this, limit, wind;
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
          actual: 4,
          max: 4,
          min: 2,
          shiftRange: 1
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
        },
        doCloudShift: true,
        subShift: function() {
          if ($cloud.doCloudShift === true) {
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
              $cloud.speed.actual = $cloud.speed.max;
            } else if ($cloud.speed.actual < $cloud.speed.min) {
              $cloud.speed.actual = $cloud.speed.min;
            }
            return $cloud.direction.actual += rand($cloud.direction.shiftRange * -1, $cloud.direction.shiftRange);
          } else {
            return $cloud.doCloudShift = true;
          }
        }
      };
      $space = {
        self: $cloud.self.offsetParent(),
        realWidth: $cloud.self.offsetParent().outerWidth(),
        realHeight: $cloud.self.offsetParent().outerHeight(),
        width: $cloud.self.offsetParent().outerWidth() - $cloud.self.outerWidth(),
        height: $cloud.self.offsetParent().outerHeight() - $cloud.self.outerHeight(),
        cloudIsOn: {
          thetop: function() {
            var question;
            if ($cloud.point.y > ($space.height / 2)) {
              question = true;
            } else {
              question = false;
            }
            return question;
          },
          theright: function() {
            var question;
            if ($cloud.point.x > ($space.width / 2)) {
              question = true;
            } else {
              question = false;
            }
            return question;
          }
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
          $space.shiftLimits = {
            top: $space.height - shiftPadding,
            right: $space.width - shiftPadding,
            bottom: shiftPadding,
            left: shiftPadding
          };
          return $("#space > #shiftPadding").css({
            left: "" + $space.shiftLimits.left + "px",
            top: "" + $space.shiftLimits.bottom + "px",
            width: "" + ($space.shiftLimits.right - shiftPadding),
            height: "" + ($space.shiftLimits.top - shiftPadding)
          });
        },
        shiftLimits: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0
        },
        superShift: function() {
          var corner, dirMod;
          $cloud.direction.facing.check();
          corner = false;
          dirMod = $cloud.direction.shiftRange;
          if ($cloud.point.x <= $space.shiftLimits.left && $cloud.direction.facing.left) {
            console.log("BOO YEAH!");
            $cloud.doCloudShift = false;
            corner = true;
            if ($cloud.direction.facing.up) {
              $cloud.direction.actual -= dirMod;
            } else {
              $cloud.direction.actual += dirMod;
            }
          }
          if ($cloud.point.x >= $space.shiftLimits.right && $cloud.direction.facing.right) {
            console.log("BOO YEAH!");
            $cloud.doCloudShift = false;
            corner = true;
            if ($cloud.direction.facing.up) {
              $cloud.direction.actual += dirMod;
            } else {
              $cloud.direction.actual -= dirMod;
            }
          }
          if (corner) {
            dirMod = dirMod * -1;
          }
          if ($cloud.point.y <= $space.shiftLimits.bottom && $cloud.direction.facing.down) {
            console.log("BOO YEAH!");
            $cloud.doCloudShift = false;
            if ($cloud.direction.facing.right) {
              $cloud.direction.actual += dirMod;
            } else {
              $cloud.direction.actual -= dirMod;
            }
          }
          if ($cloud.point.y >= $space.shiftLimits.top && $cloud.direction.facing.up) {
            console.log("BOO YEAH!");
            $cloud.doCloudShift = false;
            if ($cloud.direction.facing.right) {
              return $cloud.direction.actual -= dirMod;
            } else {
              return $cloud.direction.actual += dirMod;
            }
          }
        }
      };
      wind = {
        shift: function() {
          $space.superShift();
          console.log("doCloudShift = " + $cloud.doCloudShift);
          $cloud.subShift();
          return console.log("Speed = " + $cloud.speed.actual + ", Direction = " + $cloud.direction.actual);
        },
        initialize: function() {
          $cloud.point.x = rand($cloud.speed.actual, $space.width - $cloud.speed.actual);
          $cloud.point.y = rand($cloud.speed.actual, $space.height - $cloud.speed.actual);
          $cloud.self.css($cloud.point.convertFormat());
          $cloud.direction.actual = rand(1, 360);
          return $space.setShiftLimits();
        },
        blowTheCloud: function() {
          wind.shift();
          $cloud.update();
          limit += 1;
          if (limit <= 1000) {
            console.log(limit);
            console.log("" + $cloud.point.cssInput.left + "," + $cloud.point.cssInput.top);
            return $cloud.self.animate($cloud.point.cssInput, 30, function() {
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
