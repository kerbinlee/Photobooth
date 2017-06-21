// uploads an image within a form object.  This currently seems
// to be the easiest way to send a big binary file. 

//Note : find the 8 "urls" and change port numbers
var portNumber = 7829;

refresh_Photos();

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


function uploadFile() {

    var selectedFile = document.getElementById('fileSelector').files[0];
    var image = document.getElementById('theImage');
    
    //document.getElementById("flexyTheImage").style.display ="none";
    var fr = new FileReader();
    // anonymous callback uses file as image source
    fr.onload = function () {   
        
    console.log("attempt to append image");
    image.src = fr.result;
    image.style.opacity = 0.3;
    };
    fr.readAsDataURL(selectedFile); 
    
    fadeImage('unfade');
    var url = "http://138.68.25.50:"+portNumber;

    // where we find the file handle
    
    var formData = new FormData(); 
   // load_Photos();
    // stick the file into the form
    formData.append("userfile", selectedFile);

    // more or less a standard http request
    var oReq = new XMLHttpRequest();

    oReq.open("POST", url+"/query?"+"load_image", true);  
    oReq.onload = function() {
	// the response, in case we want to look at it
	console.log(oReq.responseText);
    image.src = "";
    refresh_Photos();
    }
    oReq.send(formData); 

    
    
    /////////////////////////////
    
    //// ADD FADE FUNCTIONS HERE?
    
    //////////////////////////
    
    
   

}


function hide_fade_image(){
    var image = document.getElementById('theImage');
    image.src = "";
}


//this is self, function to post into DATABASE


function refresh_Photos()
{    
    var Container = document.getElementById("threePhotosContainer");
    while(Container.firstChild)
    {   
        console.log("removing child");
        Container.removeChild(Container.firstChild);   
    }    
    load_Photos(); 
    
}//end refresh photos()


function load_Photos(){
    
    var url = "http://138.68.25.50:"+portNumber;
    var oReq = new XMLHttpRequest();
    oReq.open("GET", url+"/query?load_images", true);  
    oReq.onload = function() {
        console.log("did it work?:" + oReq.responseText);
        var obj = JSON.parse(oReq.responseText);
        for( var i = 0; i < obj.length; i++) { 
            console.log("printing Names: "+ obj[i].fileName);
            appendImage(obj[obj.length-i-1].fileName);
        }//end for loop      
        
    }//end onload
    oReq.send("photos_loaded"); //this is where it post the data in. the send is important. 
}


function appendImage(image_url) {
    
    
    
    var imageURL = image_url; 
    var flexBox = document.createElement("div");
    flexBox.className = "flexy";
    //flexBox.id = imageURL;
    var image = document.createElement("img");
    var labelBox = document.createElement("div");
    labelBox.className = "labelBox";
    photo_label_load(imageURL, labelBox);
    
    image.src = image_url; 
    image.id = "image:"+image_url; 
    //image.class = "imageDiv";    
    image.className = "imageDiv";    
    
    
    var burgerMenu = document.createElement("img");
    
    burgerMenu.id = "burgerMenu";
    burgerMenu.backgroundImage = image_url;
    burgerMenu.setAttribute( "onClick", "open_menu('"+imageURL+"')");
    burgerMenu.src = "photobooth/optionsTriangle.png";
    
    var imageDiv = document.createElement("div");
    imageDiv.className = "imageContainer";;
    imageDiv.id = image_url;
    
    imageDiv.appendChild(image);
    imageDiv.appendChild(burgerMenu);
    
    //child[0]
    flexBox.appendChild(imageDiv);
   //flexBox.appendChild(burgerMenu);

    flexBox.appendChild(labelBox);
    
    //adding labels inputText
    append_labelInput(flexBox, imageURL);
    
    append_favorite(flexBox, imageURL, 1);
    var Container = document.getElementById("threePhotosContainer");
    Container.appendChild(flexBox);
    
}

function open_menu(imageName){
    
    
    
    
}




