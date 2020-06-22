import React from 'react';
import Labels from './Labels';
import BurgerButton from './BurgerButton';

export interface PhotoProps {
  imageURL: string,
  favorite: boolean,
}

export interface PhotoState {
  isMenuOpen: boolean,
}

class Photo extends React.Component<PhotoProps, PhotoState> {
  constructor(props: PhotoProps) {
    super(props);
    this.state = {
      isMenuOpen: false,
    }

    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {

  }

  componentWillUnmount() {
  }

  handleClick(): void {
    this.setState(state => ({isMenuOpen: !state.isMenuOpen}));
  }

  render() {
    const imgMenuStyle = {
      display: this.state.isMenuOpen ? 'flex' : 'none',
    };

    return (
      <div className="flexy">
        <div id={this.props.imageURL} className="imageContainer">
          <img id={"image:" + this.props.imageURL} className="imageDiv" src={this.props.imageURL} />
          <div className="imgOptionsDiv">
            <div id={"imgMenu:" + this.props.imageURL} className="imgMenu" style={imgMenuStyle}>
              <button className="imgOptionsButton">change tags</button>
              {/* changeTagsButton.setAttribute("onClick", "change_tags('"+imageURL+"')"); */}
              <button id={"favorite:" + this.props.imageURL} className="imgOptionsButton">
                {this.props.favorite ? "unfavorite" : "add to favorites"}
                {/* favButton.setAttribute("onClick", "mark_favorite('"+imageURL+"',"+favorite+")"); */}
              </button>
            </div>
            <BurgerButton imageURL={this.props.imageURL} favorite={this.props.favorite} handleClick={this.handleClick} isMenuOpen={this.state.isMenuOpen}/>
          </div>
        </div>
        <Labels imageURL={this.props.imageURL} favorite={this.props.favorite} />
      </div>
    );
  }
}

export default Photo;