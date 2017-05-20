// uploads an image within a form object.  This currently seems
// to be the easiest way to send a big binary file. 
function uploadFile() {
    var url = "http://138.68.25.50:7829";

    // where we find the file handle
    var selectedFile = document.getElementById('fileSelector').files[0];

    // display uploading image
    var image = document.getElementById('uploadingImage'); 
    var fr = new FileReader();
    // anonymous callback uses file as image source
    fr.onload = function () {
	image.src = fr.result;
    };
    fr.readAsDataURL(selectedFile); // begin reading
    fadeImage(); //fade image while uploading

    var formData = new FormData(); 
    // stick the file into the form
    formData.append("userfile", selectedFile);

    // more or less a standard http request
    var oReq = new XMLHttpRequest();
    // POST requests contain data in the body
    // the "true" is the default for the third param, so 
    // it is often omitted; it means do the upload 
    // asynchornously, that is, using a callback instead
    // of blocking until the operation is completed. 
    oReq.open("POST", url, true);  
    oReq.onload = function() {
	// the response, in case we want to look at it
	console.log(oReq.responseText);
	/*var image = document.createElement('img');
	image.src = "sample.png";
	document.body.appendChild(image);*/
        unfadeImage();
    }
    oReq.send(formData);
}

function fadeImage() {
    var image = document.getElementById('uploadingImage');
    image.style.opacity = 0.5;
}

function unfadeImage() {
    var image = document.getElementById('uploadingImage');
    image.style.opacity = 1;
    
    // set source of uploaded image to server file
    var selectedFile = document.getElementById('fileSelector').files[0];
    image.src = selectedFile.name;
}

