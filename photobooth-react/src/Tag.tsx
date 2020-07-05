import React from 'react';

export interface TagProps {
  fileName: string,
  labelsArrayI: string,
  isChangingTag: boolean,
  deleteTagMethod: (tagName: string) => void,
}

export interface TagState {
}

class Tag extends React.Component<TagProps, TagState> {
  constructor(props: TagProps) {
    super(props);

    this.deleteTag = this.deleteTag.bind(this);
  }

  componentDidMount() {

  }

  componentWillUnmount() {
  }

  deleteTag(): void {
    this.props.deleteTagMethod(this.props.labelsArrayI);
  }

  render() {
    const crossImageStyle = {display: "block"};
    let crossImage;
    if (this.props.isChangingTag) {
      crossImage = <img className="cross_Image" src="photobooth/removeTagButton.png" style={crossImageStyle}/>
    }
    
    return (
      <div id={"tag:" + this.props.fileName + ":" + this.props.labelsArrayI} className="tag">
        <div onClick={this.deleteTag}>
          {crossImage}
        </div>
        <div className="tag_name">{this.props.labelsArrayI}</div>
      </div>
    );
  }
}

export default Tag;