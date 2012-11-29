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
        x: 25
        y: 25
        cssInput:
          left: "0px"
          top:  "0px"
        convert: ()->
          $cloud.point.cssInput =
            left: "#{Math.floor($cloud.point.x)}px"
            top: "#{Math.floor($space.height - $cloud.point.y)}px"

      speed:
        actual: 4 #Initial
        max: 6
        min: 3
        shiftRange: 1 #X2

      direction:
        actual: 25
        shiftRange: 10 #X2
        facing:
          check: ()->
            #Update which two directions the cloud is "facing"
            $cloud.direction.facing.left = false; $cloud.direction.facing.right = false
            $cloud.direction.facing.up   = false; $cloud.direction.facing.down  = false
            if 90 < $cloud.direction.actual < 270
              $cloud.direction.facing.left  = true
            else
              $cloud.direction.facing.right = true
            if  0 < $cloud.direction.actual < 180
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
        #Update the cloud point
        radians = $cloud.direction.actual * Math.PI / 180
        $cloud.point.x += $cloud.speed.actual * Math.cos(radians)
        $cloud.point.y += $cloud.speed.actual * Math.sin(radians)
        #Update 
        $cloud.point.convert()
      
      doCloudShift: true
      
      subShift: ()->
        #Cloud does its thing if space didn't bother.
        if $cloud.doCloudShift == true
          #Shift speed...
          switch $cloud.speed.actual
            when $cloud.speed.max then $cloud.speed.actual -= rand(1, $cloud.speed.shiftRange)
            when $cloud.speed.min then $cloud.speed.actual += rand(1, $cloud.speed.shiftRange)
            else $cloud.speed.actual += rand(($cloud.speed.shiftRange * -1), $cloud.speed.shiftRange)
          #Check: doesn't apply until speed.shiftRange > 1
          if $cloud.speed.actual > $cloud.speed.max then $cloud.speed.actual = $cloud.speed.max
          else if $cloud.speed.actual < $cloud.speed.min then $cloud.speed.actual = $cloud.speed.min
          #Shift direction...
          $cloud.direction.actual += rand(($cloud.direction.shiftRange * -1), $cloud.direction.shiftRange)
        else
          #Reset doCloudShift for next check if it was false
          $cloud.doCloudShift = true

    $space =
      self: $cloud.self.offsetParent()
      
      realWidth: $cloud.self.offsetParent().outerWidth() #Dependant on .self
      realHeight: $cloud.self.offsetParent().outerHeight() #Dependant on .self
      
      width: $cloud.self.offsetParent().outerWidth() - $cloud.self.outerWidth() #Dependant on .realWidth
      height: $cloud.self.offsetParent().outerHeight() - $cloud.self.outerHeight() #Dependant on .realHeight
      
      cloudIsOn:
        thetop: ()->
          if $cloud > ($space.height/2)
            question = true
          else
            question = false
          question
        theright: ()->
          if $cloud > ($space.width/2)
            question = true
          else
            question = false
          question
      
      superShift: ()->
        shiftPadding = $cloud.speed.actual #+ $cloud.direction.shiftRange #<=CHANGE THESE ACCORDING TO TESTS
        shiftLimits =
          top: $space.height - shiftPadding
          right: $space.width - shiftPadding
          bottom: shiftPadding
          left: shiftPadding
        dirMod = $cloud.direction.shiftRange #<======================CHANGE THESE ACCORDING TO TESTS
        #LEFT
        if $cloud.point.x <= shiftLimits.left   && $cloud.direction.facing.left
          $cloud.doCloudShift = false
          if $space.cloudIsOn.thetop()
            $cloud.direction.actual += dirMod
          else
            $cloud.direction.actual -= dirMod
        #RIGHT
        if $cloud.point.x >= shiftLimits.right  && $cloud.direction.facing.right
          $cloud.doCloudShift = false
          if $space.cloudIsOn.thetop()
            $cloud.direction.actual -= dirMod
          else
            $cloud.direction.actual += dirMod
        #BOTTOM
        if $cloud.point.y <= shiftLimits.bottom && $cloud.direction.facing.down
          $cloud.doCloudShift = false
          if $space.cloudIsOn.theright()
            $cloud.direction.actual += dirMod
          else
            $cloud.direction.actual -= dirMod
        #TOP
        if $cloud.point.y >= shiftLimits.top    && $cloud.direction.facing.up
          $cloud.doCloudShift = false
          if $space.cloudIsOn.theright()
            $cloud.direction.actual -= dirMod
          else
            $cloud.direction.actual += dirMod
    
    
    
    wind =
      #Does ALL the shifting.
      shift: ()->
        
        $cloud.direction.facing.check()
        
        $space.superShift()
        
        $("#space > #shiftPadding").css #
          left:   "#{Math.floor($cloud.speed.actual)}px" #
          top:    "#{Math.floor($cloud.speed.actual)}px" #
          width:  "#{Math.floor($space.width - ($cloud.speed.actual) * 2.0)}" #
          height: "#{Math.floor($space.height - ($cloud.speed.actual) * 2.0)}" #
        console.log("doCloudShift = #{$cloud.doCloudShift}") #
        
        $cloud.subShift()
        
        console.log("Speed = #{$cloud.speed.actual}, Direction = #{$cloud.direction.actual}") #
        
        $cloud.direction.fix()
      
      #Create cloud beginning position and direction
      initialize: ()->
        $cloud.point.x = rand($cloud.speed.actual, ($space.width-$cloud.speed.actual))
        $cloud.point.y = rand($cloud.speed.actual, ($space.height-$cloud.speed.actual))
        $cloud.self.css $cloud.point.convert()
        $cloud.direction.actual = rand(1, 360)
      
      #Move loop
      blowTheCloud: ()->
        
        wind.shift()
        $cloud.update()
        
        limit += 1 #
        if limit <= 20 #
          console.log(limit) #
          console.log("#{$cloud.point.cssInput.left},#{$cloud.point.cssInput.top}") #
          
          $cloud.self.animate $cloud.point.cssInput, 100, ->
            wind.blowTheCloud()
    
    
    
    wind.initialize()
    
    limit = 0 #
    
    wind.blowTheCloud($cloud, $space)
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
