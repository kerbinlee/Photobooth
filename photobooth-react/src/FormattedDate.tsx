import React from 'react';

export interface FormattedDateProps {
  date: Date;

}

export interface FormattedDateState {
}

class FormattedDate extends React.Component<FormattedDateProps, FormattedDateState> {
  render() {
    return (
        <h2>It is {this.props.date.toLocaleTimeString()}.</h2>
    );
  }
}

export default FormattedDate;
