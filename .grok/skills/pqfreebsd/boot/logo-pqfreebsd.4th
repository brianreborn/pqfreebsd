\ logo-pqfreebsd.4th — ASCII shield over a sword, ANSI SGR colors.
\ Armor of the trusted base. Replaces the beastie when loader_logo=pqfreebsd.
\ Light-ware License. Copyright (c) 2026 Brian Fundakowski Feldman.
\
\ beastie.4th calls:  logo ( x y -- )
\ Serial still gets the ASCII. Color if the console speaks SGR.
\ Busy-loop delay if ms is absent. TPM / measured boot: not this pass.

27 constant ESC
11 constant CX

0 value lx
0 value ly

: csi ( -- ) ESC emit [char] [ emit ;
: .n ( n -- ) 0 u.r ;
: sgr ( n -- ) csi .n [char] m emit ;
: reset ( -- ) 0 sgr ;
: steel ( -- ) 37 sgr ;
: sage  ( -- ) 32 sgr ;
: hilt  ( -- ) 36 sgr ;
: gleam ( -- ) csi ." 1;97m" ;

: go ( dx dy -- )
  ly + swap lx + swap at-xy
;

: frame-delay
  90000 0 do loop
;

: put ( dx dy -- ) go ;

: blade ( y -- )
  CX 1- swap put steel ." |||" reset
;

: tip ( y -- )
  CX swap put steel ." |" reset
;

: point ( y -- )
  CX 1- swap put steel ." /|\" reset
;

: hilt-row ( -- )
  CX 2- 13 put hilt ." /|||\" reset
  CX 3- 14 put hilt ." =======" reset
;

\ len 1..12 : sword growing down toward the hilt
: draw-sword ( len -- )
  dup 1 < if drop exit then
  12 over - dup 0< if drop 0 then	\ top
  ( len top )
  dup tip
  over 2 < if 2drop exit then
  dup 1+ point
  over 3 < if 2drop exit then
  ( len top )
  12 swap 2 + do
    I blade
  loop
  10 >= if hilt-row then
;

: draw-shield ( -- )
  sage
  6  4 put ." .-----------."
  5  5 put ." /             \"
  4  6 put ." |               |"
  4  7 put ." |               |"
  4  8 put ." |               |"
  5  9 put ." \             /"
  6 10 put ." '-----------'"
  7  7 put ." ----"
  13 7 put ." ----"
  reset
  4 11 do I blade loop
;

: draw-title ( -- )
  CX 4- 15 put sage ." pqfreebsd" reset
;

: gleam-sweep ( x -- )
  dup 3 < if drop exit then
  dup 20 > if drop exit then
  4 12 do
    dup I put gleam ." #" reset
  loop drop
;

: play-logo ( -- )
  13 1 do
    I draw-sword
    frame-delay
  loop
  12 draw-sword
  draw-shield
  frame-delay
  20 4 do
    12 draw-sword
    draw-shield
    I gleam-sweep
    draw-title
    frame-delay
  loop
  12 draw-sword
  draw-shield
  draw-title
;

: logo ( x y -- )
  to ly to lx
  play-logo
;
