import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  ScrollView,
  Image,
  Keyboard,
} from 'react-native';
import {Button} from 'react-native-elements';
import {Icon} from 'native-base';
import Snackbar from 'react-native-snackbar';
import {
  api_url,
  reset,
  height_50,
  height_30,
  reset_password,
  font_title,
  font_description,
} from '../config/Constants';
import {StatusBar, Loader} from '../components/GeneralComponents';
import axios from 'axios';
import {connect} from 'react-redux';
import {
  serviceActionPending,
  serviceActionError,
  serviceActionSuccess,
} from '../actions/ResetActions';
import * as colors from '../assets/css/Colors';
import {CommonActions} from '@react-navigation/native';

class Reset extends Component<Props> {
  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.state = {
      password: '',
      confirm_password: '',
      validation: true,
    };
  }

  handleBackButtonClick() {
    this.props.navigation.goBack(null);
    return true;
  }

  reset_password = async () => {
    Keyboard.dismiss();
    await this.checkValidate();
    if (this.state.validation) {
      this.props.serviceActionPending();
      await axios({
        method: 'post',
        url: api_url + reset,
        data: {id: this.props.id, password: this.state.password},
      })
        .then(async response => {
          await this.props.serviceActionSuccess(response.data);
          await this.login();
        })
        .catch(error => {
          this.props.serviceActionError(error);
        });
    }
  };

  login() {
    if (this.props.status == 1) {
      this.props.navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'Login'}],
        }),
      );
    } else {
      this.showSnackbar(this.props.message);
    }
  }

  checkValidate() {
    if (this.state.confirm_password == '' || this.state.password == '') {
      this.state.validation = false;
      this.showSnackbar('Please fill all the fields.');
      return true;
    } else if (this.state.confirm_password != this.state.password) {
      this.state.validation = false;
      this.showSnackbar('Password and confirm password does not match');
      return true;
    } else {
      this.state.validation = true;
    }
  }

  showSnackbar(msg) {
    Snackbar.show({
      title: msg,
      color: 'white',
      duration: Snackbar.LENGTH_SHORT,
    });
  }

  render() {
    const {isLoding, error, data, message, status} = this.props;

    return (
      <ScrollView keyboardShouldPersistTaps="always">
        <View style={styles.container}>
          <View>
            <StatusBar />
          </View>
          <Loader visible={isLoding} />
          <View style={styles.block_one}>
            <View>
              <Text style={styles.reset_password}>Reset Password</Text>
            </View>
            <View style={styles.back_content}>
              <Icon
                onPress={this.handleBackButtonClick}
                style={styles.back_icon}
                name="arrow-back"
              />
            </View>
            <View style={styles.reset_image_content}>
              <Image
                style={{flex: 1, width: undefined, height: undefined}}
                source={reset_password}
              />
            </View>
          </View>
          <View style={styles.block_two}>
            <View style={styles.input_content}>
              <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry={true}
                onChangeText={TextInputValue =>
                  this.setState({password: TextInputValue})
                }
              />
              <View style={{marginTop: 20}} />
              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                secureTextEntry={true}
                onChangeText={TextInputValue =>
                  this.setState({confirm_password: TextInputValue})
                }
              />
            </View>
          </View>
          <View style={styles.footer}>
            <View style={styles.footer_container}>
              <Button
                title="Reset Password"
                onPress={this.reset_password}
                buttonStyle={styles.reset_password_btn}
                titleStyle={{
                  color: colors.theme_bg_three,
                  fontFamily: font_description,
                  fontWeight: '700',
                }}
              />
            </View>
          </View>
          <View style={{marginTop: '26%'}} />
        </View>
      </ScrollView>
    );
  }
}

function mapStateToProps(state) {
  return {
    isLoding: state.reset.isLoding,
    error: state.reset.error,
    data: state.reset.data,
    message: state.reset.message,
    status: state.reset.status,
    id: state.forgot.data.id,
  };
}

const mapDispatchToProps = dispatch => ({
  serviceActionPending: () => dispatch(serviceActionPending()),
  serviceActionError: error => dispatch(serviceActionError(error)),
  serviceActionSuccess: data => dispatch(serviceActionSuccess(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Reset);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.theme_bg_three,
  },
  back_icon: {
    color: colors.theme_bg,
  },
  back_content: {
    width: '100%',
    position: 'absolute',
    top: 30,
    left: 10,
  },
  block_one: {
    width: '100%',
    height: height_50,
    backgroundColor: colors.theme_bg_three,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reset_image_content: {
    height: 152,
    width: 150,
    top: 50,
  },
  reset_password: {
    color: colors.theme_bg,
    fontSize: 25,
    fontWeight: '400',
    fontFamily: font_title,
  },
  block_two: {
    width: '100%',
    height: height_30,
    backgroundColor: colors.theme_bg_three,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input_content: {
    width: '80%',
  },
  input: {
    height: 50,
    borderColor: colors.theme_fg,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    fontFamily: font_description,
  },
  footer: {
    width: '100%',
    alignItems: 'center',
  },
  footer_container: {
    width: '80%',
    marginTop: 10,
  },
  reset_password_btn: {
    backgroundColor: colors.theme_bg,
    height: 55,
  },
});
