'use strict';

import React, { Component } from 'react';
import {
	StyleSheet,
	Text,
	TextInput,
	ListView,
	ToastAndroid,
	View,
	TouchableHighlight,
	TouchableOpacity,
	Modal
} from 'react-native';

import SocketActions from '../actions/SocketActions';

class Settings extends Component {
	constructor() {
		super();
		this.state = {
			modalVisible: false,
			modalData: {key: '', port: ''}
		}
		this.renderRow = this.renderRow.bind(this);
	}

	render() {
		const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.value !== r2.value});

		const dataSource = ds.cloneWithRows([
			{
				key: 'Host',
				value: this.props.socket.settings.host
			},
			{
				key: 'Port',
				value: this.props.socket.settings.port
			}
		]);

		return (
			<View style={styles.container}>
				<Modal
					animationType={'none'}
					transparent={true}
					visible={this.state.modalVisible}
					onRequestClose={() => {}}
					style={{height: 22}}
				>
					<View style={styles.modalContainer}>
						<View style={styles.modalStyle}>
							<Text style={styles.modalKeyStyle}>{this.state.modalData.key}</Text>
							<TextInput
								onChangeText={(text) => this.setState({modalData: {key: this.state.modalData.key, value: text}})}
								value={this.state.modalData.value}
								keyboardType={(this.state.modalData.key === 'Port' ? 'numeric':'default')}
							/>
							<View style={styles.btnRow}>
								<TouchableOpacity
									onPress={() => {
										this.setState({modalVisible: false});
									}}
								>
									<Text style={styles.btnText}>CANCEL</Text>
								</TouchableOpacity>
								<TouchableOpacity
									onPress={() => {
										this.setState({modalVisible: false});
										switch(this.state.modalData.key) {
											case 'Host':
												SocketActions.setHost(this.state.modalData.value);
												break;
											case 'Port':
												SocketActions.setPort(this.state.modalData.value.toString());
												break;
										}
									}}
								>
									<Text style={styles.btnText}>OK</Text>
								</TouchableOpacity>
							</View>
						</View>
					</View>
				</Modal>
				<ListView
					dataSource={dataSource}
					renderRow={this.renderRow}
				/>
			</View>
		);
	}

	renderRow(rowData) {
		return (
			<TouchableHighlight
				onPress={() => {
					this.setState({
						modalVisible: true,
						modalData: {
							key: rowData.key,
							value: rowData.value.toString()
						}
					});
				}}
			>
				<View style={styles.rowStyle}>
					<Text style={styles.keyStyle}>{rowData.key}</Text>
					<Text>{rowData.value}</Text>
				</View>
			</TouchableHighlight>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	rowStyle: {
		paddingVertical: 20,
		paddingLeft: 16,
		borderTopColor: 'white',
		borderLeftColor: 'white',
		borderRightColor: 'white',
		borderBottomColor: '#E0E0E0',
		borderWidth: 1,
		backgroundColor: 'white'
	},
	keyStyle: {
		fontSize: 18,
		color: 'black'
	},
	modalContainer: {
		flex: 1,
		justifyContent: 'center',
		paddingHorizontal: 30,
		backgroundColor: 'rgba(0, 0, 0, .6)'
	},
	modalStyle: {
		flex: 0,
		flexDirection: 'column',
		backgroundColor: 'white',
		padding: 20
	},
	modalKeyStyle: {
		fontSize: 20,
		color: 'black'
	},
	btnRow: {
		marginTop: 15,
		flex: 0,
		flexDirection: 'row',
		justifyContent: 'flex-end'
	},
	btnText: {
		color: '#009688',
		fontSize: 15,
		paddingLeft: 15
	}
});

export default Settings;
