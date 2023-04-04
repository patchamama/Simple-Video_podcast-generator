//Initialization of variables
let data = [{
    path: "doc/example1",
    audios: ["audio1.mp3", "audio2.mp3"],
    images: ["image001.jpg", "image002.jpg", "image003.jpg", "image004.jpg", "image005.jpg",
        "image006.jpg", "image007.jpg", "image008.jpg", "image009.jpg", "image010.jpg",
        "image011.jpg", "image012.jpg", "image013.jpg"
    ]
}, {
    path: "doc/example2",
    audios: ["audio1.mp3", "audio2.mp3"],
    images: ["image001.jpg", "image002.jpg", "image003.jpg", "image004.jpg", "image005.jpg",
        "image006.jpg", "image007.jpg", "image008.jpg", "image009.jpg", "image010.jpg",
        "image011.jpg", "image012.jpg", "image013.jpg"
    ]
}];
let imagesSelected = []; // Store the images selected in the preview {name:"", time:0}
let lastImagesSelectedShowed = 0;
let vfirstTimeScriptExecuted = true;
let vdata = []; //Dataset active
let vpath = "" //Path to the images/audios

let vplayerPreview = document.getElementById("audio-preview");
let vimagePreviewDiv = document.getElementsByClassName("img-preview")[0];
let vimagePreviewSelectedDiv = document.getElementsByClassName("imgs-selected")[0]; //mini-images index
let vresultsDiv = document.getElementsByClassName("result-details")[0]; //results
let vdebug = false;  //debug in console data?


/**
* func that process the data of one of the dataset > datapos 
* and fills in the elements of the corresponding data panels in the html
* (audio and images)
*/
function setDataInHtml(datapos) {
    if (vdebug) {
        console.log(arguments.callee.name + " " + vplayerPreview.currentTime);
    }
    resetPreview(true); //Reset all the images and audios preselected...
    vdata = data[datapos];
    vpath = vdata.path; //Path to the images/audios

    //Show images in the left panel 
    let vimghtml = "";
    for (let i = 0; i < vdata.images.length; i++) {
        vimghtml +=
            `
        <div class="divImgsLeftPanel">
        <img class="imgsLeftPanel" onclick="imagenow(this,'${vpath}/${vdata.images[i]}')" src="${vpath}/${vdata.images[i]}" alt="${vdata.images[i]}">
        </div>`;
        console.log(vimghtml);
    }

    //Show audios in the main panel
    let vaudhtml =
        `
        <i class="fa-solid fa-microphone-lines"></i> Audio:
        <select name="audiolist" id="audiolist" onchange="playnow(this.value)">
            <option value="">Select a audio...</option>`;
    for (let i = 0; i < vdata.audios.length; i++) {
        vaudhtml += `
            <option value="${vpath}/${vdata.audios[i]}">${vdata.audios[i]}</option>
        `;
    }
    vaudhtml += "</select>";

    //Select the div with images/audios to insert content
    document.getElementById("images-panel").innerHTML = vimghtml;
    document.getElementById("audios-panel").innerHTML = vaudhtml;
}


/**
* Reset all the info selected (preview-info) >no audio and images selected
* when the complete dataset is changed
*/
function resetPreview(fullreset) {
    if (vdebug) {
        console.log(arguments.callee.name + " " + vplayerPreview.currentTime);
    }
    //Reset the player > no audio
    vplayerPreview.pause();
    if (fullreset) {
        vplayerPreview.src = "";
    }

    //Reset the image (no image available)
    if (!vfirstTimeScriptExecuted) {
        vimagePreviewDiv.innerHTML = "<img src='assets/images/No_image_available.svg.png' alt='Image with content not images selected'>";
    }

    //Reset the mini-image index on bottom from the preview-panel
    document.getElementsByClassName("imgs-selected")[0].innerHTML = "";

    imagesSelected = [];
    lastImagesSelectedShowed = 0;

    let srcImagesDiv = document.getElementById('images-panel');
    srcImagesDiv.scrollTop = 0;

    document.getElementsByClassName("preview-info")[0].innerHTML = '<i class="fa-solid fa-photo-film"></i>';
    showAllImageIndex();
    vfirstTimeScriptExecuted = false;
}

