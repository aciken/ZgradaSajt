// Floor & unit data for the building page.
// Source: PGD 2-10/26-PGD-1, Projekat arhitekture (BSN TEH GRAD, oktobar 2026) – tables 1.5.1 and 1.6.
// status: "free" | "reserved" | "sold"
// type: shown above the unit number; rooms: short structure text; spaces: room-by-room net areas (m²)
window.BUILDING = {
 "slug": "tose-jovanovica-30",
 "name": "Toše Jovanovića 30",
 "words": {
  "unit": ["jedinica", "jedinice", "jedinica"],
  "free": ["slobodna jedinica", "slobodne jedinice", "slobodnih jedinica"],
  "all": "Svi stanovi i apartmani",
  "floor": "Ponuda"
 },
 "image": {
  "src": "../images/tose-jovanovica-30/fasada-2.jpg",
  "width": 1576,
  "height": 766
 },
 "floors": [
  {
   "key": "vp",
   "label": "Visoko prizemlje",
   "polygon": "137,425 1469,425 1469,580 137,580"
  },
  {
   "key": "1",
   "label": "1. sprat",
   "polygon": "137,255 1469,255 1469,425 137,425"
  },
  {
   "key": "ps",
   "label": "Povučeni sprat",
   "polygon": "273,131 1316,131 1316,255 273,255"
  }
 ],
 "apartments": [
  { "num": "A1", "type": "Apartman", "rooms": "Dvosoban, sa lođom", "area": 59.47, "floor": "vp", "status": "free", "spaces": [["Predsoblje", 6.69], ["Kupatilo", 4.72], ["Spavaća soba", 11.95], ["Dnevni boravak sa kuhinjom", 31.77], ["Lođa", 4.34]] },
  { "num": "A2", "type": "Apartman", "rooms": "Dvosoban, sa lođom", "area": 47.35, "floor": "vp", "status": "sold", "spaces": [["Predsoblje", 4.60], ["Kupatilo", 4.68], ["Spavaća soba", 10.39], ["Dnevni boravak sa kuhinjom", 24.96], ["Lođa", 2.72]] },
  { "num": "A3", "type": "Apartman", "rooms": "Dvosoban, sa lođom", "area": 49.76, "floor": "vp", "status": "free", "spaces": [["Predsoblje", 3.86], ["Kupatilo", 4.20], ["Spavaća soba", 10.70], ["Dnevni boravak sa kuhinjom", 27.78], ["Lođa", 3.22]] },
  { "num": "A4", "type": "Apartman", "rooms": "Dvosoban, sa lođom", "area": 59.55, "floor": "vp", "status": "free", "spaces": [["Predsoblje", 5.75], ["Kupatilo", 4.72], ["Spavaća soba", 11.13], ["Dnevni boravak sa kuhinjom", 34.19], ["Lođa", 3.76]] },
  { "num": "A5", "type": "Apartman", "rooms": "Dvosoban, sa lođom", "area": 59.47, "floor": "1", "status": "sold", "spaces": [["Predsoblje", 6.69], ["Kupatilo", 4.72], ["Spavaća soba", 11.95], ["Dnevni boravak sa kuhinjom", 31.77], ["Lođa", 4.34]] },
  { "num": "A6", "type": "Apartman", "rooms": "Dvosoban, sa lođom", "area": 47.35, "floor": "1", "status": "free", "spaces": [["Predsoblje", 4.60], ["Kupatilo", 4.68], ["Spavaća soba", 10.39], ["Dnevni boravak sa kuhinjom", 24.96], ["Lođa", 2.72]] },
  { "num": "A7", "type": "Apartman", "rooms": "Dvosoban, sa lođom", "area": 49.76, "floor": "1", "status": "free", "spaces": [["Predsoblje", 3.86], ["Kupatilo", 4.20], ["Spavaća soba", 10.70], ["Dnevni boravak sa kuhinjom", 27.78], ["Lođa", 3.22]] },
  { "num": "A8", "type": "Apartman", "rooms": "Dvosoban, sa lođom", "area": 59.55, "floor": "1", "status": "sold", "spaces": [["Predsoblje", 5.75], ["Kupatilo", 4.72], ["Spavaća soba", 11.13], ["Dnevni boravak sa kuhinjom", 34.19], ["Lođa", 3.76]] },
  { "num": "S1", "type": "Stan", "rooms": "Dvosoban, sa terasom", "area": 75.63, "floor": "ps", "status": "free", "spaces": [["Predsoblje", 6.90], ["Kupatilo", 4.73], ["Spavaća soba", 10.26], ["Dnevni boravak sa kuhinjom", 26.83], ["Terasa", 26.91]] },
  { "num": "S2", "type": "Stan", "rooms": "Dvosoban, sa lođom", "area": 50.36, "floor": "ps", "status": "sold", "spaces": [["Predsoblje", 3.89], ["Kupatilo", 4.68], ["Spavaća soba", 10.70], ["Dnevni boravak sa kuhinjom", 27.87], ["Lođa", 3.22]] },
  { "num": "S3", "type": "Stan", "rooms": "Trosoban, dva kupatila, sa terasom", "area": 98.13, "floor": "ps", "status": "free", "spaces": [["Predsoblje", 2.78], ["Kupatilo", 2.24], ["Kupatilo", 4.35], ["Predsoblje", 4.79], ["Dnevni boravak / trpezarija", 29.90], ["Spavaća soba", 12.06], ["Spavaća soba", 14.75], ["Terasa", 27.26]] }
 ]
};
