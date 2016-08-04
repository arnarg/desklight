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
	ToolbarAndroid,
	Text
} from 'react-native';

import App from './src/app';

const _routes = [
	{title: 'Desklight', index: 0},
	{title: 'Settings', index: 1}
];

let _navigator; // we fill this up upon on first navigation.

BackAndroid.addEventListener('hardwareBackPress', () => {
	if (_navigator.getCurrentRoutes().length === 1 ) {
		return false;
	}
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
		let navIcon = null;
		let actions = [{
			title: 'Settings',
			icon: require('image!ic_settings_white_24dp'),
			show: 'always'
		}];

		if (route.index === 1) {
			navIcon = require('image!ic_arrow_back_white_24dp');
			actions = null;
		}

		return (
			<View style={styles.appContainer}>
				<ToolbarAndroid
					style={styles.navBar}
					title={route.title}
					navIcon={navIcon}
					onIconClicked={navigator.pop}
					actions={actions}
					onActionSelected={this.onActionSelected}
					titleColor={'#FFFFFF'}
				/>
				<App
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
	navBar: {
		height: 56,
		backgroundColor: '#607d8b'
	},
	appContainer: {
		flex: 1,
		backgroundColor: 'white'
	}
});

AppRegistry.registerComponent('Desklight', () => Desklight);
