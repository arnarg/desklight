'use strict';

import React, { Component } from 'react';
import {
	View,
	TouchableOpacity,
	AsyncStorage,
	ToastAndroid
} from 'react-native';

import ColorActions from '../actions/ColorActions';

const radius = 25;

class Preset extends Component {
	constructor() {
		super();
		this.state = {color: {red: 180, green: 180, blue: 180}};
		this._onPress = this._onPress.bind(this);
		this._onLongPress = this._onLongPress.bind(this);
	}

	componentWillMount() {
		AsyncStorage.getItem(`@DesklightStore:color${this.props.id}`, (err, res) => {
			if (err) return;
			if (res !== null) {
				this.setState({color: JSON.parse(res)});
			}
		});
	}

	render() {
		const color = `rgb(${this.state.color.red}, ${this.state.color.green}, ${this.state.color.blue})`;
		return (
			<TouchableOpacity
				onPress={this._onPress}
				onLongPress={this._onLongPress}
			>
				<View
					style={{
						height: radius*2,
						width: radius*2,
						borderRadius: radius,
						backgroundColor: color
					}}
				>
				</View>
			</TouchableOpacity>
		);
	}

	_onPress() {
		ColorActions.set(this.state.color);
	}

	_onLongPress() {
		AsyncStorage.setItem(`@DesklightStore:color${this.props.id}`, JSON.stringify(this.props.colors), (err) => {
			if (!err) {
				this.setState({color: this.props.colors});
				ToastAndroid.show('Preset saved.', ToastAndroid.SHORT);
			} else {
				ToastAndroid.show('Could not save preset', ToastAndroid.SHORT);
			}
		});
	}
}

export default Preset;
