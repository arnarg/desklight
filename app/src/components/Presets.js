'use strict';

import React, { Component } from 'react';
import {
	StyleSheet,
	View
} from 'react-native';

import Preset from './Preset';

const nrOfPresets = 5;

class Presets extends Component {
	constructor() {
		super();
	}

	render() {
		const presets = [];

		for (let i = 0; i < nrOfPresets; ++i) {
			presets.push(
				<Preset id={i} key={i} colors={this.props.colors} />
			);
		}

		return (
			<View style={styles.container}>
				{presets}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		paddingTop: 10,
		paddingBottom: 10,
		paddingLeft: 20,
		paddingRight: 20,
		flex: 0,
		flexDirection: 'row',
		justifyContent: 'space-between'
	}
});

export default Presets;
