// Playback policy: R-rated and age-restricted movie entries are excluded from this channel rotation.
// TNT classic-movie channel.
// The live rotation uses full-length sources previously proven usable in the Infinity channel family.
window.HERMIT_CATALOG = [
  { id:"TNT-001", title:"Masters of the Universe", year:1987, collection:"TNT Fantasy Night", runtimeSeconds:6346, videoId:"NTG2PESRurY", source:"YouTube Movies", cleared:true },
  { id:"TNT-002", title:"UHF", year:1989, collection:"TNT Cult Comedy", runtimeSeconds:5833, videoId:"uAiyO8oEG4E", source:"YouTube Movies", cleared:true },
  { id:"TNT-004", title:"The Karate Kid", year:1984, collection:"TNT Saturday Classic", runtimeSeconds:7616, videoId:"-slifyirmX0", source:"YouTube Movies", cleared:true },
  { id:"TNT-005", title:"The Dark Crystal", year:1982, collection:"TNT Fantasy Vault", runtimeSeconds:5596, videoId:"4XMRm9igLGo", source:"YouTube Movies", cleared:true },
  { id:"TNT-006", title:"Labyrinth", year:1986, collection:"TNT Fantasy Vault", runtimeSeconds:6072, videoId:"lL_Q0VtrTxU", source:"YouTube Movies", cleared:true },
  { id:"TNT-007", title:"Bill & Ted's Excellent Adventure", year:1989, collection:"TNT Time Travel", runtimeSeconds:5390, videoId:"a72W8hP9QNE", source:"YouTube Movies", cleared:true },
  { id:"TNT-008", title:"Bill & Ted's Bogus Journey", year:1991, collection:"TNT Time Travel", runtimeSeconds:5633, videoId:"2nwyLnPj6SI", source:"YouTube Movies", cleared:true },
  { id:"TNT-010", title:"Waiting for Guffman", year:1996, collection:"TNT Comedy Vault", runtimeSeconds:5019, videoId:"9mdSMAmzo34", source:"YouTube Movies", cleared:true }
].map(movie => ({ ...movie, posterUrl:"", networkChannel:"TNT" }));

window.TNT_VAULT = [
  "Gone with the Wind", "The Wizard of Oz", "Casablanca", "The Maltese Falcon",
  "Singin' in the Rain", "2001: A Space Odyssey", "King Kong", "Citizen Kane",
  "North by Northwest", "Ben-Hur", "The Dirty Dozen", "Cool Hand Luke",
  "The Great Escape", "Network", "Dog Day Afternoon", "Poltergeist",
  "A Streetcar Named Desire", "The Philadelphia Story", "An American in Paris",
  "Meet Me in St. Louis", "The Treasure of the Sierra Madre", "Key Largo",
  "The Adventures of Robin Hood", "The Thin Man", "Freaks", "Forbidden Planet",
  "The Asphalt Jungle", "The Bad and the Beautiful", "Seven Brides for Seven Brothers",
  "A Night at the Opera", "Adam's Rib", "The Postman Always Rings Twice"
];

window.INFINITY_CHANNEL = {
  id:"TNT",
  name:"TNT",
  era:"Turner classics + 1980s/1990s cable favorites",
  reset:"12:00 AM viewer local time",
  schedulePolicy:"Keep the checked-in TNT classic catalog playing continuously; never replace it with empty inventory."
};

window.HERMIT_COMMERCIALS = [
  { id:"TNT-ID-1", title:"TNT station break", durationSeconds:60, videoId:"", cleared:true },
  { id:"TNT-ID-2", title:"Turner Vault — coming up next", durationSeconds:60, videoId:"", cleared:true },
  { id:"TNT-ID-3", title:"TNT Classic Movie Night", durationSeconds:60, videoId:"", cleared:true }
];
