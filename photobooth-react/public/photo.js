var url = ".";

function uploadFile() {
    show_turn_live();
}

function show_turn_live() {
    console.log("attempt to show turn live");
    var stl = document.getElementById("show_turn_live");
    stl.style.display = "block";
    var yes = document.getElementById("show_turn_live_yes");
    var no = document.getElementById("show_turn_live_no");
    yes.setAttribute("onClick", "show_turn_live_yes_no('blank',1)");
    no.setAttribute("onClick", "show_turn_live_yes_no('blank',0)");
}

function  show_turn_live_yes_no(filename,answer) {
    var selectedFile = document.getElementById('fileSelector').files[0];

    // load image file
    var fr = new FileReader();

    var photosContainer = document.getElementById('threePhotosContainer');

    // anonymous callback when image loaded into browser
    fr.onload = function () {
        var uploadingImageContainer = document.createElement('div');
        uploadingImageContainer.id = "flexyTheImage";

        var uploadingImage = document.createElement('img');
        uploadingImage.id = "theImage";
        uploadingImage.src = fr.result;
        uploadingImageContainer.appendChild(uploadingImage);

        var progress_bar = document.createElement('progress');
        progress_bar.id = "progress_bar";
        progress_bar.style.background = "#885544";
        progress_bar.style.background.color = "#885544";
        progress_bar.style.color = "#885544";

        uploadingImageContainer.appendChild(progress_bar);

        // if no images being displayed, append uploading image
        if (photosContainer.children.length == 0) {
            photosContainer.append(uploadingImageContainer);
        } else { // append uploading image in front of other images
            photosContainer.insertBefore(uploadingImageContainer, photosContainer.children[0]);
        }

        // create form to put image into in order to upload to server
        var formData = new FormData();
        // stick the file into the form
        formData.append("userfile", selectedFile);

        // HTTP request to send image in
        var oReq = new XMLHttpRequest();
        oReq.open("POST", url+"/query?"+"load_image"+"?"+answer, true);
        // when the image has been uploaded
        oReq.onload = function() {
            // remove faded uploading image and progress bar
            uploadingImageContainer = document.getElementById("flexyTheImage");
            photosContainer.removeChild(uploadingImageContainer);

            // reset file input selector
            console.log("selectedFile.name: "+selectedFile.name );
            appendImage(encodeURI(selectedFile.name), 0);
            // display image on web page
            selectedFile = document.getElementById('fileSelector').value = null;
        };

        // Progress bar
        oReq.upload.onprogress = function(progress_event) {
            console.log("xmlhttprequest in progress");
            if (progress_event.lengthComputable) {
                progress_bar.max = progress_event.total;
                console.log("this is progress event total: " + progress_event.total);
                progress_bar.value = progress_event.loaded;
            }
        };

        // upload image to server
        oReq.send(formData);

        var stl = document.getElementById("show_turn_live");
        stl.style.display = "none";
    };

    fr.readAsDataURL(selectedFile); // begin reading file
}

function refresh_Photos() {
    var Container = document.getElementById("threePhotosContainer");
    while (Container.firstChild) {
        console.log("removing child");
        Container.removeChild(Container.firstChild);
    }
    load_Photos();
}

function remove_All_Photos() {
    var Container = document.getElementById("threePhotosContainer");
    while (Container.firstChild) {
        console.log("removing child");
        Container.removeChild(Container.firstChild);
    }
}

function load_Photos() {
    var oReq = new XMLHttpRequest();
    oReq.open("GET", url+"/query?load_images", true);
    oReq.onload = function() {
        var obj = JSON.parse(oReq.responseText);
        for(var i = obj.length - 1; i >= 0; i--) { // iterate backwards to show most recent first, since appending to front
            appendImage(obj[obj.length-i-1].fileName, obj[obj.length-i-1].favorite);
        }
    }
    oReq.send("photos_loaded"); // send GET request to server
}

function change_tags(imageName) {
    close_menu(imageName);
    var labelBox = document.getElementById("labelBox:"+imageName);
    // display the cross button for each label for image
    for (var i = 0; i < labelBox.children.length; i++) {
        labelBox.children[i].children[0].children[0].style.display = "block";
    }
    // change background color of label box
    labelBox.style.background = "rgb(186,154,138)";
    if (labelBox.children.length < 10) {
        var labelInputDiv = document.getElementById("labelInputDiv:"+imageName);
        labelInputDiv.style.display = "block";
    }
}

function change_tags_close(imageName) {
    close_menu(imageName);
    var labelBox = document.getElementById("labelBox:"+imageName);
    // display the cross button for each label for image
    for (var i = 0; i < labelBox.children.length; i++) {
        labelBox.children[i].children[0].children[0].style.display = "none";
    }
    // change background color of label box
    labelBox.style.background = "white";
    var labelInputDiv = document.getElementById("labelInputDiv:"+imageName);
    labelInputDiv.style.display = "none";
}

