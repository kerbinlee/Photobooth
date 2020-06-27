import React from 'react';
import Constants from './Constants';
import Tag from './Tag';
import LabelInput from './LabelInput';

export interface LabelsProps {
  fileName: string,
  favorite: boolean,
}

export interface LabelsState {
  labels: string[],
}

class Labels extends React.Component<LabelsProps, LabelsState> {
  state = {
    labels: [],
  }

  componentDidMount() {
    // get data from database
    let oReq = new XMLHttpRequest();
    oReq.open("GET", Constants.baseURL + "query?load_images", true);

    // when data from database is loaded
    oReq.onload = () => {
      const obj = JSON.parse(oReq.responseText);
      // find image data
      let saveI = 0;
      for (let i = 0; i < obj.length; i++) {
        if (obj[i].fileName == this.props.fileName) {
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


  render() {
    const tags = this.state.labels.map((tag, index) => 
      <Tag originalFileName={this.props.fileName} labelsArrayI={tag} key={index}/>
    );

    let labelInput;
    if (this.state.labels.length < 10) {
      labelInput = <LabelInput fileName={this.props.fileName} />
    }

    return (
      <div id={"labelBox:" + this.props.fileName} className="labelBox">
        {tags}
        {labelInput}
      </div>
    );
  }
}

export default Labels;