/**
* Convert timestamp in String(hh:mm:ss) format
*/
function getTimePrint(vtime) {
    if (vdebug) {
        console.log(arguments.callee.name + " " + vplayerPreview.currentTime);
    }
    vtime = Math.trunc(vtime);
    let hours = Math.floor(vtime % (3600 * 24) / 3600);
    let mins = Math.floor(vtime % 3600 / 60);
    let secs = Math.floor(vtime % 60);

    mins = (mins <= 9) ? "0" + mins.toString() : mins.toString();
    secs = (secs <= 9) ? "0" + secs.toString() : secs.toString();
    if (hours > 0) {
        hours = (hours <= 9) ? "0" + hours.toString() : hours.toString();
        return hours.toString() + ":" + mins.toString() + ":" + secs.toString();
    } else {
        return mins.toString() + ":" + secs.toString();
    }
}

/**
* Insert in the array (imagesSelected) a image selected and the time of the player
* and return if the new element inserted was inserted at the end
*/
function insertImgSelectedInTime(vsrc, vtime) {
    if (vdebug) {
        console.log(arguments.callee.name + " " + vplayerPreview.currentTime);
    }
    if (imagesSelected.length > 0) {
        let lastimginserted = imagesSelected[imagesSelected.length - 1];
        if (vtime > lastimginserted.time + 1) {
            imagesSelected.push({
                name: vsrc,
                time: vtime
            });
            return true;
        } else {
            for (let a = 1; a < imagesSelected.length; a++) {
                if ((vtime < imagesSelected[a].time) &&
                    (vtime > imagesSelected[a - 1].time + 1)) {
                    imagesSelected.splice(a, 0, {
                        name: vsrc,
                        time: vtime
                    })
                    showAllImageIndex();
                    return false;
                } else if (vtime === imagesSelected[a].time) {
                    imagesSelected.splice(a, 1, {
                        name: vsrc,
                        time: vtime
                    })
                    showAllImageIndex();
                    return false;
                } else if (vtime === imagesSelected[a - 1].time) {
                    imagesSelected.splice(a - 1, 1, {
                        name: vsrc,
                        time: vtime
                    })
                    showAllImageIndex();
                    return false;
                }
            }
        }
    } else {
        vtime = 0; //The first element(image) is inserted at the begining > time=0...
        imagesSelected.push({
            name: vsrc,
            time: vtime
        });
        return true;
    }
}

/**
* Refresh the images selected/not-Selected in the left panel
*/
// function updateAllImageLeftPanelSelected(vimagesSeletedArray) {
    // if (vdebug) {
        // console.log(arguments.callee.name + " " + vplayerPreview.currentTime);
    // }
    // let vleftImages = document.getElementsByClassName("imgsLeftPanel");
    // let vurlhost = window.location.protocol + "//" + window.location.hostname + "/";
    // let vpathimg = "";
    // for (let a = 0; a < vleftImages.length; a++) {
        // vpathimg = vleftImages[a].src.replace(vurlhost, "");
        // if (vimagesSeletedArray.includes(vpathimg)) {
            // vleftImages[a].classList.add("img-border-selected");
        // } else {
            // vleftImages[a].classList.remove("img-border-selected");
        // }
    // }
// }

