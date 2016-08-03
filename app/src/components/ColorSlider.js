'use strict';

import React, { Component } from 'react';
import {
	StyleSheet,
	Text,
	Slider,
	View
} from 'react-native';

class Main extends Component {
	constructor() {
		super();
		this.state = {value: 0};
		this._onChange = this._onChange.bind(this);
	}

	componentWillMount() {
		this.setState({value: this.props.value});
	}

	render() {
		return (
			<View style={styles.container}>
				<Text style={styles.color}>{this.props.text}</Text>
				<Slider
					minimumValue={0}
					maximumValue={255}
					step={1}
					style={styles.slider}
					value={this.props.value}
					onValueChange={this._onChange}
				/>
				<Text style={styles.value}>{this.props.value}</Text>
			</View>
		);
	}

	_onChange(value) {
		this.setState({value: value});
		this.props.onChange(value);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		paddingTop: 10,
		paddingBottom: 10
	},
	color: {
		width: 55,
		flexDirection: 'column',
		fontSize: 20
	},
	slider: {
		flex: 1,
		flexDirection: 'column'
	},
	value: {
		width: 40,
		flexDirection: 'column',
		fontSize: 20,
		marginLeft: 5
	}
});

export default Main;
