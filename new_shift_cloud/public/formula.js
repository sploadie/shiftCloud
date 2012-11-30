(function() {
  var angles, limit, plus, repeat, speed, string;

  angles = 0;

  speed = 1;

  limit = 0;

  string = "";

  plus = 2.5;

  repeat = function() {
    var otherlimit, repeatplus, total;
    limit += plus;
    if (limit < 41) {
      angles = Math.ceil(180 / limit);
      total = 0;
      otherlimit = 0;
      repeatplus = function() {
        var radians;
        otherlimit += 1;
        if (otherlimit < angles) {
          radians = limit * otherlimit * (Math.PI / 180);
          total += Math.sin(radians) * speed;
          return repeatplus();
        }
      };
      repeatplus();
      string = string + ("" + limit + "\n" + total + "\n");
      return repeat();
    }
  };

  repeat();

  string = string + "\n";

  alert(string);

}).call(this);
