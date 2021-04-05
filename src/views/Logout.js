import React, {Component} from 'react';
import {StyleSheet, View, Image} from 'react-native';
import {CommonActions} from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import {loading} from '../config/Constants';
import Dialog from 'react-native-dialog';
import {font_title, font_description} from '../config/Constants';
import {theme_bg} from '../assets/css/Colors';
export default class Logout extends Component<Props> {
  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.state = {
      dialogVisible: false,
    };
  }

  handleBackButtonClick = () => {
    this.props.navigation.goBack(null);
  };

  async componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.showDialog();
    });
  }
  componentWillUnmount() {
    this._unsubscribe();
  }

  showDialog = () => {
    this.setState({dialogVisible: true});
  };

  closeDialog = () => {
    this.setState({dialogVisible: false});
    this.handleBackButtonClick();
  };

  handleCancel = () => {
    this.setState({dialogVisible: false});
    this.handleBackButtonClick();
  };

  handleLogout = async () => {
    await this.closeDialog();
    AsyncStorage.clear();
    this.resetMenu();
  };

  resetMenu() {
    this.props.navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'Login'}],
      }),
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{height: 43, width: 122}}>
          <Image
            style={{flex: 1, width: undefined, height: undefined}}
            source={loading}
          />
          <Dialog.Container visible={this.state.dialogVisible}>
            <Dialog.Title style={{fontFamily: font_description}}>
              Confirm
            </Dialog.Title>
            <Dialog.Description style={{fontFamily: font_description}}>
              Do you want to logout?.
            </Dialog.Description>
            <Dialog.Button
              label="Yes"
              onPress={this.handleLogout}
              style={{fontFamily: font_description, color: theme_bg}}
            />
            <Dialog.Button
              label="No"
              onPress={this.handleCancel}
              style={{fontFamily: font_description, color: theme_bg}}
            />
          </Dialog.Container>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
});
