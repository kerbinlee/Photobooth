import React from 'react';

export interface TimeButtonProps {
  date: Date;
}

export interface TimeButtonState {
}

class TimeButton extends React.Component<TimeButtonProps, TimeButtonState> {
  render() {
    return (
        <h2>It is {this.props.date.toLocaleTimeString()}.</h2>
    );
  }
}

export default TimeButton;