/**
* Update the results generate (command line) after any change done...
*/
function showResults() {
    if (vdebug) {
        console.log(arguments.callee.name + " " + vplayerPreview.currentTime);
    }
    if (imagesSelected.length === 0) {
        document.getElementsByClassName("result-info")[0].innerHTML =
            `
            <i class="fa-solid fa-terminal"></i> Results:`;
        vresultsDiv.innerHTML = "";
        return;
    }
    let vurlhost = window.location.protocol + "//" + window.location.hostname + "/";
    let vaudiofile = vplayerPreview.src.split("/").pop();
    let vimageFile = "";
    let vfiltercomplex = "";
    let vfiltercomplexPost = "";
    let vwithFilters = false;
    let vtimeDuration = "";

    if (vresultsDiv.innerHTML === "") {
        document.getElementsByClassName("result-info")[0].innerHTML =
            `
        <i class="fa-solid fa-terminal"></i> Results:
        <span class="field-action"><select><option>ffmpeg command line</option></select></span>
        <span class="field-action"><input type="checkbox" id="use-fullpath" onchange="showResults()" > Use file path</span>
        <span class="field-action"><input type="checkbox" id="use-effects" onchange="showResults()" > Use fadeIn/Out</span>
        <span class="field-action"><input type="checkbox" id="use-imgreadjust" onchange="showResults()" checked > Readjust images size</span>
        `;
    }

    vresultsDiv.innerHTML = "";
    vwithFilters = ((document.getElementById("use-imgreadjust").checked) || (document.getElementById("use-effects").checked));

    vresultsDiv.innerHTML += `
        <br>
        <span class="emphasis-filename">Command Line:</span>
        <br>
        ffmpeg -y \\<br>`;
    for (let a = 0; a < imagesSelected.length; a++) {
        vimageFile = imagesSelected[a].name;
        if (!document.getElementById("use-fullpath").checked) {
            vimageFile = vimageFile.split("/").pop();
        }
        vtimeDuration = (a === (imagesSelected.length - 1)) ? "" : "-t " + String(Math.floor(imagesSelected[a + 1].time -
            imagesSelected[a].time));
        vresultsDiv.innerHTML +=
            `-loop 1 ${vtimeDuration} -i <span class="emphasis-filename">"${vimageFile}"</span> \\<br>`;

        if (vwithFilters) {
            vfiltercomplex += `[${a}:v]`;
            if (document.getElementById("use-imgreadjust").checked) {
                vfiltercomplex +=
                    `scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2,setsar=1`;
            }
            if (document.getElementById("use-effects").checked) {
                if (document.getElementById("use-imgreadjust").checked) {
                    vfiltercomplex += ",";
                }
                vfiltercomplex += `fade=t=in:st=0:d=1,fade=t=out:st=4:d=1`;
            }
            vfiltercomplex += `[v${a}]; \\ <br>`;
            vfiltercomplexPost += `[v${a}]`;

        }
    }

    if (!document.getElementById("use-fullpath").checked) {
        vaudiofile = vaudiofile.split("/").pop();
    }

    if (!document.getElementById("use-imgreadjust").checked) {
        document.getElementsByClassName("comment-info")[0].innerHTML =
            '<i class="fa-solid fa-circle-exclamation"></i> If the input images varying or are arbitrary sizes, better use the option "Readjust images size" or errors may be generated';
    } else {
        document.getElementsByClassName("comment-info")[0].innerHTML = '';
    }

    vresultsDiv.innerHTML +=
        `
        -i <span class="emphasis-filename">"${vaudiofile}"</span> \\<br>
        -filter_complex \\<br>
        "${vfiltercomplex}${vfiltercomplexPost}concat=n=${imagesSelected.length}:v=1:a=0,format=yuv420p[v]" -map "[v]" -map ${imagesSelected.length}:a -shortest -movflags +faststart <span class="emphasis-filename">"video.mp4"</span><br>
        </div>`;
    }

/**
* Show all the preselected images in image-index bar
*/
function showAllImageIndex() {
    if (vdebug) {
        console.log(arguments.callee.name + " " + vplayerPreview.currentTime);
    }
    let vbarHTML = "";
    let vtimedifDiv = "";
    let vtimedif = 0;
    let vtimeshow = "";
    let vtimedifToPrint = "";
    let vsrc = "";
    let vtime = 0;
    let vimgSelectedNr = getImgIndexActiveAtCurrentTime();
    let vcurrentImgSelectedHTML = "";
    let vimagesSeletedArray = []; //Contain the images already selected

    for (let a = 0; a < imagesSelected.length; a++) {
        vsrc = imagesSelected[a].name;
        vtime = imagesSelected[a].time;
        vimagesSeletedArray.push(vsrc);
        vtimeshow = getTimePrint(vtime);
        if (a === 0) { // is the firstelement?
            vtimedifDiv = "";
        } else {
            vtimedif = Math.floor(imagesSelected[a].time) - Math.floor(imagesSelected[a - 1].time);
            vtimedifToPrint = getTimePrint(vtimedif);
            vtimedifDiv =
                `
                <div class="indeximg indeximg-duration">
                    <p>-${vtimedifToPrint}-</p>
                </div>`;
        }
        vcurrentImgSelectedHTML = (a === vimgSelectedNr) ? "indeximg-selected" : "";

        //Insert the image + position in the mini-image index on bottom
        vbarHTML +=
            `
            ${vtimedifDiv}
            <div onclick="updateImageAt(this, '${vsrc}', ${vtime}, true)" class="indeximg indeximgstrict ${vcurrentImgSelectedHTML}">
            <img alt="${vsrc} at ${vtime} secs." src="${vsrc}">
            <br>
            ${vtimeshow}
            </div>`;
    }
    vimagePreviewSelectedDiv.innerHTML = vbarHTML;
    //updateAllImageLeftPanelSelected(vimagesSeletedArray);
    showResults();
}

