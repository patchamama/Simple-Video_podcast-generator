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
alert(data[0].path+"/"+data[0].images[0]);

//Select div with images/audios to insert content
let vimgnode = document.getElementById("images");
let vaudnode = document.getElementById("audios");

//Init images/audios html vars...
let vimghtml = "";
let vaudhtml = "";
for (let a=0; a<data.length; a++) {
    let vdata = data[a];
    let vpath = vdata.path;  //Path to the images/audios
    
    //Show images in the page
    for (let i=0; i<vdata.images.length; i++) {
        vimghtml += `
        <img src="${vpath/vdata.images[i]}">
        `;
        console.log(vimghtml);
        if (i>0) { vimghtml += "<hr>"; }
    }

    //Show audios in the page
    vaudhtml += '<select name="audiolist" id="audiolist">';
    for (let i=0; i<vdata.audios.length; i++) {
        vaudhtml += `
            <option value="${vpath/vdata.audios[i]}">${vdata.audios[i]}</option>
        `;
        console.log(vaudhtml);
    }
    vaudhtml += "</select>";
}

vimgnode.innerHTML = vimghtml;
vaudnode.innerHTML = vaudhtml;

