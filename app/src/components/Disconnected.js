'use strict';

import React, { Component } from 'react';
import {
	StyleSheet,
	Text,
	View,
	Button,
	TouchableOpacity
} from 'react-native';

import SocketActions from '../actions/SocketActions';

class Disconnected extends Component {
	render() {
		return (
			<View style={styles.container}>
				<Text style={styles.text}>Disconnected</Text>
				<TouchableOpacity
					onPress={() => {
						SocketActions.connect();
					}}
				>
					<View style={styles.btn}>
						<Text style={styles.btnText}>Reconnect</Text>
					</View>
				</TouchableOpacity>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	text: {
		fontSize: 20
	},
	btn: {
		backgroundColor: '#607d8b',
		paddingVertical: 6,
		paddingHorizontal: 16,
		marginTop: 10
	},
	btnText: {
		color: 'white',
		fontSize: 18
	}
});

export default Disconnected;