/**
* Update the image in the preview-panel (main image) 
* after select image in the list of images of the left panel
*/
function imagenow(velem, vsrc) {
    if (vdebug) {
        console.log(arguments.callee.name + " " + vplayerPreview.currentTime);
    }
    vtime = vplayerPreview.currentTime;
    if (vplayerPreview.src.indexOf(".mp3") > 0) {
        velem.classList.add("img-border-selected");
        vimagePreviewDiv.innerHTML = "<img alt='" + vsrc + ' at ' + vtime + "secs.' src='" + vsrc + "'>";
        //document.getElementById(audiolist).focus();

        //Save image selected in a var to control it... if there was selected images in different time
        let vtimedifDiv = ""; // String with the value of the time between 2 images selected..
        let vtimedif = (imagesSelected.length === 0) ? 0 : (Math.floor(vtime) - Math.floor(imagesSelected[
            imagesSelected.length - 1].time));

        // > 0 is inserted after the last image time, < 0 is inserted before the last image inserted
        //if ((vtimedif!==0) ||  (imagesSelected.length===0) ) { //if thereis time difference between the selected images or is the first image > insert the new image
        if (true) {
            let insertedAtTheEnd = insertImgSelectedInTime(vsrc, vtime);
            if (insertedAtTheEnd) {
                let vtimeshow = (vtimedif === 0) ? getTimePrint(0) : getTimePrint(vtime); //time of the image inserted
                if (vtimedif > 0) { //is not the first element?
                    let vtimedifToPrint = getTimePrint(vtimedif);
                    vtimedifDiv =
                        `
                        <div class="indeximg indeximg-duration">
                            <p>+${vtimedifToPrint}+</p>
                        </div>`;
                }
                //Insert the image + position in the mini-image index on bottom
                //document.getElementsByClassName("imgs-selected")[0]
                let vtempselected = document.getElementsByClassName('indeximg-selected');
                while (vtempselected.length > 0) {
                    vtempselected[0].classList.remove('indeximg-selected');
                }
                vimagePreviewSelectedDiv.innerHTML +=
                    `
                    ${vtimedifDiv}
                    <div onclick="updateImageAt(this, '${vsrc}', ${vtime}, true)" class="indeximg indeximgstrict indeximg-selected">
                    <img alt="${vsrc} at ${vtime} secs." src="${vsrc}">
                    <br>
                    ${vtimeshow}
                    </div>`;
                let vtempselected1 = document.getElementsByClassName('indeximgstrict')[imagesSelected.length - 1];
                updateImageAt(vtempselected1, vsrc, vtime, false);
                showAllImageIndex();
            } else { //insert image before the last inserted and reprint all the elements of images-index again...
                //showAllImageIndex();
            }
        }

    } else {
        alert("Select first a audio file...");
    }
    //vplayerPreview.play; // When is selected one image, automatically play de audio...
}

/**
* Show/Update the image and audio position after click the mini-image in the preview-panel with images-preselected
*/
function updateImageAt(velem, vimage, vtime, updateTime) {
    if (vdebug) {
        console.log(arguments.callee.name + " " + vplayerPreview.currentTime);
    }

    let vtempselected = document.getElementsByClassName('indeximg-selected');
    while (vtempselected.length > 0) {
        vtempselected[0].classList.remove("indeximg-selected");
    }
    velem.classList.add("indeximg-selected");
    vimagePreviewDiv.innerHTML = "<img alt='" + vimage + ' at ' + vtime + " secs.' src='" + vimage + "'>";
    //vplayerPreview.currentTime = vtime;
    if (updateTime) {
        vplayerPreview.currentTime = vtime;
        //document.getElementById("audio-preview").currentTime = Number(vtime);
     }

    //document.getElementsByClassName("imgs-preview")[0].innerHTML = "<img alt='"+vimage+' at '+vtime+" secs.' src='"+vimage+"'>";
    let vactions =
        `
        <span class="field-action"><button onclick="deleteCurrentImg();"><i class="fa-solid fa-trash-can"></i> Delete</button></span>
        <span class="field-action"><i class="fa-solid fa-up-down-left-right"></i> Set (secs): <input onchange="changeImgtimePos(this);" type="number" step="1" maxlength="2" size="2"></span>
        <span class="field-action"><i class="fa-solid fa-wand-magic-sparkles"></i> Insert images every <input onchange="autoGenSec(this);" type="number" step="1" maxlength="2" size="2"> secs.</span>
        `;
    vimage = vimage.split("/").pop();
    document.getElementsByClassName("preview-info")[0].innerHTML = '<i class="fa-solid fa-photo-film"></i> Image: ' +
        vimage + vactions;
}


