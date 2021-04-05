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
import {Button, Icon, Input} from 'react-native-elements';
import {
  Container,
  Content,
  Card,
  CardItem,
  Row,
  Col,
  Body,
  Footer,
} from 'native-base';
import Snackbar from 'react-native-snackbar';
import {
  api_url,
  login,
  height_40,
  login_image,
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
} from '../actions/LoginActions';
import AsyncStorage from '@react-native-community/async-storage';
import {CommonActions} from '@react-navigation/native';
import * as colors from '../assets/css/Colors';

class Login extends Component<Props> {
  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.state = {
      phone_number: '',
      validation: true,
      fcm_token: global.fcm_token,
    };
  }

  handleBackButtonClick() {
    this.props.navigation.goBack(null);
    return true;
  }

  login = async () => {
    Keyboard.dismiss();
    await this.checkValidate();
    if (this.state.validation) {
      this.props.serviceActionPending();
      await axios({
        method: 'post',
        url: api_url + login,
        data: {
          phone_number: this.state.phone_number,
          password: this.state.password,
          fcm_token: this.state.fcm_token,
        },
      })
        .then(async response => {
          await this.props.serviceActionSuccess(response.data);
          await this.saveData();
        })
        .catch(error => {
          alert(error);
          this.props.serviceActionError(error);
        });
    }
  };

  checkValidate() {
    if (this.state.phone_number == '' || this.state.password == '') {
      this.state.validation = false;
      this.showSnackbar('Please fill all the fields.');
      return true;
    } else {
      this.state.validation = true;
      return true;
    }
  }

  saveData = async () => {
    if (this.props.status == 1) {
      try {
        await AsyncStorage.setItem('user_id', this.props.data.id.toString());
        await AsyncStorage.setItem(
          'delivery_boy_name',
          this.props.data.delivery_boy_name.toString(),
        );
        global.id = await this.props.data.id;
        global.delivery_boy_name = await this.props.data.delivery_boy_name;
        await this.home();
      } catch (e) {}
    } else {
      alert(this.props.message);
    }
  };

  //   login1 = () => {
  //   this.props.navigation.navigate('Home');
  // }

  forgot = () => {
    this.props.navigation.navigate('Forgot');
  };

  home = () => {
    this.props.navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'Home'}],
      }),
    );
  };

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
          <View style={styles.header_section}>
            <View style={styles.logo_content}>
              <Image style={styles.logo} source={login_image} />
            </View>
          </View>
          <View style={styles.bottom_section}>
            <Card
              style={{
                marginLeft: 15,
                marginRight: 15,
                marginTop: 40,
                borderRadius: 20,
              }}>
              <CardItem bordered style={{borderRadius: 20}}>
                <View style={styles.body_section}>
                  <Text style={[styles.register_name, {color: '#00aeef'}]}>
                    Login
                  </Text>
                  <View style={styles.input}>
                    <Input
                      inputStyle={{fontSize: 13, fontFamily: font_description}}
                      placeholder="Phone"
                      keyboardType="phone-pad"
                      onChangeText={TextInputValue =>
                        this.setState({phone_number: TextInputValue})
                      }
                      leftIcon={
                        <Icon name="phone" size={20} color={colors.theme_bg} />
                      }
                    />
                  </View>
                  <View style={{marginTop: '3%'}} />
                  <View style={styles.input}>
                    <Input
                      inputStyle={{fontSize: 13, fontFamily: font_description}}
                      placeholder="Password"
                      secureTextEntry={true}
                      onChangeText={TextInputValue =>
                        this.setState({password: TextInputValue})
                      }
                      leftIcon={
                        <Icon name="lock" size={20} color={colors.theme_bg} />
                      }
                    />
                  </View>
                  <View style={{margin: 10}} />
                  <View style={styles.footer_section}>
                    <View
                      style={{
                        height: 40,
                        width: '93%',
                        marginTop: 10,
                        marginBottom: 10,
                      }}>
                      <Button
                        title="Login"
                        onPress={this.login}
                        buttonStyle={{
                          backgroundColor: colors.theme_bg,
                          height: 55,
                        }}
                        titleStyle={{
                          color: colors.theme_bg_three,
                          fontFamily: font_description,
                        }}
                      />
                    </View>
                  </View>
                  <View style={{marginTop: 25}} />
                  <View style={styles.forgot_password_container}>
                    <Text
                      onPress={this.forgot}
                      style={{
                        color: colors.theme_fg_four,
                        fontFamily: font_description,
                      }}>
                      Forgot your password?
                    </Text>
                  </View>
                </View>
              </CardItem>
            </Card>
          </View>
        </View>
      </ScrollView>
    );
  }
}

function mapStateToProps(state) {
  return {
    isLoding: state.login.isLoding,
    error: state.login.error,
    data: state.login.data,
    message: state.login.message,
    status: state.login.status,
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
)(Login);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header_section: {
    width: '100%',
    height: height_40,
    backgroundColor: '#F7F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo_content: {
    height: '60%',
    width: 225,
  },
  logo: {
    flex: 1,
    width: undefined,
    height: undefined,
  },
  register_name: {
    color: colors.theme_fg,
    fontSize: 24,
    fontFamily: font_title,
    alignSelf: 'flex-start',
    marginBottom: 15,
    marginHorizontal: 15,
    marginVertical: 15,
  },
  body_section: {
    width: '100%',
    backgroundColor: colors.theme_bg_three,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    height: 30,
    width: '100%',
    marginTop: 10,
    marginBottom: 10,
  },
  input_text: {
    borderColor: colors.theme_bg,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    fontFamily: font_description,
  },
  footer_section: {
    width: '100%',
    alignItems: 'center',
  },
  login_content: {
    width: '100%',
    margin: 5,
    alignItems: 'center',
  },
  login_string: {
    color: colors.theme_fg,
  },
  btn_style: {
    backgroundColor: colors.theme_bg,
  },
  bottom_section: {
    left: 0,
    top: -60,
    width: '90%',
  },
  email: {
    borderColor: colors.theme_bg,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    height: 40,
  },
  forgot_password_container: {
    width: '95%',
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  signup_container: {
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});
