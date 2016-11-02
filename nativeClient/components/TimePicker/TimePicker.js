import React, {Component} from 'react';
import styles from './styles';
import { View, DatePickerIOS } from 'react-native';

class TimePicker extends Component {

	static defaultProps = {
    date: new Date(Math.ceil(new Date().getTime() / 60000) * 60000),
    timeZoneOffsetInHours: (-1) * (new Date(Math.ceil(new Date().getTime() / 60000) * 60000)).getTimezoneOffset() / 6
  }

	constructor(props) {
		super(props);
		this.state = {
	    date: this.props.date,
	    timeZoneOffsetInHours: this.props.timeZoneOffsetInHours,
	  };
	}

	render() {
		return (
			<View >
		    <DatePickerIOS	    	
	        date={this.state.date}
	        mode="time"
	        timeZoneOffsetInMinutes={this.state.timeZoneOffsetInHours * 60}
	        onDateChange={date => this.setState({date}, () => this.props.onTimeDataChange(this.state.date)) }
	      />	
      </View>
		)
	}

}

export default TimePicker;

/*************************************************************
To change the text color of DatePickerIOS, we need to refactor
code in react-native node modules client. (10/26/2016)
https://github.com/facebook/react-native/issues/4473

1) Open Client/node_modules/react-native/React/Views/RCTDatePickerManager.m
2) Replace lines 32-35 with the following:

- (UIView *)view
{
 RCTDatePicker *datePicker = [RCTDatePicker new];
 [datePicker setValue:[UIColor whiteColor] forKeyPath:@"textColor"];

 return datePicker;
}

4) Save & rebuild simulator
5) Profit

**************************************************************/