/**
* Delete all the imgs selected and regenerate with the sequence of the present imgs every x secs
*/
function autoGenSec(velem) {
    if (vdebug) {
        console.log(arguments.callee.name + " " + vplayerPreview.currentTime);
    }
    let vtimeseq = Number(velem.value);
    imagesSelected = []; //delete all the imgs selected
    vplayerPreview.pause();
    let vleftImages = document.getElementsByClassName("imgsLeftPanel");
    let vpathimg = "";
    for (a = 0; a < vplayerPreview.duration; a = a + vtimeseq) {
        for (let c = 0; c < vleftImages.length; c++) {
            vpathimg = vpath + "/" + vleftImages[c].src.split("/").pop();
            imagesSelected.push({
                name: vpathimg,
                time: a
            });
            if (c < vleftImages.length - 1) {
                a = a + vtimeseq;
            }
            if (a >= vplayerPreview.duration) {
                break;
            }
            console.log(a + " " + vpathimg);
        }
    }
    vplayerPreview.currentTime = 0;
    showAllImageIndex();
    if (document.getElementsByClassName('indeximgstrict').length > 0) {
        document.getElementsByClassName('indeximgstrict')[0].click();
    }

}


/**
* Play the audio selected in the listbox
*/
function playnow(vsrc) {
    if (vdebug) {
        console.log(arguments.callee.name + " " + vplayerPreview.currentTime);
    }
    resetPreview(true); //Reset the previews configuration
    vplayerPreview.src = vsrc;
    vplayerPreview.play;
    let vactions =
        `
        <i class="fa-solid fa-wand-magic-sparkles"></i> Insert images every <input onchange="autoGenSec(this);" type="number" step="1" maxlength="2" size="2"> secs. 
        `;

    document.getElementsByClassName("preview-info")[0].innerHTML = '<i class="fa-solid fa-photo-film"></i> ' + vactions;

}

/**
* Change the position of the image active in the preselected images: imagesSelected
*/
function changeImgtimePos(velem) {
    if (vdebug) {
        console.log(arguments.callee.name + " " + vplayerPreview.currentTime);
    }
    let vcurrentImag = getImgIndexActiveAtCurrentTime();
    if (vcurrentImag > 0) {
        let vincpos = velem.value;
        velem.value = 0;
        if (!isNaN(vincpos)) {
            let vincposval = parseFloat(vincpos);
            let vsum = imagesSelected[vcurrentImag].time + vincposval;
            if ((vsum >= 0) && (vsum <= vplayerPreview.duration)) {
                let vsrc = imagesSelected[vcurrentImag].name;
                imagesSelected.splice(vcurrentImag, 1);
                insertImgSelectedInTime(vsrc, vsum);
                vplayerPreview.currentTime = vsum;
                imagesSelected[0].time = 0;
                showAllImageIndex();
            } else {
                alert("The value is out of the range: " + vsum.toString());
            }
        }
    } else {
        alert("It is not possible to change the position of the first image")
    }

}

/**
* Delete the image active in the preview-panel
*/
function deleteCurrentImg() {
    if (vdebug) {
        console.log(arguments.callee.name + " " + vplayerPreview.currentTime);
    }
    if (imagesSelected.length === 1) {
        resetPreview(false);
    } else {
        let vcurrentImag = getImgIndexActiveAtCurrentTime();
        imagesSelected.splice(vcurrentImag, 1);
        imagesSelected[0].time = 0; //Always the first Image will begin in the position 0 sec.
        showAllImageIndex();
        lastImagesSelectedShowed = (vcurrentImag > imagesSelected.length - 1) ? imagesSelected.length - 1 :
            vcurrentImag;
    }
}

