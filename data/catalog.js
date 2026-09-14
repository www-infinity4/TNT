// Unique seed bucket 8/8 for TNT.
// Control Phi's movie source farm expands this channel toward 96 distinct,
// profile-matched full movies. The seed IDs are never shared with another
// movie-channel seed catalog.
(function(){
  "use strict";

  const rows = [
    ["A Nanny for Christmas",5260,"BaZ_HEj3_0o","Family Central"],
    ["Little Town",5421,"rZWEznf7UIo","Family Central"],
    ["The Terrible Adventure",5636,"8xaioT3zu_Q","Family Central"],
    ["Alone for Christmas",5369,"7t9Kr0Ji0Ew","Family Central"],
    ["Take Time to Dance",5701,"j3Sdr6Na0uY","Christian Movies"],
    ["The Fix It Boys",4805,"JTdhu1fy500","EncourageTV Kids"],
    ["The Little Alien",4838,"e3EtgCCBjJ8","Shout! Studios"],
    ["Spark: A Space Tail",5510,"h7Piwq21Yoc","Shout! Studios"],
    ["Postman Pat: The Movie",5243,"4pJKCjejgCs","Shout! Studios"]
  ];

  window.HERMIT_CATALOG=rows.map(function(row,index){return{id:"TNT-SEED-"+String(index+1).padStart(3,"0"),title:row[0],year:null,collection:"Classic / Western Seed",runtimeSeconds:row[1],videoId:row[2],source:row[3],networkChannel:"TNT",contentClass:"Seed Feature",rating:"Unrated",cleared:true,posterUrl:""};});
  window.INFINITY_CHANNEL={id:"TNT",sourcePolicy:"Unique static seed bucket 8/8. Runtime catalog expansion comes from TNT's own Control Phi source profile.",schedulePolicy:"Seven-day no-repeat scheduler. Missing inventory stays empty until unique sources are harvested; it never wraps the seed list."};
  window.HERMIT_COMMERCIALS=[{id:"AD-001",title:"TNT intermission",durationSeconds:60,videoId:"",cleared:true}];
})();
