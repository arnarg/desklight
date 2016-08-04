'use strict';

import React, { Component } from 'react';
import {
	StyleSheet,
	Text,
	ListView,
	ToastAndroid
} from 'react-native';

class Settings extends Component {
	constructor() {
		super();
	}

	render() {
		const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

		const dataSource = ds.cloneWithRows([
			{
				title: 'Host',
				value: this.props.socket.settings.host
			},
			{
				title: 'Port',
				value: this.props.socket.settings.port
			}
		]);

		return (
			<ListView
				dataSource={dataSource}
				renderRow={(data) => <Text>{data.title} {data.value}</Text>}
			/>
		);
		//return (<Text>hello</Text>);
	}
}

export default Settings;
