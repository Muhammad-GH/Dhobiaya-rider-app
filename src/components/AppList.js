import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import {ListItem, Col} from 'native-base';
import ProgressCircle from 'react-native-progress-circle';

import {washing_machine} from '../config/Constants';
import * as colors from '../assets/css/Colors';
import {font_title, font_description} from '../config/Constants';

const AppList = ({
  status_name,
  status,
  order_id,
  ex_del_date,
  total,
  onPress,
}) => {
  return (
    <ListItem onPress={onPress}>
      <Col style={{width: '25%'}}>
        <ProgressCircle
          percent={status * 20.285}
          radius={30}
          borderWidth={3}
          color={status === 7 ? 'red' : '#115e7a'}
          shadowColor="#e6e6e6"
          bgColor="#FFFFFF">
          <View style={{height: 40, width: 40}}>
            <Image
              style={{flex: 1, width: undefined, height: undefined}}
              source={washing_machine}
              resizeMode="contain"
            />
          </View>
        </ProgressCircle>
      </Col>
      <Col style={{width: '60%'}}>
        <Text
          style={[
            styles.status,
            status === 7
              ? {color: colors.danger}
              : status === 5
              ? {color: colors.green}
              : null,
          ]}>
          {status_name}
        </Text>
        <Text style={styles.order_id}>Order Id :{order_id}</Text>
        <View style={{margin: 3}} />
        <Text style={styles.delivery_date_title}>Expected Delivery Date</Text>
        <Text style={styles.delivery_date}>{ex_del_date}</Text>
      </Col>
      <Col>
        <Text style={styles.total}>Rs.{total}</Text>
      </Col>
    </ListItem>
  );
};

const styles = StyleSheet.create({
  order_id: {
    fontSize: 13,
    color: colors.theme_fg_two,
    fontFamily: font_description,
  },
  delivery_date_title: {
    fontSize: 13,
    fontFamily: font_title,
    color: colors.theme_fg_two,
  },
  delivery_date: {
    fontSize: 13,
    color: colors.theme_fg_two,
    fontFamily: font_description,
  },
  status: {
    fontSize: 19,
    fontFamily: font_title,
    color: colors.theme_bg,
  },
  total: {
    fontSize: 15,
    fontFamily: font_title,
    color: colors.theme_fg_two,
  },
});

export default AppList;
