'use strict';

import { AsyncStorage, ToastAndroid } from 'react-native';
import alt from '../alt';
import ColorActions from '../actions/ColorActions';
import SocketActions from '../actions/SocketActions';

import net from 'react-native-tcp';
import parallel from 'async/parallel';

global.Buffer = global.Buffer || require('buffer').Buffer

/* Connection state
 * 0: Disconnected
 * 1: Connecting
 * 2: Connected */

class SocketStore {
	constructor() {
		this.state = {state: 0, settings: {host: 'localhost', port: 4759}};

		parallel([
			(cb) => {
				AsyncStorage.getItem('@DesklightStore:host', cb);
			},
			(cb) => {
				AsyncStorage.getItem('@DesklightStore:port', cb);
			}
		],
		(err, res) => {
			if (res[0] !== null) this.state.settings.host = res[0];
			if (res[1] !== null) this.state.settings.port = parseInt(res[1]);

			this.connect();
		});

		this.bindAction(ColorActions.RED, this.updateRed);
		this.bindAction(ColorActions.GREEN, this.updateGreen);
		this.bindAction(ColorActions.BLUE, this.updateBlue);
		this.bindAction(ColorActions.SET, this.update);
		this.bindAction(SocketActions.SET_HOST, this.setHost);
		this.bindAction(SocketActions.SET_PORT, this.setPort);
		this.bindAction(SocketActions.CONNECT, this.connect);
		this.bindAction(SocketActions.FADE, this.fade);
	}

	updateRed(value) {
		this.socket.write(Buffer.from([0, value]));
	}

	updateGreen(value) {
		this.socket.write(Buffer.from([1, value]));
	}

	updateBlue(value) {
		this.socket.write(Buffer.from([2, value]));
	}

	update(colors) {
		this.socket.write(Buffer.from([0, colors.red, 1, colors.green, 2, colors.blue]));
	}

	fade() {
		this.socket.write(Buffer.from([3, 0]));
	}

	setHost(host) {
		AsyncStorage.setItem('@DesklightStore:host', `${host}`, (err) => {
			if (!err) {
				this.setState({settings: {host: host, port: this.state.settings.port}});
				ToastAndroid.show('Saved host.', ToastAndroid.SHORT);
			} else {
				ToastAndroid.show('Error saving host.', ToastAndroid.SHORT);
			}
		});
	}

	setPort(port) {
		AsyncStorage.setItem('@DesklightStore:port', `${port}`, (err) => {
			if (!err) {
				this.setState({settings: {host: this.state.settings.host, port: port}});
				ToastAndroid.show('Saved port.', ToastAndroid.SHORT);
			} else {
				ToastAndroid.show('Error saving port.', ToastAndroid.SHORT);
			}
		});
	}

	connect() {
		this.setState({state: 1});

		if (this.socket) this.socket.end();

		this.socket = net.createConnection({
			host: this.state.settings.host,
			port: this.state.settings.port
		}, () => {
			this.setState({state: 2});
		});

		this.socket.on('error', (ex) => {
			this.setState({state: 0});
			ToastAndroid.show('Could not establish connection.', ToastAndroid.SHORT);
		});

		this.socket.on('close', () => {
			this.setState({state: 0});
			ToastAndroid.show('Connection closed.', ToastAndroid.SHORT);
		});
	}
}

export default alt.createUnsavedStore(SocketStore, 'SocketStore');
