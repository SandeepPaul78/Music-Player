let currentsong = new Audio();
let play = document.getElementById("play");
let currentfolder;
let songs;
function formatTime(seconds) {
  if(isNaN(seconds)|| seconds < 0){
    return "0:00";
  }
  let minutes = Math.floor(seconds / 60);
  let secs = Math.floor(seconds % 60);
  if (secs < 10) secs = "0" + secs;
  return `${minutes}:${secs}`;
}



async function getsong(folder) {
  currentfolder = folder;
  let data = [];
  try {
    const response = await fetch(`/api/song/${folder.split('/').pop()}`);
    if (!response.ok) {
      console.error('GET /api/song failed with status', response.status);
    } else {
      const json = await response.json();
      data = Array.isArray(json) ? json : [];

    }
  } catch (e) {
    console.error('Network error fetching songs:', e);
  }

  // let div = document.createElement("div");
  // div.innerHTML = songdata;
  // let as = div.getElementsByTagName("a");

  songs = data;
  // for (let index = 0; index < as.length; index++) {
  //   const element = as[index];
  //   if (element.href.endsWith(".mp3")) {
  //     songs.push(element.href.split("/").pop());
     
  //   }
  // } 
   let songul = document
    .querySelector(".songlist")
    .getElementsByTagName("ul")[0];
    songul.innerHTML = "";
  for (const song of songs) {
    
    songul.innerHTML =
      songul.innerHTML +
      `<li>
                        <div class="music-svg">
                            <img class="music2"src="./Assets/music.svg">
                            <div class="song-name">${decodeURI(song)}</div>
                        </div>
                      
                        <div class="songlist-svg">
                            <img  id="play" src="/Assets/play.svg">
                        </div>

                    </li>`;
  }

  Array.from(
    document.querySelector(".songlist").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", () => {
      playmusic(e.querySelector(".song-name").innerHTML);
      
     
     
    });
  });

  return songs;


}

const playmusic = (track, pause = false) => {
  
  currentsong.src = `/song/${currentfolder.split('/').pop()}/${track}`;
  if (!pause) {
    currentsong.play();
    play.src = "./Assets/pause.svg";
   
  }


  document.querySelector(".song-title").innerHTML = decodeURI(track);
  document.querySelector(".song-time").innerHTML = "0:00/0:00";
};

// async function displayallalbum (){
//     let fetchAlbums  = await fetch(`/api/albums`);
//     let albums  = await fetchAlbums.json();

//   let div = document.createElement("div");
//   div.innerHTML = songdata;
//   let ancor  = div.getElementsByTagName("a")
//   let cardcontainer = document.querySelector(".cardContainer"); 
//   let array = Array.from(ancor);
//     for (let index = 0; index < array.length; index++) {
//       const element = array[index];
//       if(element.href.includes("/song")){
//         let folder = element.href.split("/").slice(-2)[0]
//         let a = await fetch(`/song/${folder}/info.json`);
//         let response = await a.json();
//         cardcontainer.innerHTML = cardcontainer.innerHTML + `<div class="card" data-folder="${folder}">
//                     <div class="greenplay">
//                         <img src="./Assets/greenplay.svg">
//                     </div>
//                     <img src="./song/${folder}/cover.jpg" alt="pbx1">
//                     <h3>
//                      ${response.album}
//                     </h3>
//                     <p >${response.title}</p>
//                 </div>`
        
//        }
      
//     }
      
//   Array.from(document.querySelectorAll(".card")).forEach((e)=>{
//                  e.addEventListener("click", async element=>{
//                        songs =  await getsong(`song/${element.currentTarget.dataset.folder}`)
//                        playmusic(songs[0])
//                        document.querySelector(".left").style.left = "0"; 
                  
                     
//   })
//   })
       
//   }
  

