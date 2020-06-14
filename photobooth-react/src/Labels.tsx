import React from 'react';

export interface LabelsProps {
  imageURL: string,
  favorite: boolean,
}

export interface LabelsState {
}

class Labels extends React.Component<LabelsProps, LabelsState> {
  state = {
  }

  componentDidMount() {

  }

  componentWillUnmount() {
  }

  // function photo_label_load(image_url, label_Box) {
  //     var imageURL = image_url;

  //     // get data from database
  //     var oReq = new XMLHttpRequest();
  //     oReq.open("GET", url+"/query?load_images", true);

  //     // when data from database is loaded
  //     oReq.onload = function() {
  //         var obj = JSON.parse(oReq.responseText);
  //         // find image data
  //         var saveI = 0;
  //         for(var i = 0; i < obj.length; i++) {
  //             if(obj[i].fileName == imageURL) {
  //                 saveI = i;
  //                 console.log("print labels for:"+obj[i].fileName);
  //                 break;
  //             }
  //         }

  //         var labelsArray = obj[saveI].labels.split(",");
  //         console.log("test print labels:"+ labelsArray.length);
  //         // append labels to DOM
  //         for(var i = 0; i < labelsArray.length; i++) {
  //             console.log("test print labels:"+ labelsArray[i]);
  //             if(labelsArray[i]!="") {
  //                 tag_append( obj[saveI].fileName,label_Box, decodeURI(labelsArray[i]) ); //decoded here to remove spaces in label when displayed
  //             }
  //         }
  //     }
  //     oReq.send("emptytest"); //this is where it post the data in. the send is important.
  // }

  render() {
    return (
      <div id={"labelBox:" + this.props.imageURL} className="labelBox">
        {/* photo_label_load(imageURL, labelBox); */}

        {/* <Tag/> */}
      </div>
    );
  }
}

export default Labels;