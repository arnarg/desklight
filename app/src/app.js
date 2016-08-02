'use strict';

import React, { Component } from 'react';
import {
	StyleSheet,
	Text,
	View,
	Navigator
} from 'react-native';

import Main from './components/Main';
import Settings from './components/Settings';

class App extends Component {
	constructor() {
		super();
		this.renderScene = this.renderScene.bind(this);
	}

	render() {
		const routes = [
			{title: 'Desklight', index: 0},
			{title: 'Settings', index: 1}
		];

		const navigationBar = (
			<Navigator.NavigationBar
				style={styles.navBar}
				routeMapper={{
					Title: () => {},
					RightButton: () => {},
					LeftButton: (route, navigator, index, navState) => {
						return (<Text style={styles.navBarTitle}>{route.title}</Text>);
					}
				}}
			/>
		);

		return (
			<Navigator
				initialRoute={routes[0]}
				initialRouteStack={routes}
				renderScene={this.renderScene}
				navigationBar={navigationBar}
			/>
		);
	}

	renderScene(route, navigator) {
		let Component = Main;

		switch(route.index) {
			case 0:
				Component = Main;
				break;
			case 1:
				Component = Settings;
				break;
		};

		return (
			<View style={styles.appContainer}>
				<Component
					navigator={navigator}
					route={route}
				/>
			</View>
		);
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
	appContainer: {
		flex: 1,
		backgroundColor: 'white'
	}
});

export default App;
