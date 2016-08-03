'use strict';

import alt from '../alt';
import ColorActions from '../actions/ColorActions';

import net from 'react-native-tcp';

global.Buffer = global.Buffer || require('buffer').Buffer

/* Connection state
 * 0: Disconnected
 * 1: Connecting
 * 2: Connected */

class SocketStore {
	constructor() {
		this.state = {state: 1};
		this.socket = net.createConnection({host: '192.168.1.60', port: 1234}, () => {
			this.setState({state: 2});
		});

		this.socket.on('end', () => {
			this.setState({state: 0});
		});

		this.bindAction(ColorActions.RED, this.updateRed);
		this.bindAction(ColorActions.GREEN, this.updateGreen);
		this.bindAction(ColorActions.BLUE, this.updateBlue);
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
}

export default alt.createUnsavedStore(SocketStore, 'SocketStore');
