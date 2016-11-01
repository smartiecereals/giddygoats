import React, {Component} from 'react';
import styles from './styles';
import { View, SegmentedControlIOS } from 'react-native';
import { Title } from 'native-base';
const SegmentedControlColor = '#DB343F'


class Head extends Component {
	render() {
		return (
			<View style={styles.viewContainer}>
			 <View>
			   <SegmentedControlIOS 
			     style={styles.segmented} 
			     values={['Current Games', 'Create a Game']} 
			     selectedIndex={this.props.index}
			     onValueChange={ value => this.props.switchMode(value) } 
			     tintColor={SegmentedControlColor}/>
			 </View>
			</View>
		)
	}
}

export default Head;