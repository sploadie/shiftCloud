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
  string = "S=#{maxSpeed}_sR=#{shiftRange}_M1=#{shiftPadding}"
  
  shiftPadding = Math.floor( maxSpeed/Math.sin((shiftRange/2) * (Math.PI / 180)) ) + maxSpeed
  string += "_M2=#{shiftPadding}\n"

string = ""
string += setShiftLimits(num, 5) for num in [1..20]
alert string

string = ""
string += setShiftLimits(5, num) for num in [1..20]
alert string
