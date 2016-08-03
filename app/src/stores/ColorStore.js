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
		this.bindAction(ColorActions.SET, this.update);
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

	update(colors) {
		this.setState({red: colors.red, green: colors.green, blue: colors.blue});
	}
}

export default alt.createStore(ColorStore, 'ColorStore');
