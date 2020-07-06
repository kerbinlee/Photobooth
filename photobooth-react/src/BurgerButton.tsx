import React from 'react';

export interface BurgerButtonProps {
  imageURL: string,
  favorite: boolean,
  handleClick: () => void,
  isMenuOpen: boolean,
}

export interface BurgerButtonState {
}

class BurgerButton extends React.Component<BurgerButtonProps, BurgerButtonState> {
  constructor(props: BurgerButtonProps) {
    super(props);
    this.state = {}
  }

  render() {
    const burgerButtonStyle = {
      backgroundColor: this.props.isMenuOpen ? '#885544' : 'rgba(0,0,0,0)',
    };

    return (
      <button id={"burgerButton:" + this.props.imageURL} className="burgerImageDiv" style={burgerButtonStyle} onClick={this.props.handleClick}>
        <img className="burgerMenu" src="photobooth/optionsTriangle.svg" alt="Option Button"/>
      </button>
    );
  }
}

export default BurgerButton;