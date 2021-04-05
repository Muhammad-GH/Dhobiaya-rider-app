import {Dimensions} from 'react-native';

// export const base_url = "http://rithlaundry.com/";
// export const api_url = "http://rithlaundry.com/api/";
export const base_url = 'http://app.staging-gridshub.site/';
export const api_url = 'http://app.staging-gridshub.site/api/';
export const settings = 'app_setting';
export const img_url = 'http://app.staging-gridshub.site/public/uploads/';
export const service = 'service';
export const login = 'delivery_partner/login';
export const profile = 'delivery_partner';
export const profile_picture = 'delivery_partner/profile_picture';
export const forgot = 'delivery_partner/forgot_password';
export const reset = 'delivery_partner/reset_password';
export const my_orders = 'get_orders';
export const order_status_change = 'order_status_change';
export const dashboard = 'dashboard';
export const capture = 'capture';
export const sticksID = 'sticksID';
export const no_data = 'Sorry no data found...';
//Size
export const screenHeight = Math.round(Dimensions.get('window').height);
export const height_40 = Math.round((40 / 100) * screenHeight);
export const height_50 = Math.round((50 / 100) * screenHeight);
export const height_60 = Math.round((60 / 100) * screenHeight);
export const height_35 = Math.round((35 / 100) * screenHeight);
export const height_20 = Math.round((20 / 100) * screenHeight);
export const height_25 = Math.round((25 / 100) * screenHeight);
export const height_30 = Math.round((30 / 100) * screenHeight);

//Path
export const logo = require('.././assets/img/logo_with_name.png');
export const forgot_password = require('.././assets/img/forgot_password.png');
export const reset_password = require('.././assets/img/reset_password.png');
export const loading = require('.././assets/img/loading.png');
export const login_image = require('.././assets/img/logo_with_name.png');
export const washing_machine = require('.././assets/img/washing-machine.png');
export const notification_image = require('.././assets/json/bell.json');
export const delivery = require('.././assets/json/delivery.json');

//Font Family
export const font_title = 'Proxima Nova';
export const font_description = 'Proxima Nova Semibold';

//Map
// export const GOOGLE_KEY = "ENTER_YOUR_MAP_KEY";
// export const LATITUDE_DELTA = 0.0150;
// export const LONGITUDE_DELTA =0.0152;
// //More Menu
// export const menus = [
//   {
//     menu_name: 'Manage Addresses',
//     icon: 'pin',
//     route:'AddressList'
//   },
//   {
//     menu_name: 'Faq',
//     icon: 'help',
//     route:'Faq'
//   },
//   {
//     menu_name: 'Privacy Policy',
//     icon: 'alert',
//     route:'PrivacyPolicy'
//   },
//   {
//     menu_name: 'Logout',
//     icon: 'log-out',
//     route:'Logout'
//   },
// ]

//Image upload options
const options = {
  title: 'Select a photo',
  takePhotoButtonTitle: 'Take a photo',
  chooseFromLibraryButtonTitle: 'Choose from gallery',
};
