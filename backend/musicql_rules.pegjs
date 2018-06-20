//TODO check query length to begin with!
//^should this only be done serverside?
{
  const queryObj ={$and:[]};
  const cm = require("concertmaster");
}

start = _(clause)(_"and"_ clause)*_

clause = (musicTerm / instrumentRange / composerInstrument)

instrumentRange = instrument:([a-zA-Z0-9])+ _ min:([a-gA-G][b|#]?[0-9]) _ max:([a-gA-G][b|#]?[0-9])

composerInstrument = ci:([a-zA-Z0-9]+)

musicTerm = "ts"_ beats:([1-9][0-9]?) _ beatType:([1-9][0-9]?)
/ "tempo" _ min:([0-9][0-9]?[0-9]?) _ max:([1-9][0-9]?[0-9]?)
/ "key" _ key:([a-gA-G][b|#]?)
/ "dynamic" _ dynamic:
("ffffff"/"fffff"/"ffff"/"fff"/"ff"/"fp"/"fz"/"f"/"mf"/
"mp"/"pppppp"/"ppppp"/"pppp"/"ppp"/"pp"/"p"/"rfz"/
"rf"/"sfz"/"sffz"/"sfpp"/"sfp"/"sf")

_ "whitespace"
  = [ \t\n\r]*

