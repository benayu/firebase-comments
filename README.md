# firebase-comments
Host comments on static sites with Firebase and Firestore. Uses [XSS filters](https://github.com/YahooArchive/xss-filters).

1. Go to [Firebase](https://firebase.google.com/) and register an account.

2. Firebase should provide you with a configuration file like so:

```html
<script type="module">
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    databaseURL: "YOUR_DATABASE_URL",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MSG_ID",
    appId: "YOUR_APP_ID",
    measurementId: "YOUR_MEASUREMENT_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
</script>
```

3. Replace config in `script.js` with your own app config.

4. Modify **Rules** in Firebase console:

```
rules_version = '2';
service cloud.firestore {
    match /databases/{database}/documents {

        match /comments/{commentId} {
        allow read: if true;
            
        allow create: if 
            request.resource.data.username is string &&
            request.resource.data.text is string &&
            request.resource.data.postId is string &&
                
            request.resource.data.username.size() <= 50 &&
            request.resource.data.text.size() <= 1000 &&
                
            request.resource.data.keys().hasOnly(['username', 'text', 'postId', 'createdAt']) &&
                
            request.resource.data.createdAt == request.time;
        }        
    }
}
```


**Note: You need to create composite indexes in Firestore. Check console error for instructions.**