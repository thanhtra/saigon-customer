import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"

const firebaseConfig = {
    apiKey: "AIzaSyAPXv-VlJPAb2fTB7nKQAc-gOYIyboju70",
    authDomain: "dstn-27cc3.firebaseapp.com",
    projectId: "dstn-27cc3",
    storageBucket: "dstn-27cc3.appspot.com",
    messagingSenderId: "285558097224",
    appId: "1:285558097224:web:25cc0f2f036533eb9c1f7d",
    measurementId: "G-EW6KNWJ29T"
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)