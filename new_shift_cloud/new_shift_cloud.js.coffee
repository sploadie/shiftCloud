$ ->
  rand = ()->
    if arguments.length == 2
      min = arguments[0]
      max = arguments[1]
    else
      min = 0
      max = arguments[0]
    Math.floor(Math.random() * (max - min + 1)) + min

  class Position
    constructor: (@x, @y)->
    toCSS: ()->
      left: "#{Math.floor(@x)}px"
      top:  "#{Math.floor(@y)}px"

  class SpeedGear
    constructor: (@actual, @min, @max, @shiftRange)->
    changeRandomly: ()->
      unless @max == @min
        switch @actual
          when @max then @actual -= rand(1, @shiftRange)
          when @min then @actual += rand(1, @shiftRange)
          else @actual += rand((@shiftRange * -1), @shiftRange)
        if @actual > @max then @actual = @max
        else if @actual < @min then @actual = @min

  class Wheel
    constructor:  (actual, @shiftRange)->
      @setActual(actual)
    setActual:    (value)-> @actual = (360 + value % 360) % 360
    turnBy:       (value)-> @setActual(@actual + value)
    turnRandomly: -> @turnBy(rand((@shiftRange * -1), @shiftRange))
    facingLeft:   -> 90 < @actual <= 270
    facingRight:  -> ! @facingLeft()
    facingUp:     -> 0 < @actual <= 180
    facingDown:   -> ! @facingUp()

  class Vehicle
    constructor: (@self)->
      @point     = new Position(0, 0)
      @speed     = new SpeedGear(5, 5, 5, 1)
      @direction = new Wheel(rand(1, 360), 10)
    update: ()->
      radians = @direction.actual * Math.PI / 180
      @point.x += @speed.actual * Math.cos(radians)
      @point.y += @speed.actual * Math.sin(radians)
      @point.toCSS()

  class CloudDriver
    constructor: (@cloud)->
      @constraint = @cloud.self.offsetParent()
      @setShiftLimits()
      @cloud.point.x = rand(@shiftLimits.left,   (@shiftLimits.right))
      @cloud.point.y = rand(@shiftLimits.bottom, (@shiftLimits.top))
      @cloud.self.css @cloud.point.toCSS()
    drive: ()->
      @begin()
      @cloud.self.animate @cloud.update(), 10, => @drive()
    setShiftLimits: ()->
      shiftPadding = Math.floor(@cloud.speed.max / Math.sin((@cloud.direction.shiftRange / 2) * (Math.PI / 180))) + @cloud.speed.max
      @shiftLimits =
        top:    @constraint.outerHeight() - @cloud.self.outerHeight() - shiftPadding
        right:  @constraint.outerWidth()  - @cloud.self.outerWidth()  - shiftPadding
        bottom: shiftPadding
        left:   shiftPadding
    clockwiseIf: (bool)->
      if bool is true then -1 else 1
    begin: ()->
      changeDir = 0
      dirMod = @cloud.direction.shiftRange
      if @cloud.point.x <= @shiftLimits.left   && @cloud.direction.facingLeft()
        changeDir += (@clockwiseIf @cloud.direction.facingUp())    * dirMod
      if @cloud.point.x >= @shiftLimits.right  && @cloud.direction.facingRight()
        changeDir += (@clockwiseIf @cloud.direction.facingDown())  * dirMod
      if changeDir isnt 0 then dirMod = dirMod * -1
      if @cloud.point.y <= @shiftLimits.bottom && @cloud.direction.facingDown()
        changeDir += (@clockwiseIf @cloud.direction.facingLeft())  * dirMod
      if @cloud.point.y >= @shiftLimits.top    && @cloud.direction.facingUp()
        changeDir += (@clockwiseIf @cloud.direction.facingRight()) * dirMod
      if changeDir isnt 0
        @cloud.direction.turnBy(changeDir)
      else
        @cloud.direction.turnRandomly()
        @cloud.speed.changeRandomly()

  $("#space img").each ->
    $cloud = $(@)
    driver = new CloudDriver(new Vehicle($cloud))
    driver.drive()