/**
* Check if the time of the player correspond with any new imag
* an return the index of array imagesSelected with reference to the image
*/
function getImgIndexActiveAtCurrentTime() {
    if (vdebug) {
        console.log(arguments.callee.name + " " + vplayerPreview.currentTime);
    }
    let vaudiotime = vplayerPreview.currentTime;
    let vtimeNext = 0;
    let vtime = 0;
    for (let a = 0; a < imagesSelected.length; a++) {
        vtime = imagesSelected[a].time;
        vtimeNext = (a === imagesSelected.length - 1) ? 9999999 : imagesSelected[a + 1].time;
        if ((vaudiotime >= vtime) && (vaudiotime < vtimeNext)) {
            return a;
        }
    }
    return 0;
}

/**
* Check if the time of the player correspond with a new imag and
* update the image in the main panel (preview-image)
*/
function searchAndUpdateImgAtNewTime(vplayer) {
    if (vdebug) {
        console.log(arguments.callee.name + " " + vplayerPreview.currentTime);
    }
    let vaudiotime = vplayer.currentTime;
    let vtimeNext = 0;
    let vtime = 0;
    for (let a = 0; a < imagesSelected.length; a++) {
        vtime = imagesSelected[a].time;
        vtimeNext = (a === imagesSelected.length - 1) ? 9999999 : imagesSelected[a + 1].time;
        if ((vaudiotime >= vtime) && (vaudiotime < vtimeNext)) {
            let vimage = imagesSelected[a].name;
            let vtempselected = document.getElementsByClassName('indeximgstrict')[a];
            updateImageAt(vtempselected, vimage, vtime, false);
            lastImagesSelectedShowed = a;
            break;
        }
    }
}

/**
* When clic in the preview-imag, play or pause the audio...
*/
function changeAudioPlaying() {
    if (vdebug) {
        console.log(arguments.callee.name + " " + vplayerPreview.currentTime);
    }
    if (vplayerPreview.paused) {
        vplayerPreview.play();
    } else {
        vplayerPreview.pause();
    }
}
/**
* Update time position of the image active in the player
*/
function changePlayerTimePos(vinc) {
    if (vdebug) {
        console.log(arguments.callee.name + " " + vplayerPreview.currentTime);
    }
    let newpos = vplayerPreview.currentTime + vinc;
    if ((newpos > 0) && (newpos < vplayerPreview.duration)) {
        vplayerPreview.currentTime = newpos;
    } else {
        alert("The value is out of the range: " + newpos.toString());
    }
}

/**
* Execute everytime when the audio player change/play,
* and define what to check here (any image defined)
*/
function updateTrackTime(vplayer) {
    if (vdebug) {
        console.log(arguments.callee.name + " " + vplayerPreview.currentTime);
    }
    vaudiotime = vplayer.currentTime;
    if (imagesSelected.length > 1) {
        if (lastImagesSelectedShowed < (imagesSelected.length - 1)) {
            if ((vaudiotime < imagesSelected[lastImagesSelectedShowed].time) ||
                (vaudiotime > imagesSelected[lastImagesSelectedShowed + 1].time)) {
                searchAndUpdateImgAtNewTime(vplayer);
            }
        } else { //The last image inserted is showed now!
            if (vaudiotime < imagesSelected[lastImagesSelectedShowed].time) {
                searchAndUpdateImgAtNewTime(vplayer);
            }
        }
    }
}

//==================================================
// Main code to be executed after functions declarations
if (data.length > 0) {
    setDataInHtml(0);
    let vexampleHtml = '<i class="fa-solid fa-database"></i> Datasets: <select onchange="setDataInHtml(this.value)">';
    for (let a = 0; a < data.length; a++) {
        vexampleHtml += (a === 0) ? '<option selected value="' + (a) + '">' + (data[a].path) + '</option>' :
            '<option value="' + (a) + '">' + (data[a].path) + '</option>';
    }
    vexampleHtml += "</select>";
    document.getElementById("examples-panel").innerHTML = vexampleHtml;
}