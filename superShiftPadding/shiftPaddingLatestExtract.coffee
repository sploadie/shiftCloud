setShiftLimits: ()->
      angle = 0
      distances = []
      shiftPadding = 0
      while angle < 180
        angle += @cloud.direction.shiftRange
        if angle < 180
          distances.push(Math.sin(angle * (Math.PI / 180)) * @cloud.speed.max)
        else
          shiftPadding = Math.floor(distances.reduce (x,y) -> x + y) + @cloud.speed.max
