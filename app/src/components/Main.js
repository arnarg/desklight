'use strict';

import React, { Component } from 'react';
import {
	StyleSheet,
	Text,
	View
} from 'react-native';
import connectToStores from 'alt-utils/lib/connectToStores';

import Color from './Color';
import Controls from './Controls';
import Presets from './Presets';

import ColorStore from '../stores/ColorStore';
import SocketStore from '../stores/SocketStore';

class Main extends Component {
	constructor() {
		super();
	}

	static getStores(props) {
		return [ColorStore];
	}

	static getPropsFromStores(props) {
		return {colors: ColorStore.getState()};
	}

	render() {
		return (
			<View style={styles.container}>
				<Presets colors={this.props.colors} />
				<Color colors={this.props.colors} />
				<Controls colors={this.props.colors} />
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column'
	}
});

export default connectToStores(Main);
