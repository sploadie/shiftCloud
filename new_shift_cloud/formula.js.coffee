shiftRange = 10
speed = 4

setPadding = (speed,angleChange)->
  angle = 0
  distances = []
  while angle < 180
    angle += shiftRange
    if angle < 180
      radians = angle * (Math.PI / 180)
      dist = Math.sin(radians)*speed
      distances.push(dist)
    else
      alert( Math.floor(distances.reduce (x,y) -> x + y) + 1 )

setPadding(speed, shiftRange)
