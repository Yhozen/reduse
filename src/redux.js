import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore' // <- needed if using firestore
import { createStore, combineReducers } from 'redux'
import { firebaseReducer } from 'react-redux-firebase'
import { createFirestoreInstance, firestoreReducer } from 'redux-firestore' // <- needed if using firestore

const firebaseConfig = {
  apiKey: 'AIzaSyCVECOJby11DV-1JZS8z7lIzmUqJgQz_Mk',
  authDomain: 'reduse-demo.firebaseapp.com',
  databaseURL: 'https://reduse-demo.firebaseio.com',
  projectId: 'reduse-demo',
  storageBucket: 'reduse-demo.appspot.com',
  messagingSenderId: '489647742796',
  appId: '1:489647742796:web:e7f804d0500d30be6bb9e9',
  measurementId: 'G-5F8Y162510'
}
// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig)
firebase.firestore()
// Initialize other services on firebase instance
// firebase.firestore() // <- needed if using firestore
// firebase.functions() // <- needed if using httpsCallable

// Add firebase to reducers
const rootReducer = combineReducers({
  firebase: firebaseReducer,
  firestore: firestoreReducer // <- needed if using firestore
})

// Create store with reducers and initial state
const initialState = {}
const store = createStore(rootReducer, initialState)

const rrfConfig = {
  userProfile: 'users'
}

const rrfProps = {
  firebase: app,
  config: rrfConfig,
  dispatch: store.dispatch,
  createFirestoreInstance
}

export { rrfProps }
export default store
