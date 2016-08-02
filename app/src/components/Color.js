'use strict';

import React, { Component } from 'react';
import {
	StyleSheet,
	View
} from 'react-native';

class Color extends Component {
	constructor() {
		super();
	}

	render() {
		const background = `rgb(${this.props.colors.red}, ${this.props.colors.green}, ${this.props.colors.blue})`;
		return (
			<View style={{flex: 1, backgroundColor: background}}></View>
		);
	}
}

export default Color;