async function displayallalbum() {
    // यहां fetch URL को बदलें
    let fetchAlbums = await fetch(`/api/albums`);
    let albums = await fetchAlbums.json();

    let cardcontainer = document.querySelector(".cardContainer");
    cardcontainer.innerHTML = "";

    albums.forEach(album => {
        cardcontainer.innerHTML += `<div class="card" data-folder="${album.folder}">
            <div class="greenplay">
                <img src="./Assets/greenplay.svg">
            </div>
            <img src="${album.cover}" alt="${album.album} cover">
            <h3>${album.album}</h3>
            <p>${album.title}</p>
        </div>`;
    });

    // Event listeners को अपडेट करें ताकि सही फ़ोल्डर पाथ पास हो
    Array.from(document.querySelectorAll(".card")).forEach((e) => {
        e.addEventListener("click", async () => {
            const folder = e.dataset.folder;
            songs = await getsong(`song/${folder}`);
            playmusic(songs[0]);
            document.querySelector(".left").style.left = "0";
        });
    });
}



async function main() {
  // get the all list of song
 const initialSongs = await getsong('karan-aujla');
  // console.log(songs);
  if (initialSongs.length > 0) {
    playmusic(initialSongs[0], true)
  }


 displayallalbum();
 

  play.addEventListener("click", () => {
    if (currentsong.paused) {
      currentsong.play();
      play.src = "./Assets/pause.svg";

      
    } else {
      currentsong.pause();
      play.src = "./Assets/play.svg";
      
    }
  });

  currentsong.addEventListener("timeupdate", () => {
    document.querySelector(".song-time").innerHTML = `${formatTime(
      currentsong.currentTime
    )}/${formatTime(currentsong.duration)}`;
    document.querySelector(".circle").style.left = (currentsong.currentTime/currentsong.duration) *100 +"%";
    document.querySelector(".progress").style.width = (currentsong.currentTime/currentsong.duration) *100 +"%";
  });

  let seekbar = document.querySelector(".seekbar");
               seekbar.addEventListener("click", (e)=>{
               let circlepercentage = (e.offsetX/e.target.getBoundingClientRect().width)*100;
                      document.querySelector(".circle").style.left = circlepercentage +"%";
                  
                    
                       currentsong.currentTime = ((currentsong.duration)*circlepercentage)/100;
                  document.querySelector(".progress").style.width = circlepercentage +"%";
                           


  });

  document.querySelector(".hamburger").addEventListener("click", ()=>{
    document.querySelector(".left").style.left = "0"; 
  })

  document.querySelector(".close").addEventListener("click", ()=>{
    document.querySelector(".left").style.left = "-120%"; 
  })

  document.getElementById("next").addEventListener("click", ()=>{
    let index = songs.indexOf(currentsong.src.split("/").pop())
    if((index+1) < songs.length){
     playmusic(songs[index+1])
    }
  
  })

    document.getElementById("prev").addEventListener("click", ()=>{
     let index = songs.indexOf(currentsong.src.split("/").pop())
    if((index-1) >= 0){
     playmusic(songs[index-1])
    }
  })

  document.querySelector(".volume").getElementsByTagName("input")[0].addEventListener("change", (e)=>{
    
     currentsong.volume = (parseInt(e.target.value)/100);
   
  });


  currentsong.addEventListener("play", ()=>{
    document.querySelectorAll(".music2").forEach((img)=>{
      img.src = "./Assets/music.svg"
    });

    let currenfile = decodeURI(currentsong.src.split("/").pop());
    let currentli =  Array.from(document.querySelectorAll(".song-name")).
    find((ele)=> ele.innerHTML === currenfile)
    .closest("li")
    if(currentli){
      currentli.querySelector(".music2").src = "./Assets/music2.svg";
    }
  });

  currentsong.addEventListener("pause", ()=>{
    document.querySelectorAll(".music2").forEach((img)=>{
      img.src = "./Assets/music.svg"
    });
  });

  currentsong.addEventListener("ended", ()=>{
    
    play.src= "./Assets/play.svg";
   let index = songs.indexOf(currentsong.src.split("/").pop());
   

   if((index+1)<songs.length){
    playmusic(songs[index+1])
   }

  })



 
    
        
 
}

main();