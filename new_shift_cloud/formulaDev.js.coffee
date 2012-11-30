shiftRange = 10
speed = 4

setPadding = ()->
  angle = 0
  string = []
  dist = 0
  distances = []
  while angle < 180
    angle += shiftRange
    if angle < 180
      radians = angle * (Math.PI / 180)
      dist = Math.sin(radians)*speed
      distances.push(dist)
      repeat(angle, string, dist, distances, rounded)
    else
      shiftPadding = Math.floor(distances.reduce (x,y) -> x + y) + 1

alert setPadding()
