import {
  toJS, observable, action, computed, runInAction,
} from 'mobx';
import firebase, { db } from '../helpers/firebase';

export default class UserStore {
  constructor() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // User is signed in.;
        db.collection('users')
          .doc(user.uid)
          .onSnapshot((doc) => {
            if (doc.data().uid === firebase.auth().currentUser.uid) {
              runInAction(() => {
                this.authFinishedLoading = true;
                this.user = doc.data();
              });
            } else {
              this.authFinishedLoading = true;
            }
          });
      } else {
        this.authFinishedLoading = true;
        this.user = {};
      }
    });
  }

  @observable
  authFinishedLoading = false;

  @observable
  user = {};

  @observable
  error = '';

  @computed get isAuthenticated() {
    return this.user.uid !== undefined;
  }

  @action subscribe(service) {
    if (this.user.uid) {
      const doc = toJS(this.user);
      doc.subscriptions[service] = true;
      db.collection('users')
        .doc(this.user.uid)
        .set(doc);
    }
  }

  @action unsubscribe(service) {
    if (this.user.uid) {
      const doc = toJS(this.user);
      doc.subscriptions[service] = false;
      db.collection('users')
        .doc(this.user.uid)
        .set(doc);
    }
  }

  @action signup(email, password) {
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        const { user } = result;
        const userDoc = {
          uid: user.uid,
          email: user.email,
          subscriptions: {
            news: false,
            stocks: false,
            currency: false,
          },
        };
        return db
          .collection('users')
          .doc(user.uid)
          .set(userDoc);
      })
      .catch((error) => {
        // Handle Errors here.
        console.error(error);
        const errorMessage = error.message;
        this.error = errorMessage;
      });
  }

  @action login(email, password) {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .catch((error) => {
        // Handle Errors here.
        console.error(error);
        const errorMessage = error.message;
        this.error = errorMessage;
      });
  }

  @action logout() {
    firebase
      .auth()
      .signOut()
      .catch((error) => {
        console.error(error);
        const errorMessage = error.message;
        this.error = errorMessage;
      });
  }
}