function photo_label_load(image_url, label_Box) {
    
    var imageURL = image_url;
    var url = "http://138.68.25.50:"+portNumber;
    var oReq = new XMLHttpRequest();
    oReq.open("GET", url+"/query?load_images", true);  
    
    oReq.onload = function() {
       // console.log("photo_label_load :" + oReq.responseText);
        var obj = JSON.parse(oReq.responseText);
        var saveI = 0;
        for( var i = 0; i < obj.length; i++) {
    
            
            if(obj[i].fileName == imageURL) {
                    saveI = i; 
                    console.log("print labels for:"+obj[i].fileName);
                    break;
                }
            
        }//end for loop       
        var labelsArray = obj[saveI].labels.split(",");
        console.log("test print labels:"+ labelsArray.length);
        for( var i = 0; i < labelsArray.length; i++){    
            
            console.log("test print labels:"+ labelsArray[i]);
            if(labelsArray[i]!=""){

                tag_append( obj[saveI].fileName,label_Box, labelsArray[i]);
            }
            
        }//end for loop       
        
        
    }//end onload
    oReq.send("emptytest"); //this is where it post the data in. the send is important. 
        
}//end function photo_label_load





function tag_append(originalFileName,label_Box, labels_Array_i) {
    
            
    
    var tag = document.createElement("div");
    var crossContainer = document.createElement("div");
    var tag_name = document.createElement("div");
    tag_name.id ="tag_name";
    tag.id = "tag";
    
    //tag.textContent = labels
    var crossImg = document.createElement("img");
    crossImg.id = "cross_Image";
    crossContainer.setAttribute( "onClick", "delete_tag('"+originalFileName    +"','"+labels_Array_i+"')" );
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

function append_labelInput(container, originalFileName){
   
  var labelInput = document.createElement("input");
    
    labelInput.type = "text";
    labelInput.id ="labelInput";
    labelInput.placeholder = "type new label";
    console.log("added input text?");
   
    
    var labelInputContain = document.createElement("div");
    
    var crossImgDiv = document.createElement("div");
     var crossImg = document.createElement("img");
    crossImg.id = "label_add_image";
    console.log("label input:" + labelInput.value);
    crossImgDiv.setAttribute( "onClick", "add_label('"+originalFileName+"')");
    
    crossImgDiv.appendChild(crossImg);
    //FIX THIS: 
    crossImg.src = "/addTemp.png";  
  
    labelInputContain.appendChild(labelInput);
    labelInputContain.appendChild(crossImgDiv);
    container.appendChild(labelInputContain);
}


function add_label(imageName) {

    /// ADD DOESN"T WORK BECAUSE you need to box images DIV together
    var new_label = document.getElementById(imageName).parentElement.childNodes[2].childNodes[0].value;
    
    console.log("adding tag, beggining:  " + new_label);
    var imageURL = imageName;
    //var tag_name
    var url = "http://138.68.25.50:"+portNumber;
    var oReq = new XMLHttpRequest();
    oReq.open("GET", url+"/query?load_images", true);  
            
       var newArray ="";
    oReq.onload = function() 
    {
            var obj = JSON.parse(oReq.responseText);
            var saveI = 0;
            for( var i = 0; i < obj.length; i++) 
                {
                    if(obj[i].fileName == imageURL) 
                    {
                        saveI = i; 
                        console.log("print labels for:"+obj[i].fileName);
                        break;
                    } 
                }//end for loop  
            //var labelsArray = obj[saveI].labels.split(",");
            //console.log("test print labels:"+ labelsArray.length);
            
        
   
     
    if(obj[saveI].labels != "") 
    {  
    newArray = obj[saveI].labels +","+new_label;                
    console.log("newARRAY: additional label is:"+ url+"/query?"+"add_label?"+imageName+"?"+newArray);
    var oReqTwo = new XMLHttpRequest();
    oReqTwo.open("POST", url+"/query?"+"add_label?"+imageName+"?"+newArray, true);  
    oReqTwo.onload = function() {   
	//console.log(oReqTwo.responseText);
    }
    oReqTwo.send(); 
    
        }
        else{  
            
            newArray = new_label;
            console.log("single added label,  is:"+ url+"/query?"+"add_label?"+imageName+"?"+newArray);
            var oReqThree= new XMLHttpRequest();
            oReqThree.open("POST", url+"/query?"+"add_label?"+imageName+"?"+newArray, true);  
            oReqThree.onload = function() {   
           //console.log(oReqTwo.responseText);
            }
            oReqThree.send(); 
           
       }

        
    }//end onload


        oReq.send("emptytest"); //this is where it post the data in. the send is important. 
        refresh_Photos();
  
}




function delete_tag(image_url, tag_name)
{
            
    console.log(".....");
    console.log("delete_tag_start DB request:" + tag_name);
                
    var imageURL = image_url;
    var url = "http://138.68.25.50:"+portNumber;
    var oReq = new XMLHttpRequest();
    oReq.open("GET", url+"/query?load_images", true);  
     var newArray ="";
    oReq.onload = function() 
    {
        
        var obj = JSON.parse(oReq.responseText);
        var saveI = 0;
        for( var i = 0; i < obj.length; i++) 
        {
            if(obj[i].fileName == imageURL) 
                {
                    saveI = i; 
                    console.log("print labels for:"+obj[i].fileName);
                    break;
                }
            
        }//end for loop       

        console.log("current labels list: "+ obj[saveI].labels);
        var labelsArray = obj[saveI].labels.split(",");
        console.log("test print labels length:"+ labelsArray.length);
        var countLabels = 0;
        for( var i = 0; i < labelsArray.length; i++)
        {    
            
            console.log("test print labels:"+ labelsArray[i]);
            
            if(labelsArray[i] != tag_name )
                 {  
                      if( countLabels ==0 )
                            {
                              newArray = newArray + labelsArray[i];
                              countLabels++;
                            }
                     else {
                          newArray = newArray + ",";
                          newArray = newArray + labelsArray[i];
                         
                     }
                        
                       
                 }         
        }//end for loop       
        console.log("new array with removed label is:"+ newArray);
        
        
        
        ///////////////////////////////////////////////////////
    var oReqTwo = new XMLHttpRequest();
            
    oReqTwo.open("POST", url+"/query?delete_tag?"+imageURL+"?"+newArray, true);  
    oReqTwo.onload = function() {
        
    console.log("updating deleted array with new array:" + oReq.responseText);
     
    }//end onload
    oReqTwo.send("deleted tag"); //this is where it post the data in. the send is important. 

        
        
        
        
    }//end onload
    
    oReq.send("emptytest"); //this is where it post the data in. the send is important. 
refresh_Photos();
}

function append_favorite(container, originalFileName, yesOrNo){
    
    var favImgDiv = document.createElement("div");
    favImgDiv.id = "favorite:"+originalFileName;
    var favImg = document.createElement("img");
    
    console.log("appending favorite function");

    var url = "http://138.68.25.50:"+portNumber;
    var oReq = new XMLHttpRequest();
    oReq.open("GET", url+"/query?load_images", true);  
    
    oReq.onload = function() {
        
        console.log("did it work?:" + oReq.responseText);
        var obj = JSON.parse(oReq.responseText);
        var saveI = 0;
        
        for( var i = 0; i < obj.length; i++) {
            if(obj[i].fileName == originalFileName) {
                    saveI = i; 
                    console.log("check fav's for: "+obj[i].fileName);
                    break;
                }
         }//end for loop  
        
    favImgDiv.setAttribute( "onClick", "mark_favorite('"+originalFileName+"','"+obj[saveI].favorite+"')"); 
    favImgDiv.appendChild(favImg);
    favImg.src = "addFav.png";  
    container.appendChild(favImgDiv);
             
    }//end onload
    oReq.send("emptytest");

}

function mark_favorite(originalFileName, yesOrNo){
    
    var imageName = originalFileName;
    var newYesOrNo = 0;
    if(yesOrNo == 0){
    newYesOrNo = 1;
        
    }
   
    var url = "http://138.68.25.50:"+portNumber;               
    console.log("newARRAY: additional label is:"+ url+"/query?"+"mark_favorite?"+imageName+"?"+newYesOrNo);
    
    var oReqTwo = new XMLHttpRequest();
    oReqTwo.open("POST", url+"/query?"+"mark_favorite?"+imageName+"?"+newYesOrNo, true);  
    oReqTwo.onload = function() {   
	//console.log(oReqTwo.responseText);
}
oReqTwo.send(); 

refresh_Photos();
}//end mark_favorite()




//this is from the orignal testing
function getLabels(imgName) {
        // construct url for query
	var url = "http://138.68.25.50:"+portNumber+"/query?get_labels_example?img="+imgName;

        // becomes method of request object oReq
	function reqListener () {
  	    var pgh = document.getElementById("labels");
	    pgh.textContent = this.responseText;
	}

	var oReq = new XMLHttpRequest();
	oReq.addEventListener("load", reqListener);
	oReq.open("GET", url);
	oReq.send();
}

