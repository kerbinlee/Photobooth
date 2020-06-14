import React from 'react';
import LabelInput from './LabelInput';

export interface TagProps {
  originalFileName: string,
  labels_Array_i: string,
}

export interface TagState {
}

class Tag extends React.Component<TagProps, TagState> {
  state = {
  }

  componentDidMount() {

  }

  componentWillUnmount() {
  }

  render() {
    return (
      <div id={"tag:" + this.props.originalFileName + ":" + this.props.labels_Array_i} className="tag">
        <div>
          {/* var crossContainer = document.createElement("div"); */}
          {/* crossContainer.setAttribute( "onClick", "delete_tag('"+originalFileName+"','"+labels_Array_i+"')" ); */}
          <img className="cross_Image" src="photobooth/removeTagButton.png" />
        </div>
        <div className="tag_name">{this.props.labels_Array_i}</div>
        <LabelInput originalFileName={this.props.originalFileName} />
      </div>
    );
  }
}

export default Tag;