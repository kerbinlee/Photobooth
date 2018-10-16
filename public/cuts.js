function show_upload(){
    var selector = document.getElementById('fileSelector');
    selector.style.display = 'flex';
    document.getElementById('uploadButton').style.display = 'flex';
}


function readFile() {
    var selectedFile = document.getElementById('fileSelector').files[0];
    var image = document.getElementById('theImage');

    var fr = new FileReader();
    // anonymous callback uses file as image source
    fr.onload = function () {
    	image.src = fr.result;  
    };

    fr.readAsDataURL(selectedFile);    // begin reading
}


function fadeImage(fadeChoice) {
    var image = document.getElementById('theImage');
    if (fadeChoice == 'Fade') {
		image.style.opacity = 0.3;
    } else {
		image.style.opacity = 1.0;
    }
}


function hide_fade_image(){
    var image = document.getElementById('theImage');
    image.src = "";
}


//this is from the orignal testing
function getLabels(imgName) {
    // becomes method of request object oReq
	function reqListener () {
  	    var pgh = document.getElementById("labels");
	    pgh.textContent = this.responseText;
	}

	var oReq = new XMLHttpRequest();
	oReq.addEventListener("load", reqListener);
	oReq.open("GET", url+"/query?get_labels_example?img="+imgName);
	oReq.send();
}