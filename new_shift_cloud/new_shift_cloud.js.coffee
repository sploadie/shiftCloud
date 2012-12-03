$ ->
  rand = ()->
    if arguments.length == 2
      min = arguments[0]
      max = arguments[1]
    else
      min = 0
      max = arguments[0]
    Math.floor(Math.random() * ((max + 1) - min)) + min

  $("#space img").each ->
    $this = $(@)
    
    $cloud =
      self: $this
      point:
        x: 0
        y: 0
        convertFormat: ()->
          cssInput =
            left: "#{Math.floor($cloud.point.x)}px"
            top: "#{Math.floor($space.height - $cloud.point.y)}px"
      speed:
        actual: 5
        max: 5
        min: 5
        shiftRange: 1
        changeRandomly: ()->
          unless $cloud.speed.max == $cloud.speed.min
            switch $cloud.speed.actual
              when $cloud.speed.max then $cloud.speed.actual -= rand(1, $cloud.speed.shiftRange)
              when $cloud.speed.min then $cloud.speed.actual += rand(1, $cloud.speed.shiftRange)
              else $cloud.speed.actual += rand(($cloud.speed.shiftRange * -1), $cloud.speed.shiftRange)
            if $cloud.speed.actual > $cloud.speed.max then $cloud.speed.actual = $cloud.speed.max
            else if $cloud.speed.actual < $cloud.speed.min then $cloud.speed.actual = $cloud.speed.min
      direction:
        actual: 0
        shiftRange: 10
        facing:
          check: ()->
            $cloud.direction.fix()
            $cloud.direction.facing.left = false; $cloud.direction.facing.right = false
            $cloud.direction.facing.up   = false; $cloud.direction.facing.down  = false
            if 90 < $cloud.direction.actual <= 270
              $cloud.direction.facing.left  = true
            else
              $cloud.direction.facing.right = true
            if  0 < $cloud.direction.actual <= 180
              $cloud.direction.facing.up    = true
            else
              $cloud.direction.facing.down  = true
          up: false
          right: false
          down: false
          left: false
        fix: ()->
          if $cloud.direction.actual > 360
            $cloud.direction.actual -= 360
            $cloud.direction.fix()
          if $cloud.direction.actual < 1
            $cloud.direction.actual += 360
            $cloud.direction.fix()
      update: ()->
        $cloud.direction.fix()
        radians = $cloud.direction.actual * Math.PI / 180
        $cloud.point.x += $cloud.speed.actual * Math.cos(radians)
        $cloud.point.y += $cloud.speed.actual * Math.sin(radians)
        $cloud.point.convertFormat()

    $space =
      self: $cloud.self.offsetParent()
      realWidth: $cloud.self.offsetParent().outerWidth()
      realHeight: $cloud.self.offsetParent().outerHeight()
      width: $cloud.self.offsetParent().outerWidth() - $cloud.self.outerWidth()
      height: $cloud.self.offsetParent().outerHeight() - $cloud.self.outerHeight()
      
    shift =
      shiftLimits:
        top:    0
        right:  0
        bottom: 0
        left:   0
      setShiftLimits: ()->
        angle = 0
        distances = []
        shiftPadding = 0
        while angle < 180
          angle += $cloud.direction.shiftRange
          if angle < 180
            radians = angle * (Math.PI / 180)
            dist = Math.sin(radians) * $cloud.speed.max
            distances.push(dist)
          else
            shiftPadding = Math.floor(distances.reduce (x,y) -> x + y) + 1 + $cloud.speed.max
        shift.shiftLimits =
          top:    $space.height - shiftPadding
          right:  $space.width  - shiftPadding
          bottom: shiftPadding
          left:   shiftPadding
      changeDir: 0
      dirMod:    0
      ClockwiseIf: (bool)->
        if bool is true then shift.changeDir -= shift.dirMod
        else shift.changeDir += shift.dirMod
      CounterclockwiseIf: (bool)->
        if bool is true then shift.changeDir += shift.dirMod
        else shift.changeDir -= shift.dirMod
      begin: ()->
        $cloud.direction.facing.check()
        shift.changeDir = 0
        shift.dirMod = $cloud.direction.shiftRange
        if $cloud.point.x <= shift.shiftLimits.left   && $cloud.direction.facing.left
          shift.ClockwiseIf $cloud.direction.facing.up
        if $cloud.point.x >= shift.shiftLimits.right  && $cloud.direction.facing.right
          shift.CounterclockwiseIf $cloud.direction.facing.up
        if shift.changeDir isnt 0 then shift.dirMod = shift.dirMod * -1
        if $cloud.point.y <= shift.shiftLimits.bottom && $cloud.direction.facing.down
          shift.CounterclockwiseIf $cloud.direction.facing.right
        if $cloud.point.y >= shift.shiftLimits.top    && $cloud.direction.facing.up
          shift.ClockwiseIf $cloud.direction.facing.right
        if shift.changeDir isnt 0 then $cloud.direction.actual += shift.changeDir
        else shift.cloudRandomly()
      cloudRandomly: ()->
        $cloud.direction.actual += rand(($cloud.direction.shiftRange * -1), $cloud.direction.shiftRange)
        $cloud.speed.changeRandomly

    wind =
      initialize: ()->
        shift.setShiftLimits()
        $cloud.point.x = rand(shift.shiftLimits.left, (shift.shiftLimits.right))
        $cloud.point.y = rand(shift.shiftLimits.bottom, (shift.shiftLimits.top))
        $cloud.self.css $cloud.point.convertFormat()
        $cloud.direction.actual = rand(1, 360)
      blowTheCloud: ()->
        shift.begin()
        $cloud.self.animate $cloud.update(), 60, ->
          wind.blowTheCloud()
    
    wind.initialize()
    wind.blowTheCloud($cloud, $space)
