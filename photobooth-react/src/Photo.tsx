import React from 'react';
import Labels from './Labels';
import BurgerButton from './BurgerButton';
import Constants from './Constants';

export interface PhotoProps {
  fileName: string,
  favorite: boolean,
}

export interface PhotoState {
  isMenuOpen: boolean,
  isChangingTag: boolean,
  labelInputValue: string,
  labels: string[],
}

class Photo extends React.Component<PhotoProps, PhotoState> {
  constructor(props: PhotoProps) {
    super(props);
    this.state = {
      isMenuOpen: false,
      isChangingTag: false,
      labelInputValue: "",
      labels: [],
    }

    this.handleClick = this.handleClick.bind(this);
    this.chnageTags = this.chnageTags.bind(this);
    this.addLabel = this.addLabel.bind(this);
    this.updateLabel = this.updateLabel.bind(this);
  }

  componentDidMount() {
    // get data from database
    const oReq = new XMLHttpRequest();
    oReq.open("GET", Constants.baseURL + "query?load_images", true);

    // when data from database is loaded
    oReq.onload = () => {
      const obj = JSON.parse(oReq.responseText);
      // find image data
      let saveI = 0;
      for (let i = 0; i < obj.length; i++) {
        if (obj[i].fileName === this.props.fileName) {
          saveI = i;
          break;
        }
      }

      this.setState({ labels: obj[saveI].labels.split(",") });
    }
    oReq.send();
  }

  componentWillUnmount() {
  }

  handleClick(): void {
    this.setState(state => ({isMenuOpen: !state.isMenuOpen}));
  }

  chnageTags(): void {
    this.setState({
      isMenuOpen: false,
      isChangingTag: true
    });
  }

  updateLabel(event: React.FormEvent<HTMLInputElement>): void {
    const new_label = event.currentTarget.value;
    this.setState({labelInputValue: new_label});
  }

  addLabel(): void {
    const oReq = new XMLHttpRequest();
    oReq.open("GET", Constants.baseURL + "query?load_images", true);

    let newArray = "";
    oReq.onload = () => {
      const obj = JSON.parse(oReq.responseText);
      let saveI = 0;
      for (let i = 0; i < obj.length; i++) {
        if (obj[i].fileName === this.props.fileName) {
          saveI = i;
          break;
        }
      }

      if (obj[saveI].labels !== "") {
        newArray = obj[saveI].labels + "," + this.state.labelInputValue;
        const oReqTwo = new XMLHttpRequest();
        oReqTwo.open("POST", Constants.baseURL + "query?add_label?" + this.props.fileName + "?" + newArray, true);
        oReqTwo.onload = () => {
          this.setState(
            {
              labels: newArray.split(","),
              labelInputValue: "",
            });
        }
        oReqTwo.send();
      } else {
        newArray = this.state.labelInputValue;
        const oReqThree = new XMLHttpRequest();
        oReqThree.open("POST", Constants.baseURL + "query?add_label?" + this.props.fileName + "?" + newArray, true);
        oReqThree.onload = () => {
          this.setState(
            {
              labels: [newArray],
              labelInputValue: "",
            });
        }
        oReqThree.send();
      }
    }

    oReq.send();

    this.setState({isChangingTag: false});
  }

  render() {
    const imgMenuStyle = {
      display: this.state.isMenuOpen ? 'flex' : 'none',
    };

    return (
      <div className="flexy">
        <div id={this.props.fileName} className="imageContainer">
          <img id={"image:" + this.props.fileName} className="imageDiv" src={Constants.baseURL + this.props.fileName} />
          <div className="imgOptionsDiv">
            <div id={"imgMenu:" + this.props.fileName} className="imgMenu" style={imgMenuStyle}>
              <button className="imgOptionsButton" onClick={this.chnageTags}>change tags</button>
              {/* changeTagsButton.setAttribute("onClick", "change_tags('"+imageURL+"')"); */}
              <button id={"favorite:" + this.props.fileName} className="imgOptionsButton">
                {this.props.favorite ? "unfavorite" : "add to favorites"}
                {/* favButton.setAttribute("onClick", "mark_favorite('"+imageURL+"',"+favorite+")"); */}
              </button>
            </div>
            <BurgerButton imageURL={this.props.fileName} favorite={this.props.favorite} handleClick={this.handleClick} isMenuOpen={this.state.isMenuOpen}/>
          </div>
        </div>
        <Labels fileName={this.props.fileName} favorite={this.props.favorite} isChangingTag={this.state.isChangingTag} addLabelMethod={this.addLabel} labelValue={this.state.labelInputValue} labelValueOnChange={this.updateLabel} labels={this.state.labels}/>
      </div>
    );
  }
}

export default Photo;