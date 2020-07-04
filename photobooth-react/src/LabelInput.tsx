import React from 'react';

export interface LabelInputProps {
  fileName: string,
  labelValue: string,
  labelValueOnChange: (event: React.FormEvent<HTMLInputElement>) => void,
  addLabelMethod: () => void,
}

export interface LabelInputState {
  newLabel: string,
}

class LabelInput extends React.Component<LabelInputProps, LabelInputState> {
  constructor(props: LabelInputProps) {
    super(props);

    this.state = {
      newLabel: "",
    }
  }

  componentDidMount() {

  }

  componentWillUnmount() {
  }

  render() {
    const labelInputStyle = {display: 'block'};
    return (
      <div id={"labelInputDiv:" + this.props.fileName} style={labelInputStyle}>
        <form onSubmit={this.props.addLabelMethod}>
        <input type="text" className="labelInput" placeholder="type new label" value={this.props.labelValue} onChange={this.props.labelValueOnChange}/>
        <div>
          <input type="button" className="label_add_button" value="Add" onClick={this.props.addLabelMethod}/>
        </div>
        </form>
      </div>
    )
  }
}

export default LabelInput;