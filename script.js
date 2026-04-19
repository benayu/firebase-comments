document.addEventListener('DOMContentLoaded', function() {
    import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-app.js";
    import { 
        getFirestore, collection, addDoc, onSnapshot, query, where, orderBy, serverTimestamp 
    } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-firestore.js";

    const firebaseConfig = {
        apiKey: "YOUR_API_KEY",
        authDomain: "YOUR_AUTH_DOMAIN",
        databaseURL: "YOUR_DB_URL",
        projectId: "YOUR_PROJECT_ID",
        storageBucket: "YOUR_STORAGE_BUCKET",
        messagingSenderId: "YOUR_MSG_SENDER_ID",
        appId: "YOUR_APP_ID",
        measurementId: "YOUR_MEASUREMENT_ID"
    };

    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const commentsCol = collection(db, "comments")
    const commentForm = document.querySelector('#comment-form');
    const commentsContainer = document.querySelector('#comments-container');
    const postId = commentForm?.getAttribute('data-post-id');

    if (postId) {
        commentForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const honey = document.querySelector('#telephone').value;
        if (honey.length > 0) {
            console.warn("Bot detected.");
            commentForm.reset();
            return; 
        }
        const userField = document.querySelector('#username');
        const textField = document.querySelector('#comment-text');
        const btn = document.querySelector('#submit-btn');

        btn.disabled = true;

        try {
            await addDoc(commentsCol, {
            postId: postId,
            username: userField.value,
            text: textField.value,
            createdAt: serverTimestamp()
            });
            commentForm.reset();
        } catch (err) {
            console.error("Firebase Error:", err);
        } finally {
            btn.disabled = false;
        }
        });

        const q = query(
        commentsCol, 
        where("postId", "==", postId), 
        orderBy("createdAt", "desc")
        );

        onSnapshot(q, (snapshot) => {
        commentsContainer.innerHTML = '';
        
        if (snapshot.empty) {
            commentsContainer.innerHTML = '<p>No comments yet.</p>';
            return;
        }

        snapshot.forEach((doc) => {
            const data = doc.data();
            
            const safeName = xssFilters.inHTMLData(data.username);
            const safeText = xssFilters.inHTMLData(data.text);
            const date = data.createdAt?.toDate().toLocaleString("en-GB", {hour12: true}) || "Pending...";

            const div = document.createElement('div');
            
            div.innerHTML = `
            <strong>${safeName}</strong> 
            <small>${date}</small>
            <p>${safeText}</p>
            `;

            commentsContainer.appendChild(div);
        });
        }, (error) => {
        console.error("Firestore error:", error);
        });
    }

}, false);
