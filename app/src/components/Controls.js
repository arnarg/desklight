'use strict';

import React, { Component } from 'react';
import {
	StyleSheet,
	Text,
	View,
	Slider,
	TouchableOpacity
} from 'react-native';

import ColorSlider from './ColorSlider';

import ColorActions from '../actions/ColorActions';
import SocketActions from '../actions/SocketActions';

class Controls extends Component {
	constructor() {
		super();
	}

	render() {
		return (
			<View style={styles.container}>
				<ColorSlider
					value={this.props.colors.red}
					text='Red'
					onChange={ColorActions.red}
				/>
				<ColorSlider
					value={this.props.colors.green}
					text='Green'
					onChange={ColorActions.green}
				/>
				<ColorSlider
					value={this.props.colors.blue}
					text='Blue'
					onChange={ColorActions.blue}
				/>
				<View style={styles.btnRow}>
					<TouchableOpacity
						onPress={() => SocketActions.fade()}
					>
						<Text style={styles.btnText}>FADE</Text>
					</TouchableOpacity>
				</View>
			</View>
		);
	}

	_valueChange = (color, value) => {
		const colors = this.props.colors;
		colors[color] = value;
		this.props.onChangeColor(colors);
	}
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'column',
		padding: 20
	},
	btnRow: {
		marginTop: 10,
		flex: 0,
		flexDirection: 'row',
		justifyContent: 'center'
	},
	btnText: {
		fontSize: 20,
		color: '#009688'
	}
});

export default Controls;
