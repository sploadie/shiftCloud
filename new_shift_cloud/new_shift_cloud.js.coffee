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
        cssInput:
          left: "0px"
          top:  "0px"
        convertFormat: ()->
          $cloud.point.cssInput =
            left: "#{Math.floor($cloud.point.x)}px"
            top: "#{Math.floor($space.height - $cloud.point.y)}px"
      
      speed:
        actual: 4
        max: 4
        min: 2
        shiftRange: 1

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
      
      doCloudShift: true
      
      subShift: ()->
        if $cloud.doCloudShift == true
          switch $cloud.speed.actual
            when $cloud.speed.max then $cloud.speed.actual -= rand(1, $cloud.speed.shiftRange)
            when $cloud.speed.min then $cloud.speed.actual += rand(1, $cloud.speed.shiftRange)
            else $cloud.speed.actual += rand(($cloud.speed.shiftRange * -1), $cloud.speed.shiftRange)
          if $cloud.speed.actual > $cloud.speed.max then $cloud.speed.actual = $cloud.speed.max
          else if $cloud.speed.actual < $cloud.speed.min then $cloud.speed.actual = $cloud.speed.min
          $cloud.direction.actual += rand(($cloud.direction.shiftRange * -1), $cloud.direction.shiftRange)
        else
          $cloud.doCloudShift = true

    $space =
      self: $cloud.self.offsetParent()
      realWidth: $cloud.self.offsetParent().outerWidth()
      realHeight: $cloud.self.offsetParent().outerHeight()
      width: $cloud.self.offsetParent().outerWidth() - $cloud.self.outerWidth()
      height: $cloud.self.offsetParent().outerHeight() - $cloud.self.outerHeight()
      
      cloudIsOn:
        thetop: ()->
          if $cloud.point.y > ($space.height/2)
            question = true
          else
            question = false
          question
        theright: ()->
          if $cloud.point.x > ($space.width/2)
            question = true
          else
            question = false
          question
      
      setShiftLimits: ()->
        angle = 0
        distances = []
        shiftPadding = 0
        while angle < 180
          angle += $cloud.direction.shiftRange
          if angle < 180
            radians = angle * (Math.PI / 180)
            dist = Math.sin(radians)*$cloud.speed.actual
            distances.push(dist)
          else
            shiftPadding = Math.floor(distances.reduce (x,y) -> x + y) + 1
        $space.shiftLimits =
          top:    $space.height - shiftPadding
          right:  $space.width - shiftPadding
          bottom: shiftPadding
          left:   shiftPadding
        $("#space > #shiftPadding").css #
          left:   "#{$space.shiftLimits.left}px" #
          top:    "#{$space.shiftLimits.bottom}px" #
          width:  "#{$space.shiftLimits.right - shiftPadding}" #
          height: "#{$space.shiftLimits.top - shiftPadding}" #
      
      shiftLimits:
        top:    0
        right:  0
        bottom: 0
        left:   0
      
      superShift: ()->
        $cloud.direction.facing.check()
        corner = false
        dirMod = $cloud.direction.shiftRange
        if $cloud.point.x <= $space.shiftLimits.left   && $cloud.direction.facing.left
          console.log("BOO YEAH!") #
          $cloud.doCloudShift = false
          corner = true
          if $cloud.direction.facing.up
            $cloud.direction.actual -= dirMod
          else
            $cloud.direction.actual += dirMod
        if $cloud.point.x >= $space.shiftLimits.right  && $cloud.direction.facing.right
          console.log("BOO YEAH!") #
          $cloud.doCloudShift = false
          corner = true
          if $cloud.direction.facing.up
            $cloud.direction.actual += dirMod
          else
            $cloud.direction.actual -= dirMod
        if corner then dirMod = dirMod * -1
        if $cloud.point.y <= $space.shiftLimits.bottom && $cloud.direction.facing.down
          console.log("BOO YEAH!") #
          $cloud.doCloudShift = false
          if $cloud.direction.facing.right
            $cloud.direction.actual += dirMod
          else
            $cloud.direction.actual -= dirMod
        if $cloud.point.y >= $space.shiftLimits.top    && $cloud.direction.facing.up
          console.log("BOO YEAH!") #
          $cloud.doCloudShift = false
          if $cloud.direction.facing.right
            $cloud.direction.actual -= dirMod
          else
            $cloud.direction.actual += dirMod
    
    wind =
      shift: ()->
        
        $space.superShift()
        
        console.log("doCloudShift = #{$cloud.doCloudShift}") #
        
        $cloud.subShift()
        
        console.log("Speed = #{$cloud.speed.actual}, Direction = #{$cloud.direction.actual}") #
      
      initialize: ()->
        $cloud.point.x = rand($cloud.speed.actual, ($space.width-$cloud.speed.actual))
        $cloud.point.y = rand($cloud.speed.actual, ($space.height-$cloud.speed.actual))
        $cloud.self.css $cloud.point.convertFormat()
        $cloud.direction.actual = rand(1, 360)
        $space.setShiftLimits()
      
      blowTheCloud: ()->
        
        wind.shift()
        $cloud.update()
        
        limit += 1 #
        if limit <= 1000 #
          console.log(limit) #
          console.log("#{$cloud.point.cssInput.left},#{$cloud.point.cssInput.top}") #
          
          $cloud.self.animate $cloud.point.cssInput, 60, ->
            wind.blowTheCloud()
    
    wind.initialize()
    
    limit = 0 #
    
    wind.blowTheCloud($cloud, $space)
