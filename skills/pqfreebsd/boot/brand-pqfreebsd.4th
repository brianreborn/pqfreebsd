\ brand-pqfreebsd.4th — wordmark beside the menu. Not the beastie.
\ Light-ware License. Copyright (c) 2026 Brian Fundakowski Feldman.
\
\ beastie.4th calls: brand ( x y -- ) when loader_brand="pqfreebsd"

27 constant ESC
: csi ( -- ) ESC emit [char] [ emit ;
: sage ( -- ) csi ." 32m" ;
: dim  ( -- ) csi ." 2;90m" ;
: reset ( -- ) csi ." 0m" ;

: brand+ ( x y -- )
  2dup at-xy sage ." pqfreebsd" reset
  1+ at-xy dim ." pq all the things" reset
;

: brand ( x y -- ) brand+ ;
