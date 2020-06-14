import React from 'react';
import Photo from './Photo';

export interface PhotoGridProps {
  url: string,
}

export interface PhotoGridState {
  photoData: PhotoData[]
}

interface PhotoData {
  fileName: string,
  labels: string,
  favorite: number,
}

class PhotoGrid extends React.Component<PhotoGridProps, PhotoGridState> {
  state = {
    photoData: []
  }

  componentDidMount() {
    var oReq = new XMLHttpRequest();
    oReq.open("GET", this.props.url + "query?load_images", true);
    oReq.onload = () => {
      const responseData: PhotoData[] = JSON.parse(oReq.responseText);
      this.setState({ photoData: responseData });
      // for(var i = obj.length - 1; i >= 0; i--) { // iterate backwards to show most recent first, since appending to front
      //     appendImage(obj[obj.length-i-1].fileName, obj[obj.length-i-1].favorite);
      // }
    }
    oReq.send("photos_loaded");
  }

  componentWillUnmount() {
  }

  render() {
    return (
      <div className="flexy">
        {this.state.photoData.map((photo: PhotoData) =>
          <Photo key={photo.fileName} imageURL={this.props.url + photo.fileName} favorite={photo.favorite ? true : false} />
        )}

        {/*         
                if (photosContainer.children.length == 0) {
                    photosContainer.append(flexBox);
                } else { // append image in front of other images
                    photosContainer.insertBefore(flexBox, photosContainer.children[0]);
                } */}
      </div>
    );
  }
}

export default PhotoGrid;