// set port number of server
var portNumber = 8080;
var url = "."; //"https://maythird.ddns.net:"+portNumber;

// display all photos
load_Photos();

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

function appendImage(imageURL_input, favorite) {
    var imageURL = imageURL_input;
    // create container for image and its properties
    var flexBox = document.createElement("div");
    flexBox.className = "flexy";

    // creat container for image itself
    var imageDiv = document.createElement("div");
    imageDiv.className = "imageContainer";;
    imageDiv.id = imageURL;
    flexBox.appendChild(imageDiv);

    // create image element
    var image = document.createElement("img");
    image.src = imageURL;
    image.id = "image:"+imageURL;
    image.className = "imageDiv";

    // append image to its container
    imageDiv.appendChild(image);

    // create container for hamburger menu and options for image
    var imgOptionsDiv = document.createElement("div")
    imgOptionsDiv.className = "imgOptionsDiv";

    // create container for change tags and favorite button
    var menu = document.createElement("div");
    menu.className = "imgMenu";
    menu.id = "imgMenu:"+imageURL;

    // create change tags button
    var changeTagsButton = document.createElement("button");
    changeTagsButton.className = "imgOptionsButton";
    changeTagsButton.textContent = "change tags";
    changeTagsButton.setAttribute("onClick", "change_tags('"+imageURL+"')");
    menu.appendChild(changeTagsButton);

    // create favorite button
    var favButton = document.createElement("button");
    favButton.className = "imgOptionsButton";
    favButton.id = "favorite:"+imageURL;
    if (favorite) {
        favButton.textContent = "unfavorite";
        favButton.setAttribute("onClick", "mark_favorite('"+imageURL+"',"+favorite+")");
    } else {
        favButton.textContent = "add to favorites";
        favButton.setAttribute("onClick", "mark_favorite('"+imageURL+"',"+favorite+")");
    }
    menu.appendChild(favButton);

    // create container for hamburger image
    var burgerImageDiv = document.createElement("button");
    burgerImageDiv.className = "burgerImageDiv";
    burgerImageDiv.id = "burgerButton:"+imageURL;
    burgerImageDiv.setAttribute("onClick", "open_menu('"+imageURL+"')");

    // create hamburger image
    var burgerMenu = document.createElement("img");
    burgerMenu.className = "burgerMenu";
    burgerMenu.backgroundImage = imageURL;
    burgerMenu.src = "photobooth/optionsTriangle.svg";

    // append burger menu to image
    imgOptionsDiv.appendChild(menu);
    burgerImageDiv.appendChild(burgerMenu);
    imgOptionsDiv.appendChild(burgerImageDiv);
    imageDiv.appendChild(imgOptionsDiv);

    // create container for image labels and load any existing labels from database
    var labelBox = document.createElement("div");
    labelBox.className = "labelBox";
    labelBox.id = "labelBox:"+imageURL;
    photo_label_load(imageURL, labelBox);
    flexBox.appendChild(labelBox);

    // append labels input text box
    append_labelInput(flexBox, imageURL);

    // append entire container to the DOM
    var photosContainer = document.getElementById("threePhotosContainer");

    // if no photos currently displayed, just append image
    if (photosContainer.children.length == 0) {
        photosContainer.append(flexBox);
    } else { // append image in front of other images
        photosContainer.insertBefore(flexBox, photosContainer.children[0]);
    }
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

function photo_label_load(image_url, label_Box) {
    var imageURL = image_url;

    // get data from database
    var oReq = new XMLHttpRequest();
    oReq.open("GET", url+"/query?load_images", true);

    // when data from database is loaded
    oReq.onload = function() {
        var obj = JSON.parse(oReq.responseText);
        // find image data
        var saveI = 0;
        for(var i = 0; i < obj.length; i++) {
            if(obj[i].fileName == imageURL) {
                saveI = i;
                console.log("print labels for:"+obj[i].fileName);
                break;
            }
        }

        var labelsArray = obj[saveI].labels.split(",");
        console.log("test print labels:"+ labelsArray.length);
        // append labels to DOM
        for(var i = 0; i < labelsArray.length; i++) {
            console.log("test print labels:"+ labelsArray[i]);
            if(labelsArray[i]!="") {
                tag_append( obj[saveI].fileName,label_Box, decodeURI(labelsArray[i]) ); //decoded here to remove spaces in label when displayed
            }
        }
    }
    oReq.send("emptytest"); //this is where it post the data in. the send is important.
}

function tag_append(originalFileName,label_Box, labels_Array_i) {
    var tag = document.createElement("div");
    var crossContainer = document.createElement("div");
    var tag_name = document.createElement("div");
    tag_name.className ="tag_name";
    tag.className = "tag";
    tag.id = "tag:"+originalFileName+':'+labels_Array_i;

    var crossImg = document.createElement("img");
    crossImg.className = "cross_Image";
    crossContainer.setAttribute( "onClick", "delete_tag('"+originalFileName+"','"+labels_Array_i+"')" );
    crossImg.src = "photobooth/removeTagButton.png";
    tag_name.textContent = labels_Array_i;
    crossContainer.appendChild(crossImg);

    tag.appendChild(crossContainer);
    tag.appendChild(tag_name);

    //Add_label stuff
    var labelAdderDiv = document.createElement("div");
    var labelAdder = document.createElement("label_adder");

    // the tag appends the Image
    label_Box.appendChild(tag);
}

function append_labelInput(container, originalFileName) {
    var labelInput = document.createElement("input");
    labelInput.type = "text";
    labelInput.className ="labelInput";
    labelInput.placeholder = "type new label";
    console.log("added input text?");

    var labelInputContain = document.createElement("div");
    labelInputContain.className = "labelInputDiv";
    labelInputContain.id = "labelInputDiv:"+originalFileName;

    var labelAddDiv = document.createElement("div");
    var labelAddButton = document.createElement("button");
    labelAddButton.className = "label_add_button";
    labelAddButton.setAttribute("onClick", "add_label('"+originalFileName+"')");
    labelAddButton.textContent = "Add";
    labelAddDiv.appendChild(labelAddButton);

    labelInputContain.appendChild(labelInput);
    labelInputContain.appendChild(labelAddDiv);
    container.appendChild(labelInputContain);
}

function add_label(imageName) {
    /// ADD DOESN"T WORK BECAUSE you need to box images DIV together
    var new_label = document.getElementById(imageName).parentElement.childNodes[2].childNodes[0].value;

    console.log("adding tag, beggining:  " + new_label);
    var imageURL = imageName;
    //var tag_name
    var oReq = new XMLHttpRequest();
    oReq.open("GET", url+"/query?load_images", true);

    var newArray ="";
    oReq.onload = function() {
        var obj = JSON.parse(oReq.responseText);
        var saveI = 0;
        for( var i = 0; i < obj.length; i++) {
            if (obj[i].fileName == imageURL) {
                saveI = i;
                console.log("print labels for:"+obj[i].fileName);
                break;
            }
        }

        if (obj[saveI].labels != "") {
            newArray = obj[saveI].labels +","+new_label;
            console.log("newARRAY: additional label is:"+ url+"/query?"+"add_label?"+imageName+"?"+newArray);
            var oReqTwo = new XMLHttpRequest();
            oReqTwo.open("POST", url+"/query?"+"add_label?"+imageName+"?"+newArray, true);
            oReqTwo.onload = function() {
                var label_Box = document.getElementById("labelBox:"+imageName);
                tag_append(imageName,label_Box, new_label);
            }
            oReqTwo.send();
        } else {
            newArray = new_label;
            console.log("single added label,  is:"+ url+"/query?"+"add_label?"+imageName+"?"+newArray);
            var oReqThree= new XMLHttpRequest();
            oReqThree.open("POST", url+"/query?"+"add_label?"+imageName+"?"+newArray, true);
            oReqThree.send();
        }
    }

    oReq.send("emptytest"); //this is where it post the data in. the send is important.

    change_tags_close(imageName);
}

function delete_tag(image_url, tag_name) {
    console.log("delete_tag_start DB request:" + tag_name);
    var imageURL = image_url;
    var oReq = new XMLHttpRequest();
    oReq.open("GET", url+"/query?load_images", true);
    var newArray = "";
    oReq.onload = function() {
        var obj = JSON.parse(oReq.responseText);
        var saveI = 0;
        for (var i = 0; i < obj.length; i++) {
            if (obj[i].fileName == imageURL) {
                saveI = i;
                console.log("print labels for:"+obj[i].fileName);
                break;
            }
        }

        console.log("current labels list: "+ obj[saveI].labels);
        var labelsArray = obj[saveI].labels.split(",");
        console.log("test print labels length:"+ labelsArray.length);
        var countLabels = 0;
        for (var i = 0; i < labelsArray.length; i++) {
            console.log("test print labels:"+ labelsArray[i]);
            if (labelsArray[i] != tag_name) {
                if (countLabels == 0) {
                    newArray = newArray + labelsArray[i];
                    countLabels++;
                } else {
                    newArray = newArray + ",";
                    newArray = newArray + labelsArray[i];
                }
            }
        }
        console.log("new array with removed label is:"+ newArray);

        var oReqTwo = new XMLHttpRequest();
        oReqTwo.open("POST", url+"/query?delete_tag?"+imageURL+"?"+newArray, true);
        oReqTwo.onload = function() {
            console.log("updating deleted array with new array:" + oReq.responseText);
            var tagDiv = document.getElementById("tag:"+imageURL+':'+tag_name);
            var tagDivParent = tagDiv.parentElement;
            tagDivParent.removeChild(tagDiv);
        }
        oReqTwo.send("deleted tag"); //this is where it post the data in. the send is important.
    }

    oReq.send("emptytest"); //this is where it post the data in. the send is important.
    change_tags_close(imageURL);
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
