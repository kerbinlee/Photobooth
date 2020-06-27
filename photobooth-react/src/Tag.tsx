import React from 'react';

export interface TagProps {
  originalFileName: string,
  labelsArrayI: string,
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
      <div id={"tag:" + this.props.originalFileName + ":" + this.props.labelsArrayI} className="tag">
        <div>
          {/* var crossContainer = document.createElement("div"); */}
          {/* crossContainer.setAttribute( "onClick", "delete_tag('"+originalFileName+"','"+labels_Array_i+"')" ); */}
          <img className="cross_Image" src="photobooth/removeTagButton.png" />
          <div className="tag_name">{this.props.labelsArrayI}</div>
        </div>
      </div>
    );
  }
}

export default Tag;