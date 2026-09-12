// TNT resilient classic-movie catalog.
// Paid YouTube Movies/DRM listings are excluded because protected storefront IDs
// can fail in third-party embeds. The Turner Vault remains the editorial target;
// this live rotation uses ordinary full-length classic uploads until an approved
// embeddable source for a Vault title is connected.
window.HERMIT_CATALOG = [
  { id:"TNT-SAFE-001", title:"Things to Come", year:1936, collection:"TNT Future Worlds", runtimeSeconds:5820, videoId:"22cOGjikPG8", source:"Established classic full-length upload", networkChannel:"TNT", cleared:true },
  { id:"TNT-SAFE-002", title:"Phantom from Space", year:1953, collection:"TNT Science-Fiction Matinee", runtimeSeconds:4380, videoId:"SN8R3k73qj0", source:"Established classic full-length upload", networkChannel:"TNT", cleared:true },
  { id:"TNT-SAFE-003", title:"Missile to the Moon", year:1958, collection:"TNT Moon Mission", runtimeSeconds:4680, videoId:"PkSlAmx_wnk", source:"Established classic full-length upload", networkChannel:"TNT", cleared:true },
  { id:"TNT-SAFE-004", title:"The Monster of Piedras Blancas", year:1959, collection:"TNT Creature Feature", runtimeSeconds:4740, videoId:"SYKl4PtdPUA", source:"Established classic full-length upload", networkChannel:"TNT", cleared:true },
  { id:"TNT-SAFE-005", title:"The Amazing Transparent Man", year:1960, collection:"TNT Strange Science", runtimeSeconds:4680, videoId:"OvJS9WFW7Uc", source:"Established classic full-length upload", networkChannel:"TNT", cleared:true },
  { id:"TNT-SAFE-006", title:"The Phantom Planet", year:1961, collection:"TNT Atomic Sci-Fi", runtimeSeconds:4920, videoId:"MqaN40sbap4", source:"Established classic full-length upload", networkChannel:"TNT", cleared:true },
  { id:"TNT-SAFE-007", title:"Attack from Space", year:1965, collection:"TNT Space Adventure", runtimeSeconds:3000, videoId:"duc_edJQaxU", source:"Established classic full-length upload", networkChannel:"TNT", cleared:true }
].map(movie => ({ ...movie, posterUrl:"" }));

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
  era:"Turner classics + cable favorites",
  reset:"12:00 AM viewer local time",
  sourcePolicy:"No YouTube Movies DRM IDs, age-restricted videos, trailers, promos or short clips.",
  schedulePolicy:"Daily deterministic lineup; a new rotation begins at local midnight."
};

window.HERMIT_COMMERCIALS = [
  { id:"TNT-ID-1", title:"TNT station break", durationSeconds:60, videoId:"", cleared:true },
  { id:"TNT-ID-2", title:"Turner Vault — coming up next", durationSeconds:60, videoId:"", cleared:true },
  { id:"TNT-ID-3", title:"TNT Classic Movie Night", durationSeconds:60, videoId:"", cleared:true }
];
