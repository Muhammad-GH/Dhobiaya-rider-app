import React, {Component} from 'react';
import {
  StyleSheet,
  Modal,
  Text,
  View,
  Image,
  Linking,
  Platform,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {
  Container,
  Header,
  Content,
  Left,
  Body,
  Right,
  Title,
  Button,
  Icon,
  Row,
  Col,
  List,
  ListItem,
  Footer,
} from 'native-base';
import * as colors from '../assets/css/Colors';
import ProgressCircle from 'react-native-progress-circle';
import {Button as Btn, Divider} from 'react-native-elements';
import Moment from 'moment';
import ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'react-native-fetch-blob';

import {
  washing_machine,
  order_status_change,
  api_url,
  capture,
  sticksID,
  font_title,
  font_description,
} from '../config/Constants';
import {fb} from '../config/firebaseConfig';
import axios from 'axios';
import {Loader} from '../components/GeneralComponents';
import {CommonActions} from '@react-navigation/native';

export default class OrderDetails extends Component<Props> {
  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.state = {
      id: this.props.route.params.data,
      data: '',
      allowed_status: [2, 3, 4],
      isLoding: false,
      visibililty: false,
      filepath: {
        data: '',
        uri: '',
      },
      fileData: [],
      fileUri: [],
      obj: [],
    };
  }

  update_status = async () => {
    this.setState({isLoding: true});
    await axios({
      method: 'post',
      url: api_url + order_status_change,
      data: {order_id: this.state.id, status: this.state.data.new_status},
    })
      .then(async response => {
        this.setState({isLoding: false});
      })
      .catch(error => {
        this.setState({isLoding: false});
      });
  };

  call_customer(phone_number) {
    Linking.openURL(`tel:${phone_number}`);
  }

  move_navigate = (lat, lng) => {
    var scheme = Platform.OS === 'ios' ? 'maps:' : 'geo:';
    var url = scheme + `${lat},${lng}`;
    Linking.openURL('google.navigation:q=' + lat + ' , ' + lng + '&mode=d');
    //ios
    //Linking.openURL('maps://app?saddr=100+101&daddr=100+102')}
  };

  handleBackButtonClick = () => {
    this.props.navigation.goBack(null);
  };

  componentDidMount() {
    fb.ref('/delivery_partners/' + global.id + '/orders/' + this.state.id).on(
      'value',
      snapshot => {
        if (snapshot.val() != null) {
          this.setState({data: snapshot.val()}, function() {
            this.get_sticks(this.state.data.order_id);
          });
        } else {
          this.handleBackButtonClick();
        }
      },
    );
  }

  get_sticks = async order_id => {
    await axios({
      method: 'post',
      url: api_url + sticksID + '/' + order_id,
    })
      .then(async response => {
        await this.setState({
          obj: response.data.data,
        });
      })
      .catch(error => {
        console.log('Sorry something went wrong!');
      });
  };

  launchCamera = id => {
    let options = {
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.launchCamera(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
      } else {
        const source = {uri: response.uri};

        var fileDataJ = this.state.fileData.concat(response.data);
        var fileUriJ = this.state.fileUri.concat(response.uri);
        this.setState({
          fileData: fileDataJ,
          fileUri: fileUriJ,
        });
        this.profileimageupdate(response.data, id);
      }
    });
  };

  profileimageupdate = async (data, id) => {
    RNFetchBlob.fetch(
      'POST',
      api_url + capture,
      {
        'Content-Type': 'multipart/form-data',
      },
      [
        {
          name: 'image',
          filename: 'image.png',
          type: 'image/png',
          data: data,
        },
        {
          name: 'id',
          data: id.toString(),
        },
      ],
    )
      .then(resp => {
        console.log(resp);
        // this.showSnackbar('Updated Successfully');
      })
      .catch(err => {
        console.log(err);
        // this.showSnackbar('Error on while uploading,Try again');
      });
  };

  renderFileUri(index) {
    if (this.state.fileUri.length >= 1) {
      return (
        <Image
          source={{uri: this.state.fileUri[index]}}
          style={styles.images}
        />
      );
    } else {
      return (
        <Image
          source={require('../assets/img/placeholder.png')}
          style={styles.images}
        />
      );
    }
  }

  render() {
    const {data, allowed_status, isLoding} = this.state;
    return (
      <Container>
        <Header androidStatusBarColor={colors.theme_bg} style={styles.header}>
          <Left style={{flex: 1}}>
            <Button transparent onPress={this.handleBackButtonClick}>
              <Icon style={styles.icon} name="arrow-back" />
            </Button>
          </Left>
          <Body style={styles.header_body}>
            <Title style={styles.title}>Order Details</Title>
          </Body>
          <Right />
        </Header>
        <Content>
          {data != '' && (
            <Col>
              <Row>
                <Body>
                  <Text style={styles.order_id}>
                    Order Id - {data.order_id}
                  </Text>
                </Body>
              </Row>
              <Row style={{margin: 20}}>
                <Body>
                  <ProgressCircle
                    percent={data.status * 20.285}
                    radius={60}
                    borderWidth={3}
                    color={data.status === 7 ? 'red' : '#115e7a'}
                    shadowColor="#e6e6e6"
                    bgColor="#FFFFFF">
                    <View style={{height: 60, width: 60}}>
                      <Image
                        style={{flex: 1, width: undefined, height: undefined}}
                        source={washing_machine}
                        resizeMode="contain"
                      />
                    </View>
                  </ProgressCircle>
                  <Text
                    style={[
                      styles.status,
                      data.status === 7
                        ? {color: colors.danger}
                        : data.status === 5
                        ? {color: colors.green}
                        : null,
                    ]}>
                    {data.status_name}
                  </Text>
                </Body>
              </Row>
              <Row style={styles.row}>
                <Col style={{width: '90%'}}>
                  <Text style={styles.address_label}>Customer Name</Text>
                  <Text style={styles.address}>{data.cus_name}</Text>
                </Col>
                <Col>
                  <Icon
                    onPress={() => this.call_customer(data.cus_phone)}
                    style={styles.icon_page}
                    name="call"
                  />
                </Col>
              </Row>
              <Row style={styles.row}>
                <Col style={{width: '90%'}}>
                  <Text style={styles.address_label}>
                    Door number / Landmark
                  </Text>
                  <Text style={styles.address}>{data.cus_door_no}</Text>
                </Col>
                <Col>
                  <Icon
                    onPress={() =>
                      this.move_navigate(
                        data.cus_address_lat,
                        data.cus_address_lng,
                      )
                    }
                    style={styles.icon_page}
                    type="MaterialIcons"
                    name="location-on"
                  />
                </Col>
              </Row>
              <Row style={styles.row}>
                <Col style={{width: '90%'}}>
                  <Text style={styles.address_label}>Delivery Address</Text>
                  <Text style={styles.address}>{data.cus_address}</Text>
                </Col>
                <Col>
                  <Icon
                    onPress={() =>
                      this.move_navigate(
                        data.cus_address_lat,
                        data.cus_address_lng,
                      )
                    }
                    style={styles.icon_page}
                    type="MaterialIcons"
                    name="location-on"
                  />
                </Col>
              </Row>
              <Row style={styles.row}>
                <Left>
                  <Text style={styles.address_label}>
                    Expected Delivery Date
                  </Text>
                  <Text style={styles.address}>{data.ex_del_date}</Text>
                </Left>
                <Right>
                  <Text style={styles.address_label}>Payment Mode</Text>
                  <Text style={styles.address}>{data.payment_mode}</Text>
                </Right>
              </Row>
              <View style={{marginTop: 10}} />
              <Divider style={styles.order_divider} />
              <Row style={styles.row}>
                <Left>
                  <Text style={styles.your_cloths}>Your cloths</Text>
                </Left>
              </Row>
              <List>
                {data.items.map((row, index) => (
                  <ListItem>
                    <Row>
                      <Col style={{width: 40}}>
                        <Text style={styles.qty}>{row.qty}x</Text>
                      </Col>
                      <Col>
                        <Text>
                          {row.product_name}( {row.service_name} )
                        </Text>
                      </Col>
                      <Col style={{width: 50}}>
                        <Text style={{fontFamily: font_description}}>
                          Rs.
                          {row.service_charge * row.qty}
                        </Text>
                      </Col>
                    </Row>
                  </ListItem>
                ))}
              </List>
              <Row style={styles.row}>
                <Col>
                  <Text style={{fontFamily: font_description}}>Subtotal</Text>
                </Col>
                <Col style={{width: 50}}>
                  <Text style={{fontFamily: font_title}}>
                    Rs.
                    {data.sub_total}
                  </Text>
                </Col>
              </Row>
              <Row style={styles.row}>
                <Col>
                  <Text style={{fontFamily: font_description}}>Discount</Text>
                </Col>
                <Col style={{width: 50}}>
                  <Text style={{fontFamily: font_title}}>
                    Rs.
                    {data.discount}
                  </Text>
                </Col>
              </Row>
              <View style={{marginBottom: 20}} />
              <Divider style={styles.order_divider} />
              <Row style={styles.row}>
                <Col>
                  <Text style={styles.total_label}>Total</Text>
                </Col>
                <Col style={{width: 50}}>
                  <Text style={styles.total}>
                    Rs.
                    {data.total}
                  </Text>
                </Col>
              </Row>
              <View style={{marginBottom: 20}} />
            </Col>
          )}
        </Content>
        {data != '' && parseInt(data.status) === 2 && (
          <Footer style={styles.footer}>
            <View style={styles.footer_content}>
              {this.state.obj.length >= 1 && (
                <Btn
                  onPress={() => this.setState({visibililty: true})}
                  title="Upload Images"
                  buttonStyle={styles.footer_btn}
                  titleStyle={{
                    color: colors.theme_bg_three,
                    fontFamily: font_description,
                  }}
                />
              )}
            </View>
          </Footer>
        )}
        {data != '' && allowed_status.includes(parseInt(data.status)) && (
          <Footer style={styles.footer}>
            <View style={styles.footer_content}>
              <Btn
                onPress={this.update_status}
                title={data.new_status_name}
                buttonStyle={styles.footer_btn}
                titleStyle={{
                  color: colors.theme_bg_three,
                  fontFamily: font_description,
                }}
              />
            </View>
          </Footer>
        )}
        <Loader visible={isLoding} />
        <Modal visible={this.state.visibililty} animationType="slide">
          <Btn
            title="Close"
            buttonStyle={styles.footer_btn}
            onPress={() => this.setState({visibililty: false})}
          />
          <FlatList
            data={this.state.obj}
            keyExtractor={item => item.id.toString()}
            renderItem={({item, index}) => (
              <View style={styles.container}>
                <Text style={styles.uploads}>{item.service_type}</Text>
                <TouchableOpacity onPress={() => this.launchCamera(item.id)}>
                  {this.renderFileUri(index)}
                </TouchableOpacity>
              </View>
            )}
            ItemSeparatorComponent={() => (
              <View
                style={{
                  width: '90%',
                  marginVertical: 20,
                  marginLeft: 20,
                  height: 1,
                  backgroundColor: colors.theme_bg_two,
                }}
              />
            )}
          />
        </Modal>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.theme_bg_three,
  },
  icon: {
    color: colors.theme_fg_two,
  },
  container: {
    marginHorizontal: 25,
    paddingVertical: 10,
    width: '50%',
  },
  uploads: {
    color: colors.theme_bg,
    fontSize: 20,
    fontFamily: font_title,
  },
  images: {
    width: 150,
    height: 150,
    marginHorizontal: 3,
  },
  header_body: {
    flex: 3,
    justifyContent: 'center',
  },
  title: {
    alignSelf: 'center',
    color: colors.theme_fg_two,
    fontSize: 16,
    fontFamily: font_title,
  },
  order_id: {
    marginTop: 10,
    fontSize: 15,
    color: colors.theme_fg_two,
    fontFamily: font_title,
  },
  created_at: {
    marginTop: 5,
    fontSize: 12,
    fontFamily: font_description,
  },
  status: {
    marginTop: 10,
    fontSize: 20,
    color: colors.theme_bg,
    fontFamily: font_title,
  },
  order_divider: {
    backgroundColor: colors.theme_fg_two,
    width: '90%',
    alignSelf: 'center',
  },
  row: {
    marginLeft: 20,
    marginRight: 20,
    marginTop: 10,
  },
  address_label: {
    marginTop: 10,
    fontSize: 16,
    color: colors.theme_fg_three,
    fontFamily: font_title,
  },
  address: {
    marginTop: 5,
    fontSize: 13,
    fontFamily: font_description,
  },
  delivery_date_label: {
    marginTop: 10,
    fontSize: 13,
    fontFamily: font_title,
  },
  delivery_date: {
    marginTop: 5,
    fontSize: 13,
    fontFamily: font_description,
  },
  your_cloths: {
    marginTop: 10,
    fontSize: 18,
    color: colors.theme_bg,
    fontFamily: font_title,
  },
  qty: {
    fontSize: 15,
    color: colors.theme_fg,
    fontFamily: font_title,
  },
  total_label: {
    fontFamily: font_title,
    color: colors.theme_fg_two,
  },
  total: {
    fontFamily: font_title,
    color: colors.theme_fg_two,
  },
  icon_page: {
    color: colors.theme_bg,
    marginRight: 10,
    marginTop: 10,
  },
  footer: {
    backgroundColor: 'transparent',
  },
  footer_content: {
    width: '90%',
  },
  footer_btn: {
    backgroundColor: colors.theme_bg,
  },
});
