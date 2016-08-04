'use strict';

import React, { Component } from 'react';
import {
	Text,
	View
} from 'react-native';
import connectToStores from 'alt-utils/lib/connectToStores';

import Main from './components/Main';
import Settings from './components/Settings';
import Connecting from './components/Connecting';
import Disconnected from './components/Disconnected';

import SocketStore from './stores/SocketStore';

class App extends Component {
	constructor() {
		super();
	}

	static getStores(props) {
		return [SocketStore];
	}

	static getPropsFromStores(props) {
		return {socket: SocketStore.getState()};
	}

	render() {
		let Component = Main;

		switch(this.props.route.index) {
			case 0:
				if (this.props.socket.state === 0)
					Component = Disconnected;
				else if (this.props.socket.state === 1)
					Component = Connecting;
				else
					Component = Main;
				break;
			case 1:
				Component = Settings;
				break;
		};

		return (
				<Component
					navigator={this.props.navigator}
					route={this.props.route}
					socket={this.props.socket}
				/>
		);
	}
}

export default connectToStores(App);
