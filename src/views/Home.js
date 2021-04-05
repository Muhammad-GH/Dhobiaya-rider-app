import React, {Component} from 'react';
import {View, StyleSheet, Text, TouchableWithoutFeedback} from 'react-native';
import {Card, CardItem} from 'native-base';
import {StatusBar, Loader} from '../components/GeneralComponents';
import {
  api_url,
  height_30,
  height_50,
  dashboard,
  font_title,
  font_description,
} from '../config/Constants';
import * as colors from '../assets/css/Colors';
import axios from 'axios';
import LottieView from 'lottie-react-native';

class Home extends Component<Props> {
  constructor(props) {
    super(props),
      (this.state = {
        total_bookings: 0,
        today_bookings: 0,
        completed_bookings: 0,
        pending_bookings: 0,
        isLoding: false,
      });
  }

  async componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.dashboard();
    });
  }
  componentWillUnmount() {
    this._unsubscribe();
  }

  dashboard = async () => {
    this.setState({isLoding: true});
    await axios({
      method: 'post',
      url: api_url + dashboard,
      data: {id: global.id},
    })
      .then(async response => {
        if (response.data.status == 1) {
          this.setState({
            total_bookings: response.data.result.total_bookings,
            today_bookings: response.data.result.today_bookings,
            completed_bookings: response.data.result.completed_bookings,
            pending_bookings: response.data.result.pending_bookings,
            isLoding: false,
          });
        }
      })
      .catch(error => {
        this.setState({isLoding: false});
      });
  };

  myorders = data => {
    this.props.navigation.navigate('MyOrders', {data: data});
  };

  render() {
    return (
      <View style={styles.container}>
        <View>
          <StatusBar />
        </View>
        <Loader visible={this.state.isLoding} />
        <View style={styles.block_one}>
          <LottieView
            style={{left: -15}}
            source={require('../assets/img/bike.json')}
            autoPlay
            loop
          />
        </View>
        <View style={styles.heading}>
          <Text style={styles.headingText}>Dashboard</Text>
        </View>
        <View style={styles.block_two}>
          <View style={{flexDirection: 'row'}}>
            <TouchableWithoutFeedback onPress={() => this.myorders()}>
              <View
                style={{
                  width: '40%',
                  marginLeft: 8,
                  marginHorizontal: 10,
                  marginVertical: 20,
                }}>
                <Card>
                  <CardItem>
                    <View style={styles.card}>
                      <Text style={styles.card_count}>
                        {this.state.total_bookings}
                      </Text>
                      <Text style={[styles.card_title, {marginLeft: 15}]}>
                        Total Bookings
                      </Text>
                    </View>
                  </CardItem>
                </Card>
              </View>
            </TouchableWithoutFeedback>
            {/* 1 -> today, 2 -> completed, 3 -> pending*/}
            <TouchableWithoutFeedback onPress={() => this.myorders(1)}>
              <View style={{width: '40%', marginVertical: 20}}>
                <Card>
                  <CardItem>
                    <View style={styles.card}>
                      <Text style={styles.card_count}>
                        {this.state.today_bookings}
                      </Text>
                      <Text style={[styles.card_title, {marginLeft: 15}]}>
                        Bookings Today
                      </Text>
                    </View>
                  </CardItem>
                </Card>
              </View>
            </TouchableWithoutFeedback>
          </View>
          <View style={{flexDirection: 'row'}}>
            <TouchableWithoutFeedback onPress={() => this.myorders(2)}>
              <View style={{width: '40%', marginLeft: 8, marginHorizontal: 10}}>
                <Card>
                  <CardItem>
                    <View style={styles.card}>
                      <Text style={styles.card_count}>
                        {this.state.completed_bookings}
                      </Text>
                      <Text style={styles.card_title}>Bookings Completed</Text>
                    </View>
                  </CardItem>
                </Card>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => this.myorders(3)}>
              <View style={{width: '40%'}}>
                <Card>
                  <CardItem>
                    <View style={styles.card}>
                      <Text style={styles.card_count}>
                        {this.state.pending_bookings}
                      </Text>
                      <Text style={styles.card_title}>Bookings Pending</Text>
                    </View>
                  </CardItem>
                </Card>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </View>
    );
  }
}

export default Home;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.theme_bg_two,
  },
  block_one: {
    width: '100%',
    height: height_30,
    backgroundColor: colors.theme_bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    width: '100%',
    height: '15%',
    backgroundColor: colors.theme_bg_three,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headingText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: colors.theme_fg_three,
  },
  block_two: {
    width: '100%',
    height: height_50,
    backgroundColor: colors.theme_bg_three,
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10,
  },
  card: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card_title: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.theme_fg_two,
    fontFamily: font_description,
    marginVertical: 15,
  },
  card_count: {
    fontSize: 40,
    fontFamily: font_title,
    color: colors.theme_bg,
  },
});
