$ ->
  rand = ()->
    if arguments.length == 2
      min = arguments[0]
      max = arguments[1]
    else
      min = 0
      max = arguments[0]
    Math.floor(Math.random() * (max-min)) + min

  $("#space img").each ->
    $cloud = $(@)
    $space = $cloud.offsetParent()

    divisions =
      y: 10
      x: 50

    movements = [[-1, -1], [-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1]]

    constraints =
      top:    0
      left:   0
      bottom: divisions.y
      right:  divisions.x

    nextPosition = (position, oldPosition)->
      directions = for movement in movements
        result = [
          position.left + movement[0],
          position.top  + movement[1]
        ]
        if !(constraints.left <= result[0] <= constraints.right) ||
           !(constraints.top  <= result[1] <= constraints.bottom) ||
           (result[0] == oldPosition.left && result[1] == oldPosition.top)
          continue
        result
      direction = directions[rand(directions.length)]
      {
        left: direction[0]
        top:  direction[1]
      }

    cssPositionFor = (position)->
      constraintWidth  = $space.outerWidth()  - $cloud.outerWidth()
      constraintHeight = $space.outerHeight() - $cloud.outerHeight()
      {
        left: "#{Math.floor((position.left * constraintWidth)  / divisions.x)}px"
        top:  "#{Math.floor((position.top  * constraintHeight) / divisions.y)}px"
      }

    wind = (position, oldPosition)->
      position = nextPosition(position, oldPosition)
      oldPosition = position
      $cloud.animate cssPositionFor(position), 2000, ->
        wind(position, oldPosition)

    cloudInitialPosition =
      top:  Math.floor(Math.random() * divisions.y)
      left: Math.floor(Math.random() * divisions.x)

    $cloud.css cssPositionFor(cloudInitialPosition)

    wind cloudInitialPosition, cloudInitialPosition
