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
	
	// add labels paragraph
	var p = document.createElement('p');
	p.id = "labels";
	document.body.appendChild(p);
	// add labels input box
	var input = document.createElement('input');
	input.className = "labelInput";
	input.id = selectedFile.name + "LabelInput";
	input.type = "text";
	console.log(input);document.body.appendChild(input);
	// add labels input add/submit button
	var button = document.createElement('button');
	button.className = "labelButton";
	button.id = selectedFile.name + "LabelAdd";
	button.setAttribute('onclick','labelAdd('+selectedFile.name+');');
	button.onclick = function() { labelAdd(selectedFile.name); }; // for IE
	button.innerHTML = "Add";
console.log(button);	document.body.appendChild(button);
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
    return;
}

function labelAdd(filename) {
	// create new AJAX request
	var oReq = new XMLHttpRequest();

	var newLabel = document.getElementById(filename + "LabelInput").value;
	var url = "http://138.68.25.50:7829/change?img=" + filename + "&label=" + newLabel + "&op=add";
	// setup callback
	oReq.addEventListener("load", reqListener);
	// load occurs when operation is completed, response is back
	// create AJAX GET HTTP request
	oReq.open("GET", url); // writes HTTP req head
	oReq.send(); // initiates transfer
}

// label callback function
function reqListener () {
	var pgh = document.getElementById('labels');
	pgh.textContent = this.responseText;
}
