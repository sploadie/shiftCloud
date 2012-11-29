class OctoCloud

  #Point we're gunning for on the next quarter line/Past point/Latest mapped coordinates
  attr_reader destination_point, past_point, cloud_x, cloud_y, cloud_width, cloud_height
  #Sides of the planet
  def sides
    @sides
  end

  #What side where we last at?
  #Or set side.
  def side( arg )
    raise ArgumentError unless arg == nil || @sides.include?(arg.to_sym)
    return @sides.first if arg == nil

    arg = arg.to_sym
    @sides.rotate! until @sides.first == arg
    @sides.first
  end

  #What side are we going to?
  def destination?
    @sides.at(1)
  end

  #Set the destination point randomly
  def make_destination_point(space, planet)
    dest = destination?.to_s
    cloud_size = case dest
                 when 'left'||'right' then @cloud_width/2
                 when 'top'||'bottom' then @cloud_height/2
                 else raise ArgumentError
                 end
    max = eval("space.#{dest} - cloud_size").to_i
    min = eval("planet.#{dest} + cloud_size").to_i
    @destination_point = eval( "planet.#{dest} + cloud_size + #{rand( (max-min)-1 ).to_s}" )
  end

  #We got to the side, prepare to go to the next one...
  def destination_arrived(space, planet)
    @past_point = @destination_point
    @sides.rotate!
    make_destination_point(space, planet)
  end

  #Define next target point
  def next_point(current_x)
    calc_x = current_x + 20 #Set pixel timer HERE <==============================================================
    calc_sep = [ 1, (calc_x**2) , (@destination_point**2) , (@past_point**2)]
    p calc_sep #REMOVE AFTER TESTING
    calc_y = Math.sqrt( ( calc_sep(0) - ( calc_sep(1) / calc_sep(2) ) ) * calc_sep(3) )
    puts calc_y.to_s #REMOVE
    @cloud_x = calc_x
    @cloud_y = calc_y
    nil
  end

  def initialize( width, height, space, planet)
    @cloud_width = width
    @cloud_height = height !!,
    @sides = [:top,:right,:bottom,:left]
    side( @sides.sample )
    make_destination_point(space,planet) #A fake one where the cloud will spawn; will actually be first past_point
    destination_arrived(space,planet)
    planet.draw_cloud( side, 0, @past_point )
    next_point( 0 )
    planet.move_cloud_to( side, @cloud_x, @cloud_y )
  end
end
