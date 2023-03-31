console.log("alert in js...");



let data = [
    { 
        path: "doc/example1",
        audios: ["audio1.mp3", "audio2.mp3"],
        images: ["image001.jpg","image002.jpg","image003.jpg","image004.jpg","image005.jpg",
                 "image006.jpg","image007.jpg","image008.jpg","image009.jpg","image010.jpg",
                 "image011.jpg","image012.jpg","image013.jpg"]
    },
    { 
        path: "doc/example2",
        audios: ["audio1.mp3", "audio2.mp3"],
        images: ["image001.jpg","image002.jpg","image003.jpg","image004.jpg","image005.jpg",
                 "image006.jpg","image007.jpg","image008.jpg","image009.jpg","image010.jpg",
                 "image011.jpg","image012.jpg","image013.jpg"]
    }
];

console.log(data);
console.log(data[0].path+"/"+data[0].images[0]);


function setDataInHtml(datapos) {
    resetPreview();
    let vdata = data[datapos];
    let vpath = vdata.path;  //Path to the images/audios

    //Show images in the page
    let vimghtml = "";
    for (let i=0; i<vdata.images.length; i++) {
        vimghtml += `
        <a href="#" title="${vdata.images[i]}" onclick="imagenow('${vpath}/${vdata.images[i]}')">
        <img src="${vpath}/${vdata.images[i]}">
        </a>
        <hr>
        `;
        console.log(vimghtml);
    }

    //Show audios in the page
    let vaudhtml = `
        <i class="fa-solid fa-microphone-lines"></i>
        <select name="audiolist" id="audiolist" onchange="playnow(this.value)">
            <option value="">Select a audio...</option>`;
    for (let i=0; i<vdata.audios.length; i++) {
        vaudhtml += `
            <option value="${vpath}/${vdata.audios[i]}">${vdata.audios[i]}</option>
        `;
        console.log(vaudhtml);
    }
    vaudhtml += "</select>";

    //Select div with images/audios to insert content
    document.getElementById("images-panel").innerHTML = vimghtml;
    document.getElementById("audios-panel").innerHTML = vaudhtml;
}

//Reset the Preview info without audio and images when the dataset is changed
function resetPreview() {
    //Reset the player > no audio
    vplayer = document.getElementById("audio-preview");
    vplayer.stop;
    vplayer.src = "";    

    //Reset the image (no image available)
    document.getElementsByClassName("img-preview")[0].innerHTML = "<img src='assets/images/No_image_available.svg.png'>";
}

function imagenow(vsrc) {
    if (document.getElementById("audio-preview").src.indexOf(".mp3") > 0) {
        document.getElementsByClassName("img-preview")[0].innerHTML = "<img src='"+vsrc+"'></img>";
        //document.getElementById(audiolist).focus();
        
    } else {
        alert("Select first a audio file...");
    }
}

function playnow(vsrc) {
    vplayer = document.getElementById("audio-preview");
    vplayer.src = vsrc;
    vplayer.play;
}

function updateTrackTime(vplayer) {
    vaudiotime=vplayer.currentTime;
    console.log(vaudiotime);
}


if (data.length > 0) {
    setDataInHtml(0);
    let vexampleHtml = '<select onchange="setDataInHtml(this.value)">';
    for (let a=0; a<data.length; a++) {
        vexampleHtml += (a === 0) ? '<option selected value="'+(a)+'">'+(data[a].path)+'</option>' : '<option value="'+(a)+'">'+(data[a].path)+'</option>';
        }
    vexampleHtml += "</select>";
    document.getElementById("examples-panel").innerHTML = vexampleHtml;
}

