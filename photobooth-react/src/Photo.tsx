import React from 'react';
import Labels from './Labels';

export interface PhotoProps {
  imageURL: string,
  favorite: boolean,
}

export interface PhotoState {
}

class Photo extends React.Component<PhotoProps, PhotoState> {
  state = {
  }

  componentDidMount() {

  }

  componentWillUnmount() {
  }

  render() {
    return (
      <div id={this.props.imageURL} className="imageContainer">
        <img id={"image:" + this.props.imageURL} className="imageDiv" src={this.props.imageURL} />
        <div className="imgOptionsDiv">
          <div id={"imgMenu:" + this.props.imageURL} className="imgMenu">
            <button className="imgOptionsButton">change tags</button>
            {/* changeTagsButton.textContent = "change tags"; */}
            {/* changeTagsButton.setAttribute("onClick", "change_tags('"+imageURL+"')"); */}
            <button id={"favorite:" + this.props.imageURL} className="imgOptionsButton">
              {this.props.favorite ? "unfavorite" : "add to favorites"}
              {/* favButton.setAttribute("onClick", "mark_favorite('"+imageURL+"',"+favorite+")"); */}
            </button>
          </div>
          <button id={"burgerButton:" + this.props.imageURL} className="burgerImageDiv">
            {/* burgerImageDiv.setAttribute("onClick", "open_menu('"+imageURL+"')"); */}
            <img className="burgerMenu" src="photobooth/optionsTriangle.svg" />
            {/* burgerMenu.backgroundImage = imageURL; */}
          </button>
        </div>
        <Labels imageURL={this.props.imageURL} favorite={this.props.favorite} />
      </div>
    );
  }
}

export default Photo;