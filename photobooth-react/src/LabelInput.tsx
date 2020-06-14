import React from 'react';

export interface LabelInputProps {
  originalFileName: string,
}

export interface LabelInputState {
}

class LabelInput extends React.Component<LabelInputProps, LabelInputState> {
  state = {
  }

  componentDidMount() {

  }

  componentWillUnmount() {
  }

  render() {
    return (
      <div id={"labelInputDiv:" + this.props.originalFileName}>
        <input type="text" className="labelInput" placeholder="type new label"></input>
        <div>
          <button className="label_add_button">Add</button>
          {/* labelAddButton.setAttribute("onClick", "add_label('"+originalFileName+"')"); */}
        </div>
      </div>
    )
  }
}

export default LabelInput;