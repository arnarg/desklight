'use strict';

import React, { Component } from 'react';
import {
	StyleSheet,
	Text,
	View,
	Slider
} from 'react-native';

import ColorSlider from './ColorSlider';

import ColorActions from '../actions/ColorActions';

class Controls extends Component {
	constructor() {
		super();
	}

	render() {
		return (
			<View style={styles.container}>
				<ColorSlider value={this.props.colors.red} text='Red' onChange={ColorActions.red} />
				<ColorSlider value={this.props.colors.green} text='Green' onChange={ColorActions.green} />
				<ColorSlider value={this.props.colors.blue} text='Blue' onChange={ColorActions.blue} />
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
	}
});

export default Controls;
