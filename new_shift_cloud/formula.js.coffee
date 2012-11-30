angles = 0
speed = 1
limit = 0
string = ""
plus = 2.5
repeat = ()->
  limit += plus
  if limit < 41
    angles = Math.ceil(180/limit)
    total = 0
    otherlimit = 0
    repeatplus = ()->
      otherlimit += 1
      if otherlimit < angles
        radians = limit * otherlimit * (Math.PI / 180)
        total += Math.sin(radians)*speed
        repeatplus()
    repeatplus()
    string = string + "#{limit}\n#{total}\n"
    repeat()
repeat()

string = string + "\n"

alert string
