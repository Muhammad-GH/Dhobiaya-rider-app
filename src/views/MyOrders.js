import React, {Component} from 'react';
import {StyleSheet, Text, FlatList} from 'react-native';
import {
  Container,
  Header,
  Content,
  List,
  Left,
  Body,
  Right,
  Title,
} from 'native-base';
import {
  height_30,
  no_data,
  font_title,
  font_description,
} from '../config/Constants';
import * as colors from '../assets/css/Colors';
import {fb} from '../config/firebaseConfig';
//import { serviceActionPending, serviceActionError, serviceActionSuccess } from '../actions/MyOrdersActions';
import AppList from '../components/AppList';

export default class MyOrders extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orders: [],
      received_status: 0,
      no_data: 0,
    };
  }

  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      let userRef = fb.ref('/delivery_partners/' + global.id + '/orders');
      let userQuery;
      if (
        this.props.route.params &&
        this.props.route.params.data !== undefined
      ) {
        if (this.props.route.params.data === 2) {
          userQuery = userRef.orderByChild('status').equalTo(5);
        } else {
          userQuery = userRef;
        }
        userQuery.on('value', snapshot => {
          var orders = [];
          if (snapshot.val() == null) {
            this.setState({no_data: 1, orders: []}, function() {});
          }
          snapshot.forEach(child => {
            orders.push(child.val());
          });
          this.setState({
            orders: orders.reverse(),
            received_status: 1,
            no_data: 0,
          });
        });
      } else {
        fb.ref('/delivery_partners/' + global.id + '/orders').on(
          'value',
          snapshot => {
            var orders = [];
            if (snapshot.val() == null) {
              this.setState({no_data: 1, orders: []}, function() {});
            }
            snapshot.forEach(child => {
              orders.push(child.val());
            });
            this.setState({
              orders: orders.reverse(),
              received_status: 1,
              no_data: 0,
            });
          },
        );
      }
    });
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  myorders_details = data => {
    this.props.navigation.navigate('OrderDetails', {data: data});
  };

  render() {
    return (
      <Container>
        <Header androidStatusBarColor={colors.theme_bg} style={styles.header}>
          <Left style={{flex: 1}} />
          <Body style={styles.header_body}>
            <Title style={styles.title}>My Orders</Title>
          </Body>
          <Right />
        </Header>
        <Content>
          <List>
            <FlatList
              data={this.state.orders}
              keyExtractor={orders => orders.id.toString()}
              renderItem={({item}) => (
                <AppList
                  {...item}
                  onPress={() => this.myorders_details(item.id)}
                />
              )}
            />
          </List>
          {this.state.no_data == 1 && (
            <Body style={{marginTop: height_30}}>
              <Text style={{fontFamily: font_description}}>{no_data}</Text>
            </Body>
          )}
        </Content>
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
});
