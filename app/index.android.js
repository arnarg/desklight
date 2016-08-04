/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
	AppRegistry,
	StyleSheet,
	View,
	Navigator,
	BackAndroid,
	ToolbarAndroid
} from 'react-native';

import Main from './src/components/Main';
import Settings from './src/components/Settings';

const _routes = [
	{title: 'Desklight', index: 0},
	{title: 'Settings', index: 1}
];

let _navigator; // we fill this up upon on first navigation.

BackAndroid.addEventListener('hardwareBackPress', () => {
	if (!_navigator) return false;
	if (_navigator.getCurrentRoutes().length === 1 ) return false;
	_navigator.pop();
	return true;
});

class Desklight extends Component {
	constructor() {
		super();
		this.renderScene = this.renderScene.bind(this);
		this.onActionSelected = this.onActionSelected.bind(this);
	}

	render() {
		return (
			<Navigator
				initialRoute={_routes[0]}
				initialRouteStack={_routes}
				renderScene={this.renderScene}
			/>
		);
	}

	renderScene(route, navigator) {
		_navigator = navigator;
		let Component = Main;
		let navIcon = null;
		let actions = [{
			title: 'Settings',
			icon: require('image!ic_settings_white_24dp'),
			show: 'always'
		}];

		switch(route.index) {
			case 0:
				Component = Main;
				break;
			case 1:
				Component = Settings;
				navIcon = require('image!ic_arrow_back_white_24dp');
				actions = null;
				break;
		};

		return (
			<View style={styles.appContainer}>
				<ToolbarAndroid
					style={{
						height: 56,
						backgroundColor: '#607d8b'
					}}
					title={route.title}
					navIcon={navIcon}
					onIconClicked={navigator.pop}
					actions={actions}
					onActionSelected={this.onActionSelected}
					titleColor={'#FFFFFF'}
				/>
				<Component
					navigator={navigator}
					route={route}
				/>
			</View>
		);
	}

	onActionSelected(pos) {
		if (pos === 0) _navigator.push(_routes[1]);
	}
}

const styles = StyleSheet.create({
	navigator: {
		flex: 1
	},
	navBar: {
		backgroundColor: '#607d8b'
	},
	navBarTitle: {
		marginTop: 14,
		marginLeft: 14,
		color: 'white',
		fontSize: 20,
		fontWeight: 'bold'
	},
	navBarBtn: {
		marginTop: 12,
		marginRight: 10,
		marginLeft: 10
	},
	appContainer: {
		flex: 1,
		backgroundColor: 'white'
	}
});

AppRegistry.registerComponent('Desklight', () => Desklight);
