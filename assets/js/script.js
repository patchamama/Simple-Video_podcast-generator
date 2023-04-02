
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
let imagesSelected = []; // Store the images selected in the preview {name:"", time:0}
let lastImagesSelectedShowed = 0;

let vplayerPreview = document.getElementById("audio-preview");
let vimagePreviewDiv = document.getElementsByClassName("img-preview")[0]; 
let vimagePreviewSelectedDiv = document.getElementsByClassName("imgs-selected")[0];  //mini-images index


//Update the panels with image (left) and audios
function setDataInHtml(datapos) {
    resetPreview(true);  //Reset all the images and audios preselected...
    let vdata = data[datapos];
    let vpath = vdata.path;  //Path to the images/audios

    //Show images in the page
    let vimghtml = "";
    for (let i=0; i<vdata.images.length; i++) {
        vimghtml += `
        <img class="imgsLeftPanel" onclick="imagenow(this,'${vpath}/${vdata.images[i]}')" src="${vpath}/${vdata.images[i]}">
        </a>
        <hr>`; 
        console.log(vimghtml);
    }

    //Show audios in the page
    let vaudhtml = `
        <i class="fa-solid fa-microphone-lines"></i> Audio:
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
function resetPreview(fullreset) {
    //Reset the player > no audio
    vplayerPreview.stop;
    if (fullreset) {
        vplayerPreview.src = "";
    }
        

    //Reset the image (no image available)
    vimagePreviewDiv.innerHTML = "<img src='assets/images/No_image_available.svg.png'>";

    //Reset the mini-image index on bottom from the preview-panel
    document.getElementsByClassName("imgs-selected")[0].innerHTML = "";

    imagesSelected = [];
    lastImagesSelectedShowed = 0;

    let srcImagesDiv = document.getElementById('images-panel');
    srcImagesDiv.scrollTop = 0;

    document.getElementsByClassName("preview-info")[0].innerHTML = '<i class="fa-solid fa-photo-film"></i>';
}

//Convert timestamp in String(hh:mm:ss) 
function getTimePrint(vtime) {
    vtime = Math.trunc(vtime);
    let hours = Math.floor(vtime % (3600*24) / 3600);
    let mins = Math.floor(vtime % 3600 / 60);
    let secs = Math.floor(vtime % 60);
    
    mins = (mins<=9) ? "0"+mins.toString() : mins.toString();
    secs = (secs<=9) ? "0"+secs.toString() : secs.toString();
    if (hours > 0) {
        hours = (hours<=9) ? "0"+hours.toString() : hours.toString();
        return hours.toString()+":"+mins.toString()+":"+secs.toString();
    } else {  
        return mins.toString()+":"+secs.toString();        
    }
}

//Insert in order of time every image in the var imagesSelected
// and return if is inserted at the end
function insertImgSelectedInTime(vsrc, vtime) {
    //alert("Insertimage "+vsrc+" "+vtime);
    if (imagesSelected.length>0) { 
        let lastimginserted = imagesSelected[imagesSelected.length - 1];
        if (vtime>lastimginserted.time+1) {
            imagesSelected.push({name: vsrc, time: vtime});
            return true;
        } else {
            for (let a=1; a < imagesSelected.length; a++) {
                if ( (vtime < imagesSelected[a].time) &&
                     (vtime > imagesSelected[a-1].time+1) ) {
                    //alert("splice 0");
                    imagesSelected.splice(a,0,{name: vsrc, time: vtime})
                    showAllImageIndex();
                    return false;  
                 } else if (vtime === imagesSelected[a].time) {
                    //alert("splice 1");
                    imagesSelected.splice(a,1,{name: vsrc, time: vtime})
                    showAllImageIndex();
                    return false;  
                } 
            }      

        }  
    } else {
        vtime=0; //The first element begin at the begining > time=0...
        imagesSelected.push({name: vsrc, time: vtime});
        return true;
    }   
}

//Refresh the images selected/not-Selected in the left panel
function updateAllImageLeftPanelSelected(vimagesSeletedArray) {
    let vletfImages = document.getElementsByClassName("imgsLeftPanel");
    for (let a=0; a< vletfImages.length; a++) {
        if (vimagesSeletedArray.includes(vletfImages[a].src)) {
            vletfImages[a].classList.add("img-border-selected");
        } else {
            vletfImages[a].classList.remove("img-border-selected");
        }
    }
}

//Print all the image-index bar
function showAllImageIndex() {
    //alert("showallimage");
    let vbarHTML = "";
    let vtimedifDiv = "";
    let vtimedif = 0;
    let vtimeshow = "";
    let vtimedifToPrint = "";
    let vsrc = "";
    let vtime = 0;
    let vimgSelectedNr = getImgIndexActiveAtCurrentTime();
    let vcurrentImgSelectedHTML = "";
    let vimagesSeletedArray = [];  //Contain the images already selected

    for (let a=0; a< imagesSelected.length; a++) {
        vsrc = imagesSelected[a].name;
        vtime = imagesSelected[a].time;
        vimagesSeletedArray.push(vsrc);
        vtimeshow = getTimePrint(vtime);
        if (a===0) {  // is the firstelement?
            vtimedifDiv = "";
        } else {
            vtimedif = Math.floor(imagesSelected[a].time) - Math.floor(imagesSelected[a-1].time);
            vtimedifToPrint = getTimePrint(vtimedif);
            vtimedifDiv = `
                <div class="indeximg indeximg-duration">
                    <p>-${vtimedifToPrint}-</p>
                </div>`;
        }
        vcurrentImgSelectedHTML = (a===vimgSelectedNr) ? "indeximg-selected" : "";

        //Insert the image + position in the mini-image index on bottom
        vbarHTML += `
            ${vtimedifDiv}
            <div onclick="updateImageAt(this, '${vsrc}', ${vtime})" class="indeximg indeximgstrict ${vcurrentImgSelectedHTML}">
            <img alt="${vsrc} at ${vtime} secs." src="${vsrc}">
            <br>
            ${vtimeshow}
            </div>`;  
    } 
    vimagePreviewSelectedDiv.innerHTML = vbarHTML;
    updateAllImageLeftPanelSelected(vimagesSeletedArray);
}

//Update the image in the preview-panel after select image in the list of the left panel
function imagenow(velem, vsrc) {
    //alert("Imagenow "+vsrc);
    vtime = vplayerPreview.currentTime;
    if (vplayerPreview.src.indexOf(".mp3") > 0) {
        velem.classList.add("img-border-selected");
        vimagePreviewDiv.innerHTML = "<img alt='"+vsrc+' at '+vtime+"secs.' src='"+vsrc+"'>";
        //document.getElementById(audiolist).focus();
       
        //Save image selected in a var to control it... if there was selected images in different time
        let vtimedifDiv = ""; // String with the value of the time between 2 images selected..
        let vtimedif = (imagesSelected.length===0) ? 0 : (Math.floor(vtime) - Math.floor(imagesSelected[imagesSelected.length-1].time) );
        
        // > 0 is inserted after the last image time, < 0 is inserted before the last image inserted
        //if ((vtimedif!==0) ||  (imagesSelected.length===0) ) { //if thereis time difference between the selected images or is the first image > insert the new image
        if (true) {
            let insertedAtTheEnd = insertImgSelectedInTime(vsrc, vtime);
            if (insertedAtTheEnd) {
                let vtimeshow = (vtimedif===0) ? getTimePrint(0) : getTimePrint(vtime);  //time of the image inserted
                if (vtimedif>0) {  //is not the first element?
                    let vtimedifToPrint = getTimePrint(vtimedif);
                    vtimedifDiv = `
                        <div class="indeximg indeximg-duration">
                            <p>+${vtimedifToPrint}+</p>
                        </div>`;
                } 
                //Insert the image + position in the mini-image index on bottom
                //document.getElementsByClassName("imgs-selected")[0]

                let vtempselected = document.getElementsByClassName('indeximg-selected');
                while(vtempselected.length > 0){
                    vtempselected[0].classList.remove('indeximg-selected');
                }
                vimagePreviewSelectedDiv.innerHTML += `
                    ${vtimedifDiv}
                    <div onclick="updateImageAt(this, '${vsrc}', ${vtime})" class="indeximg indeximgstrict indeximg-selected">
                    <img alt="${vsrc} at ${vtime} secs." src="${vsrc}">
                    <br>
                    ${vtimeshow}
                    </div>`;   
                let vtempselected1 = document.getElementsByClassName('indeximgstrict')[imagesSelected.length-1];
                updateImageAt(vtempselected1, vsrc, vtime);        
            } else {  //insert image before the last inserted and reprint all the elements of images-index again...
                //showAllImageIndex();
            }  
        } 

    } else {
        alert("Select first a audio file...");
    }
    //vplayerPreview.play; // When is selected one image, automatically play de audio...
}

//Show the image and audio position after click the mini-image in the preview-panel
function updateImageAt(velem, vimage, vtime) {
    let vtempselected = document.getElementsByClassName('indeximg-selected');
    while(vtempselected.length > 0){
        vtempselected[0].classList.remove("indeximg-selected");
    }
    velem.classList.add("indeximg-selected");
    //alert("updateimageat "+vimage+" "+vtime);
    vimagePreviewDiv.innerHTML = "<img alt='"+vimage+' at '+vtime+" secs.' src='"+vimage+"'>";
    //vplayerPreview.currentTime = vtime;
    document.getElementById("audio-preview").currentTime = vtime;
    //document.getElementsByClassName("imgs-preview")[0].innerHTML = "<img alt='"+vimage+' at '+vtime+" secs.' src='"+vimage+"'>";
    let vactions = `
        | <button onclick="deleteCurrentImg();"><i class="fa-solid fa-trash-can"></i> Delete</button>
        | <i class="fa-solid fa-up-down-left-right"></i> New position: <input onchange="changeImgtimePos(this);" type="number" step="1" maxlength="5" size="5">
    `;

    document.getElementsByClassName("preview-info")[0].innerHTML = '<i class="fa-solid fa-photo-film"></i> Image: '+vimage+vactions;
}

//Play the audio selected in the listbox
function playnow(vsrc) {
    resetPreview(true); //Reset the previews configuration
    vplayerPreview.src = vsrc;
    vplayerPreview.play;
}

//Change position of the image active +-
function changeImgtimePos(velem) {
    let vcurrentImag = getImgIndexActiveAtCurrentTime();
    if (vcurrentImag>0) {
        let vincpos = velem.value;
        velem.value = 0;
        if (!isNaN(vincpos)) {
            let vincposval = parseFloat(vincpos);
            let vsum = imagesSelected[vcurrentImag].time + vincposval;
            if ( (vsum>=0) && (vsum<=vplayerPreview.duration) ) {
                let vsrc = imagesSelected[vcurrentImag].name;
                imagesSelected.splice(vcurrentImag,1);
                insertImgSelectedInTime(vsrc, vsum);
                vplayerPreview.currentTime = vsum;
                imagesSelected[0].time = 0;
                showAllImageIndex();
            } else {
                alert("The value is out of the range: "+vsum.toString());
            }
        }
    } else {
        alert("It is not possible to change the position of the first image")
    }
       
}

//delete the image active in preview-panel
function deleteCurrentImg() {
    if (imagesSelected.length===1) {
        resetPreview(false);
    } else {
        let vcurrentImag = getImgIndexActiveAtCurrentTime();
        imagesSelected.splice(vcurrentImag,1);
        imagesSelected[0].time = 0; //Always the first Image will begin in the position 0 sec.
        showAllImageIndex();
    }

}

//Check if the time of the player correspond with a new imag
function getImgIndexActiveAtCurrentTime() {
    let vaudiotime=vplayerPreview.currentTime;
    let vtimeNext = 0;
    let vtime = 0;
    for (let a=0; a < imagesSelected.length; a++) {
        vtime = imagesSelected[a].time;
        vtimeNext = (a===imagesSelected.length-1) ? 9999999 : imagesSelected[a+1].time; 
        if ( (vaudiotime>=vtime) && (vaudiotime < vtimeNext) ) {
            return a;
        }
    }   
    return 0;
}

//Check if the time of the player correspond with a new imag
function searchAndUpdateImgAtNewTime(vplayer) {
    let vaudiotime=vplayer.currentTime;
    let vtimeNext = 0;
    let vtime = 0;
    for (let a=0; a < imagesSelected.length; a++) {
        vtime = imagesSelected[a].time;
        vtimeNext = (a===imagesSelected.length-1) ? 9999999 : imagesSelected[a+1].time; 
        if ( (vaudiotime>=vtime) && (vaudiotime < vtimeNext) ) {
            let vimage = imagesSelected[a].name;           
            let vtempselected = document.getElementsByClassName('indeximgstrict')[a];
            updateImageAt(vtempselected, vimage, vtime);
            lastImagesSelectedShowed = a;
            break;
        }
    }   
}


//When clic in the preview-imag play or pause the audio...
function changeAudioPlaying() {
    if (vplayerPreview.paused) {
        vplayerPreview.play();
    } else {
        vplayerPreview.pause();
    }
}

//Update time position o the player
function changePlayerTimePos(vinc) {
    let newpos = vplayerPreview.currentTime + vinc;
  if ( (newpos>0) && (newpos < vplayerPreview.duration) ) {
        vplayerPreview.currentTime = newpos;
    } else {
        alert("The value is out of the range: "+newpos.toString());
    }
}

//Action to be execute in one time?
function updateTrackTime(vplayer) {
    vaudiotime=vplayer.currentTime;
    //lastImagesSelectedShowed
    if (imagesSelected.length>1) {
        if (lastImagesSelectedShowed < (imagesSelected.length-1) )  {
            if ( (vaudiotime < imagesSelected[lastImagesSelectedShowed].time) ||  
                (vaudiotime > imagesSelected[lastImagesSelectedShowed+1].time) ) {
                    searchAndUpdateImgAtNewTime(vplayer);
                } 
        } else {  //The last image inserted is showed now!
            if (vaudiotime < imagesSelected[lastImagesSelectedShowed].time) {
                searchAndUpdateImgAtNewTime(vplayer);
            }
        }
    }   
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