function open_menu(imageName) {
    var imgMenu = document.getElementById("imgMenu:"+imageName);
    imgMenu.style.display = "flex";

    var burgerMenu = document.getElementById("burgerButton:"+imageName);
    burgerMenu.setAttribute("onClick", "close_menu('"+imageName+"')");
    burgerMenu.style.backgroundColor = "#885544";
}

function close_menu(imageName) {
    var imgMenu = document.getElementById("imgMenu:"+imageName);
    imgMenu.style.display = "none";

    var burgerMenu = document.getElementById("burgerButton:"+imageName);
    burgerMenu.setAttribute("onClick", "open_menu('"+imageName+"')");
    burgerMenu.style.backgroundColor = "rgba(0,0,0,0)";
}

function mark_favorite(imageName, yesOrNo) {
    close_menu(imageName);
    var newYesOrNo = 0;
    if (yesOrNo == 0) {
        newYesOrNo = 1;
    }

    var oReqTwo = new XMLHttpRequest();
    oReqTwo.open("POST", url+"/query?mark_favorite?"+imageName+"?"+newYesOrNo, true);
    oReqTwo.onload = function() {
        var favButton = document.getElementById("favorite:"+imageName);
        var favButtonParent = favButton.parentElement;
        favButtonParent.removeChild(favButton);
        favButton = document.createElement("button");
        favButton.className = "imgOptionsButton";
        favButton.id = "favorite:"+imageName;
        if (yesOrNo) {
            favButton.textContent = "add to favorites";
            favButton.setAttribute("onClick", "mark_favorite('"+imageName+"',0)");
            favButtonParent.appendChild(favButton);
        } else {
            favButton.textContent = "unfavorite";
            favButton.setAttribute("onClick", "mark_favorite('"+imageName+"',1)");
            favButtonParent.appendChild(favButton);
        }
    }
    oReqTwo.send();
}

function enterInputTagSearch(event) {
    if (event.keyCode == 13) {
        var answer = document.getElementById("search_tag_input").value;
        tag_search_function(answer);
    }
}

function InputTagSearch() {
    var answer = document.getElementById("search_tag_input").value;
    tag_search_function(answer);
}

function clearFilter() {
    // clear input box
    document.getElementById("search_tag_input").value = "";

    // clear results tag
    var results_tag = document.getElementById("results_tag");
    results_tag.innerHTML = "";

    // reset pictures
    refresh_Photos();
}

function tag_search_function(target_tag ){
    console.log("did it work, tag search?"+target_tag);
    var oReq = new XMLHttpRequest();
    oReq.open("GET", url+"/query?tag_search?"+target_tag, true);
    oReq.onload = function() {
        var obj = JSON.parse(oReq.responseText);
        var searchedTag = document.getElementById("results_tag");
        searchedTag.innerHTML = "results for: '" + target_tag +"'";

        remove_All_Photos();
        for (var i = obj.length - 1; i >= 0; i--) { // iterate backwards to show most recent first, since appending to front
            appendImage(obj[obj.length-i-1].fileName, obj[obj.length-i-1].favorite);
        }
    }
    oReq.send("photos_loaded"); // send GET request to server

}

function show_upload(number) {
    console.log("shown_upload() pressed" + number);
    var shown_upload = document.getElementById("shown_upload");
    var upload = document.getElementById("upload");
    var upload_m = document.getElementById("upload_m");
    if (number == 1) {
        shown_upload.style.display = "flex";
        upload.setAttribute("onClick", "show_upload(0)");
        upload_m.setAttribute("onClick", "show_upload(0)");
    } else {
        shown_upload.style.display = "none";
        upload.setAttribute("onClick", "show_upload(1)");
        upload_m.setAttribute("onClick", "show_upload(1)");
    }
}

function show_filter(number) {
    var shown_filter = document.getElementById("shown_filter");
    var filter = document.getElementById("search_tag");
    var filter_m = document.getElementById("search_tag_m");
    if (number == 1) {
        shown_filter.style.display = "flex";
        filter.setAttribute("onClick", "show_filter(0)");
        filter_m.setAttribute("onClick", "show_filter(0)");
    } else {
        shown_filter.style.display = "none";
        filter.setAttribute("onClick", "show_filter(1)");
        filter_m.setAttribute("onClick", "show_filter(1)");
    }
}

function load_fav() {
    var fav_menu = document.getElementById("fav_menu");
    fav_menu.style.display = "flex";

    var results_tag = document.getElementById("results_tag");
    results_tag.innerHTML = "Favorites";

    var oReq = new XMLHttpRequest();
    oReq.open("GET", url+"/query?load_fav", true);
    oReq.onload = function() {
        remove_All_Photos();

        var obj = JSON.parse(oReq.responseText);
        for (var i = obj.length - 1; i >= 0; i--) {
            appendImage(obj[obj.length-i-1].fileName, obj[obj.length-i-1].favorite);
        }
    };
    oReq.send();
}

function fav_to_home() {
    var fav_menu = document.getElementById("fav_menu");
    fav_menu.style.display = "none";

    var results_tag = document.getElementById("results_tag");
    results_tag.innerHTML = "";

    refresh_Photos();
}
