import React from 'react';
import Tag from './Tag';
import LabelInput from './LabelInput';

export interface LabelsProps {
  fileName: string,
  favorite: boolean,
  isChangingTag: boolean,
  labelValue: string,
  labelValueOnChange: (event: React.FormEvent<HTMLInputElement>) => void,
  addLabelMethod: () => void,
  labels: string[],
  deleteTagMethod: (tagName: string) => void,
}

export interface LabelsState {
}

class Labels extends React.Component<LabelsProps, LabelsState> {
  componentDidMount() {
  }

  componentWillUnmount() {
  }


  render() {
    const labelBoxStyle = {
      background: this.props.isChangingTag ? 'rgb(186,154,138)' : '',
    }

    const tags = this.props.labels.map((tag, index) => 
      <Tag fileName={this.props.fileName} labelsArrayI={tag} isChangingTag={this.props.isChangingTag} key={index} deleteTagMethod={this.props.deleteTagMethod}/>
    );

    let labelInput;
    if (this.props.labels.length < 10) {
      labelInput = <LabelInput fileName={this.props.fileName} addLabelMethod={this.props.addLabelMethod} labelValue={this.props.labelValue} labelValueOnChange={this.props.labelValueOnChange}/>
    }

    return (
      <div>
        <div id={"labelBox:" + this.props.fileName} className="labelBox" style={labelBoxStyle}>
          {tags}
        </div>
        <div>
          {labelInput}
        </div>
      </div>
    );
  }
}

export default Labels;