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
		this.state = {state: 1, settings: {host: 'localhost', port: 4759}};

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

			ToastAndroid.show(res[0] + ' ' + res[1], ToastAndroid.SHORT);

			this.socket = net.createConnection({host: '192.168.1.60', port: 1234}, () => {
				this.setState({state: 2});
			});

			this.socket.on('end', () => {
				this.setState({state: 0});
			});
		});

		this.bindAction(ColorActions.RED, this.updateRed);
		this.bindAction(ColorActions.GREEN, this.updateGreen);
		this.bindAction(ColorActions.BLUE, this.updateBlue);
		this.bindAction(ColorActions.SET, this.update);
		this.bindAction(SocketActions.SET_HOST, this.setHost);
		this.bindAction(SocketActions.SET_PORT, this.setPort);
		this.bindAction(SocketActions.CONNECT, this.connect);
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

	setHost(host) {
		AsyncStorage.setItem('@DesklightStore:host', `${host}`, (err) => {
			if (!err) {
				this.setState({settings: {host: host, port: this.state.settings.port}});
			} else {
				ToastAndroid.show('Error saving host.', ToastAndroid.SHORT);
			}
		});
	}

	setPort(port) {
		AsyncStorage.setItem('@DesklightStore:port', `${port}`, (err) => {
			if (!err) {
				this.setState({settings: {host: this.state.settings.host, port: port}});
			} else {
				ToastAndroid.show('Error saving port.', ToastAndroid.SHORT);
			}
		});
	}

	connect() {
		this.setState({state: 1});
		this.socket = net.createConnection({
			host: this.state.settings.host,
			port: this.state.settings.port
		}, () => {
			this.setState({state: 2});
		});

		this.socket.on('end', () => {
			this.setState({state: 0});
		});
	}
}

export default alt.createUnsavedStore(SocketStore, 'SocketStore');
