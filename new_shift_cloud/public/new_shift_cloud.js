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
          x: 25,
          y: 25,
          cssInput: {
            left: "0px",
            top: "0px"
          },
          convert: function() {
            return $cloud.point.cssInput = {
              left: "" + (Math.floor($cloud.point.x)) + "px",
              top: "" + (Math.floor($space.height - $cloud.point.y)) + "px"
            };
          }
        },
        speed: {
          actual: 4,
          max: 6,
          min: 3,
          shiftRange: 1
        },
        direction: {
          actual: 25,
          shiftRange: 10,
          facing: {
            check: function() {
              var _ref, _ref1;
              $cloud.direction.facing.left = false;
              $cloud.direction.facing.right = false;
              $cloud.direction.facing.up = false;
              $cloud.direction.facing.down = false;
              if ((90 < (_ref = $cloud.direction.actual) && _ref < 270)) {
                $cloud.direction.facing.left = true;
              } else {
                $cloud.direction.facing.right = true;
              }
              if ((0 < (_ref1 = $cloud.direction.actual) && _ref1 < 180)) {
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
          radians = $cloud.direction.actual * Math.PI / 180;
          $cloud.point.x += $cloud.speed.actual * Math.cos(radians);
          $cloud.point.y += $cloud.speed.actual * Math.sin(radians);
          return $cloud.point.convert();
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
            if ($cloud > ($space.height / 2)) {
              question = true;
            } else {
              question = false;
            }
            return question;
          },
          theright: function() {
            var question;
            if ($cloud > ($space.width / 2)) {
              question = true;
            } else {
              question = false;
            }
            return question;
          }
        },
        superShift: function() {
          var dirMod, shiftLimits, shiftPadding;
          shiftPadding = $cloud.speed.actual;
          shiftLimits = {
            top: $space.height - shiftPadding,
            right: $space.width - shiftPadding,
            bottom: shiftPadding,
            left: shiftPadding
          };
          dirMod = $cloud.direction.shiftRange;
          if ($cloud.point.x <= shiftLimits.left && $cloud.direction.facing.left) {
            $cloud.doCloudShift = false;
            if ($space.cloudIsOn.thetop()) {
              $cloud.direction.actual += dirMod;
            } else {
              $cloud.direction.actual -= dirMod;
            }
          }
          if ($cloud.point.x >= shiftLimits.right && $cloud.direction.facing.right) {
            $cloud.doCloudShift = false;
            if ($space.cloudIsOn.thetop()) {
              $cloud.direction.actual -= dirMod;
            } else {
              $cloud.direction.actual += dirMod;
            }
          }
          if ($cloud.point.y <= shiftLimits.bottom && $cloud.direction.facing.down) {
            $cloud.doCloudShift = false;
            if ($space.cloudIsOn.theright()) {
              $cloud.direction.actual += dirMod;
            } else {
              $cloud.direction.actual -= dirMod;
            }
          }
          if ($cloud.point.y >= shiftLimits.top && $cloud.direction.facing.up) {
            $cloud.doCloudShift = false;
            if ($space.cloudIsOn.theright()) {
              return $cloud.direction.actual -= dirMod;
            } else {
              return $cloud.direction.actual += dirMod;
            }
          }
        }
      };
      wind = {
        shift: function() {
          $cloud.direction.facing.check();
          $space.superShift();
          $("#space > #shiftPadding").css({
            left: "" + (Math.floor($cloud.speed.actual)) + "px",
            top: "" + (Math.floor($cloud.speed.actual)) + "px",
            width: "" + (Math.floor($space.width - $cloud.speed.actual * 2.0)),
            height: "" + (Math.floor($space.height - $cloud.speed.actual * 2.0))
          });
          console.log("doCloudShift = " + $cloud.doCloudShift);
          $cloud.subShift();
          console.log("Speed = " + $cloud.speed.actual + ", Direction = " + $cloud.direction.actual);
          return $cloud.direction.fix();
        },
        initialize: function() {
          $cloud.point.x = rand($cloud.speed.actual, $space.width - $cloud.speed.actual);
          $cloud.point.y = rand($cloud.speed.actual, $space.height - $cloud.speed.actual);
          $cloud.self.css($cloud.point.convert());
          return $cloud.direction.actual = rand(1, 360);
        },
        blowTheCloud: function() {
          wind.shift();
          $cloud.update();
          limit += 1;
          if (limit <= 20) {
            console.log(limit);
            console.log("" + $cloud.point.cssInput.left + "," + $cloud.point.cssInput.top);
            return $cloud.self.animate($cloud.point.cssInput, 100, function() {
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
