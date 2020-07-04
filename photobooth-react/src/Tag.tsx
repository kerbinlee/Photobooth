import React from 'react';

export interface TagProps {
  originalFileName: string,
  labelsArrayI: string,
  isChangingTag: boolean,
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
    // const crossButtonStyle = {
    //   display: this.props.isChangingTag ? 'block' : 'none',
    // };

    // let crossContainer;
    // if (this.props.isChangingTag) {
    //   crossContainer = 
    //     <div>
    //       <img className="cross_Image" src="photobooth/removeTagButton.png"/>
    //     </div>;
    //     {/* crossContainer.setAttribute( "onClick", "delete_tag('"+originalFileName+"','"+labels_Array_i+"')" ); */}
    // }

    {/* {crossContainer} */}
  
    const crossImageStyle = {display: "block"};
    let crossImage;
    if (this.props.isChangingTag) {
      crossImage = <img className="cross_Image" src="photobooth/removeTagButton.png" style={crossImageStyle}/>
    }
    
    return (
      <div id={"tag:" + this.props.originalFileName + ":" + this.props.labelsArrayI} className="tag">
        <div>
          {/* var crossContainer = document.createElement("div"); */}
          {/* crossContainer.setAttribute( "onClick", "delete_tag('"+originalFileName+"','"+labels_Array_i+"')" ); */}
          {crossImage}
        </div>
        <div className="tag_name">{this.props.labelsArrayI}</div>
      </div>
    );
  }
}

export default Tag;