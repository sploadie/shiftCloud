(function() {

  $(function() {
    var CloudDriver, Position, SpeedGear, Vehicle, Wheel, rand;
    rand = function() {
      var max, min;
      if (arguments.length === 2) {
        min = arguments[0];
        max = arguments[1];
      } else {
        min = 0;
        max = arguments[0];
      }
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    Position = (function() {

      function Position(x, y) {
        this.x = x;
        this.y = y;
      }

      Position.prototype.toCSS = function() {
        return {
          left: "" + (Math.floor(this.x)) + "px",
          top: "" + (Math.floor(this.y)) + "px"
        };
      };

      return Position;

    })();
    SpeedGear = (function() {

      function SpeedGear(actual, min, max, shiftRange) {
        this.actual = actual;
        this.min = min;
        this.max = max;
        this.shiftRange = shiftRange;
      }

      SpeedGear.prototype.changeRandomly = function() {
        if (this.max !== this.min) {
          switch (this.actual) {
            case this.max:
              this.actual -= rand(1, this.shiftRange);
              break;
            case this.min:
              this.actual += rand(1, this.shiftRange);
              break;
            default:
              this.actual += rand(this.shiftRange * -1, this.shiftRange);
          }
          if (this.actual > this.max) {
            return this.actual = this.max;
          } else if (this.actual < this.min) {
            return this.actual = this.min;
          }
        }
      };

      return SpeedGear;

    })();
    Wheel = (function() {

      function Wheel(actual, shiftRange) {
        this.shiftRange = shiftRange;
        this.setActual(actual);
      }

      Wheel.prototype.setActual = function(value) {
        return this.actual = (360 + value % 360) % 360;
      };

      Wheel.prototype.turnBy = function(value) {
        return this.setActual(this.actual + value);
      };

      Wheel.prototype.turnRandomly = function() {
        return this.turnBy(rand(this.shiftRange * -1, this.shiftRange));
      };

      Wheel.prototype.facingLeft = function() {
        var _ref;
        return (90 < (_ref = this.actual) && _ref <= 270);
      };

      Wheel.prototype.facingRight = function() {
        return !this.facingLeft();
      };

      Wheel.prototype.facingUp = function() {
        var _ref;
        return (0 < (_ref = this.actual) && _ref <= 180);
      };

      Wheel.prototype.facingDown = function() {
        return !this.facingUp();
      };

      return Wheel;

    })();
    Vehicle = (function() {

      function Vehicle(self) {
        this.self = self;
        this.point = new Position(0, 0);
        this.speed = new SpeedGear(5, 5, 5, 1);
        this.direction = new Wheel(rand(1, 360), 10);
      }

      Vehicle.prototype.update = function() {
        var radians;
        radians = this.direction.actual * Math.PI / 180;
        this.point.x += this.speed.actual * Math.cos(radians);
        this.point.y += this.speed.actual * Math.sin(radians);
        return this.point.toCSS();
      };

      return Vehicle;

    })();
    CloudDriver = (function() {

      function CloudDriver(cloud) {
        this.cloud = cloud;
        this.constraint = this.cloud.self.offsetParent();
        this.setShiftLimits();
        this.cloud.point.x = rand(this.shiftLimits.left, this.shiftLimits.right);
        this.cloud.point.y = rand(this.shiftLimits.bottom, this.shiftLimits.top);
        this.cloud.self.css(this.cloud.point.toCSS());
      }

      CloudDriver.prototype.drive = function() {
        var _this = this;
        this.begin();
        return this.cloud.self.animate(this.cloud.update(), 10, function() {
          return _this.drive();
        });
      };

      CloudDriver.prototype.setShiftLimits = function() {
        var shiftPadding;
        shiftPadding = Math.floor(this.cloud.speed.max / Math.sin((this.cloud.direction.shiftRange / 2) * (Math.PI / 180))) + this.cloud.speed.max;
        return this.shiftLimits = {
          top: this.constraint.outerHeight() - this.cloud.self.outerHeight() - shiftPadding,
          right: this.constraint.outerWidth() - this.cloud.self.outerWidth() - shiftPadding,
          bottom: shiftPadding,
          left: shiftPadding
        };
      };

      CloudDriver.prototype.clockwiseIf = function(bool) {
        if (bool === true) {
          return -1;
        } else {
          return 1;
        }
      };

      CloudDriver.prototype.begin = function() {
        var changeDir, dirMod;
        changeDir = 0;
        dirMod = this.cloud.direction.shiftRange;
        if (this.cloud.point.x <= this.shiftLimits.left && this.cloud.direction.facingLeft()) {
          changeDir += (this.clockwiseIf(this.cloud.direction.facingUp())) * dirMod;
        }
        if (this.cloud.point.x >= this.shiftLimits.right && this.cloud.direction.facingRight()) {
          changeDir += (this.clockwiseIf(this.cloud.direction.facingDown())) * dirMod;
        }
        if (changeDir !== 0) {
          dirMod = dirMod * -1;
        }
        if (this.cloud.point.y <= this.shiftLimits.bottom && this.cloud.direction.facingDown()) {
          changeDir += (this.clockwiseIf(this.cloud.direction.facingLeft())) * dirMod;
        }
        if (this.cloud.point.y >= this.shiftLimits.top && this.cloud.direction.facingUp()) {
          changeDir += (this.clockwiseIf(this.cloud.direction.facingRight())) * dirMod;
        }
        if (changeDir !== 0) {
          return this.cloud.direction.turnBy(changeDir);
        } else {
          this.cloud.direction.turnRandomly();
          return this.cloud.speed.changeRandomly();
        }
      };

      return CloudDriver;

    })();
    return $("#space img").each(function() {
      var $cloud, driver;
      $cloud = $(this);
      driver = new CloudDriver(new Vehicle($cloud));
      return driver.drive();
    });
  });

}).call(this);
