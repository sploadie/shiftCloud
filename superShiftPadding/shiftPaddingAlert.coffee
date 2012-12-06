setShiftLimits = (maxSpeed, shiftRange)->
  angle = 0
  distances = []
  shiftPadding = 0
  string = ""
  while angle < 180
    angle += shiftRange
    if angle < 180
      distances.push(Math.sin(angle * (Math.PI / 180)) * maxSpeed)
    else
      shiftPadding = Math.floor(distances.reduce (x,y) -> x + y) + maxSpeed
  string = "maxSpeed=#{maxSpeed}, shiftRange=#{shiftRange}\nShiftPadding=#{shiftPadding}"

alert setShiftLimits(5, 10)
