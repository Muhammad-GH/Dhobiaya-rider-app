import Firebase from 'firebase';

var config = {
  apiKey: 'AIzaSyDW0ZmkrfOv-hOgvE5ag9v7h_MfJDWyNuk',
  authDomain: 'laundry-18a5d.firebaseapp.com',
  databaseURL: 'https://laundry-18a5d.firebaseio.com',
  projectId: 'laundry-18a5d',
  storageBucket: 'laundry-18a5d.appspot.com',
  messagingSenderId: '952207352325',
  appId: '1:952207352325:web:6654e195b7612e4d9d326c',
  measurementId: 'G-2KG95NCEKG',
};

let app = Firebase.initializeApp(config);
export const fb = app.database();
