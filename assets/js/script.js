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

function getDataInHtml(datapos) {
    let vdata = data[datapos];
    let vpath = vdata.path;  //Path to the images/audios

    //Show images in the page
    let vimghtml = "";
    for (let i=0; i<vdata.images.length; i++) {
        vimghtml += `
        <img src="${vpath}/${vdata.images[i]}">
        <hr>
        `;
        console.log(vimghtml);
    }

    //Show audios in the page
    let vaudhtml = '<select name="audiolist" id="audiolist">';
    for (let i=0; i<vdata.audios.length; i++) {
        vaudhtml += `
            <option value="${vpath}/${vdata.images[i]}">${vdata.audios[i]}</option>
        `;
        console.log(vaudhtml);
    }
    vaudhtml += "</select>";

    //Select div with images/audios to insert content
    let vimgnode = document.getElementById("images");
    let vaudnode = document.getElementById("audios");
    vimgnode.innerHTML = vimghtml;
    vaudnode.innerHTML = vaudhtml;
}


getDataInHtml(0);

for (let a=0; a<data.length; a++) {
    let vdata = data[a];
    //getDataInHtml(a);
    }