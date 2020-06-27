import React from 'react';
import Photo from './Photo';
import Constants from './Constants';

export interface PhotoGridProps {
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
    let oReq: XMLHttpRequest = new XMLHttpRequest();
    oReq.open("GET", Constants.baseURL + "query?load_images", true);
    oReq.onload = () => {
      const responseData: PhotoData[] = JSON.parse(oReq.responseText);
      this.setState({ photoData: responseData.reverse()});
    }
    oReq.send("photos_loaded");
  }

  componentWillUnmount() {
  }

  render() {
    return (
      <div>
        {this.state.photoData.map((photo: PhotoData) =>
          <Photo key={photo.fileName} fileName={photo.fileName} favorite={photo.favorite ? true : false} />
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