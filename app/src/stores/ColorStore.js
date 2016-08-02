'use strict';

import alt from '../alt';
import ColorActions from '../actions/ColorActions';

class ColorStore {
	constructor() {
		this.state = {
			red: 0,
			green: 0,
			blue: 0
		};

		this.bindAction(ColorActions.RED, this.updateRed);
		this.bindAction(ColorActions.GREEN, this.updateGreen);
		this.bindAction(ColorActions.BLUE, this.updateBlue);
	}

	updateRed(value) {
		this.setState({red: value});
	}

	updateGreen(value) {
		this.setState({green: value});
	}

	updateBlue(value) {
		this.setState({blue: value});
	}
}

export default alt.createStore(ColorStore, 'ColorStore');
