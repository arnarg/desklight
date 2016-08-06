'use strict';

import React, { Component } from 'react';
import {
	StyleSheet,
	Text,
	View
} from 'react-native';

class Disconnected extends Component {
	render() {
		return (
			<View style={styles.container}>
				<Text style={styles.text}>Connecting...</Text>
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
	}
});

export default Disconnected;
