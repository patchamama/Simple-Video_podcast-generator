
//Initialization of variables
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

let vplayerPreview = document.getElementById("audio-preview");
let vimagePreviewDiv = document.getElementsByClassName("img-preview")[0]; 
let vimagePreviewSelectedDiv = document.getElementsByClassName("imgs-selected")[0];  //mini-images index

//Update the panels with image (left) and audios
function setDataInHtml(datapos) {
    resetPreview();  //Reset all the images and audios preselected...
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

//Reset the Preview info without audio and images when the complete dataset is changed
function resetPreview() {
    //Reset the player > no audio
    vplayerPreview.stop;
    vplayerPreview.src = "";    

    //Reset the image (no image available)
    vimagePreviewDiv.innerHTML = "<img src='assets/images/No_image_available.svg.png'>";

    //Reset the mini-image index on bottom from the preview-panel
    document.getElementsByClassName("imgs-selected")[0].innerHTML = "";
}


//Update the image in the preview-panel after select image in the list of the left panel
function imagenow(vsrc) {
    vtime = vplayerPreview.currentTime;
    if (vplayerPreview.src.indexOf(".mp3") > 0) {
        vimagePreviewDiv.innerHTML = "<img alt='"+vsrc+' at '+vtime+"secs.' src='"+vsrc+"'>";
        //document.getElementById(audiolist).focus();
        
        //Insert the image + position in the mini-image index on bottom
        //document.getElementsByClassName("imgs-selected")[0]
        vimagePreviewSelectedDiv.innerHTML += `
            <a href="#" onclick="updateImageAt('${vsrc}', ${vtime})">
            <img alt="${vsrc} at ${vtime} secs." src="${vsrc}">
            </a>`;
         
    } else {
        alert("Select first a audio file...");
    }
}

//Show the image and audio position after click the mini-image in the preview-panel
function updateImageAt(vimage, vtime) {
    vimagePreviewDiv.innerHTML = "<img alt='"+vimage+' at '+vtime+" secs.' src='"+vimage+"'>";
    //vplayerPreview.currentTime = vtime;
    document.getElementById("audio-preview").currentTime = vtime;
    //document.getElementsByClassName("imgs-preview")[0].innerHTML = "<img alt='"+vimage+' at '+vtime+" secs.' src='"+vimage+"'>";
}

//Play the audio selected in the listbox
function playnow(vsrc) {
    vplayerPreview.src = vsrc;
    vplayerPreview.play;
}

//Action to be execute in one time?
function updateTrackTime(vplayer) {
    vaudiotime=vplayer.currentTime;
    //console.log(vaudiotime);
}

//==================================================
// Main code to be executed after functions declarations
if (data.length > 0) {
    setDataInHtml(0);
    let vexampleHtml = '<select onchange="setDataInHtml(this.value)">';
    for (let a=0; a<data.length; a++) {
        vexampleHtml += (a === 0) ? '<option selected value="'+(a)+'">'+(data[a].path)+'</option>' : '<option value="'+(a)+'">'+(data[a].path)+'</option>';
        }
    vexampleHtml += "</select>";
    document.getElementById("examples-panel").innerHTML = vexampleHtml;
}

