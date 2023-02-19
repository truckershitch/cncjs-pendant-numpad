Here are the current coded key assigments.  This is primary documentation for myself.  It's fresh in mind now, but you never know when a squirrel sighting will send a project to the back burner for years.

```
[01] [02] [03] [04]

[05] [06] [07] [08]

[09] [10] [11] [12]

[13] [14] [15] [16]
               [  ]
[17   18] [19] [20]
```
- 01:
  - layer swap.  lights green LED (Numlock), enables second/lower/green function on some keys.  keys without green functions function on both layers.  this first button does nothing on its own (cannot!), it simply toggles numlock... errr... "the green layer"
- 02:
  - set movement to 0.1mm
  - green: stop running GCode
- 03:
  - set movement to 1.0mm
  - green: pause or resume GCode, depending on current state
- 04:
  - set movement to 10mm
  - green: start ("play") loaded GCode
- 05:
  - move back and left, X-- Y++
- 06:
  - move back, Y++
- 07:
  - move back and right, X++ Y++
- 08:
  - move up, Z++
  - green: toggle spindle (at full speed)
- 09:
  - move left, X--
- 10:
  - move XY to local coordinate zero
  - green: zero out XY local coordinates at current position
- 11:
  - move right, X++
- 12:
  - move down, Z--
  - green: zero out Z local at current position
- 13:
  -  move forward and left, X-- Y--
- 14:
  - move forward, Y--
- 15:
  - move foward and right, X++ Y--
  - green: run macro to traverse the outline of current GCode at safe Z (10)
- 16-20:
  - panic! stop all movement! (executes gcode RESET)
- 17-18
  - unlock
- 19
  - execute z-probe with zero offset (z-probe offsets are zero because we are PCB-centric)
  - green: run and apply z-probe grid on current GCode, zero offset


