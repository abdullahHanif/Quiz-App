import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js';
import { getDatabase, ref, set, get, child} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut ,onAuthStateChanged} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js"; 


// Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyA5uW7_-ZSqKvqWT_gTtZxrB4TecTBq2sg",
  authDomain: "friendlychat-136d7.firebaseapp.com",
  databaseURL: "https://friendlychat-136d7.firebaseio.com",
  projectId: "friendlychat-136d7",
  storageBucket: "friendlychat-136d7.appspot.com",
  messagingSenderId: "14153220093",
  appId: "1:14153220093:web:38aac7e08cabf80b306394"
};


// Initialize Firebase
var app = initializeApp(firebaseConfig);
var auth = getAuth();
var db = getDatabase(app);

// Toggle Auth Forms
function toggleAuthForm() {
  document.getElementById("login-form").style.display = document.getElementById("login-form").style.display === "none" ? "block" : "none";
  document.getElementById("signup-form").style.display = document.getElementById("signup-form").style.display === "none" ? "block" : "none";
}

// Sign Up
document.getElementById("signup-btn").addEventListener("click", () => {
  var email = document.getElementById("signup-email").value;
  var password = document.getElementById("signup-password").value;

  createUserWithEmailAndPassword(auth, email, password)
      .then(() => alert("Signup successful"))
      .catch(error => alert(error.message));
});

// Login
document.getElementById("login-btn").addEventListener("click", () => {
  var email = document.getElementById("login-email").value;
  var password = document.getElementById("login-password").value;

  signInWithEmailAndPassword(auth, email, password)
      .then(() => {
          loadQuiz(db); // Load quiz after login
          document.getElementById("auth-section").style.display = "none";
          document.getElementById("quiz-section").style.display = "block";
      })
      .catch(error => alert(error.message));
});

// Logout
document.getElementById("logout-btn").addEventListener("click", () => {
  signOut(auth).then(() => {
      document.getElementById("quiz-section").style.display = "none";
      document.getElementById("auth-section").style.display = "block";
  });
});

// Check Auth State on Load
onAuthStateChanged(auth, user => {
  if (user) {
      //loadQuiz(db);
      document.getElementById("auth-section").style.display = "none";
      document.getElementById("quiz-section").style.display = "block";
  }
});

// Submit Quiz
document.getElementById("submit-quiz-btn").addEventListener("click", () => submitQuiz(db));

function loadQuiz(db) {
  var questionsContainer = document.getElementById("questions-container");
  questionsContainer.innerHTML = ""; // Clear previous questions

  var dbRef = ref(db);
  get(child(dbRef, "quiz-questions")).then(snapshot => {
      if (snapshot.exists()) {
          snapshot.forEach(childSnapshot => {
              var questionData = childSnapshot.val();
              var questionEl = document.createElement("div");
              questionEl.classList.add("question");
              questionEl.innerHTML = `
                  <p>${questionData.question}</p>
                  ${questionData.options.map((option, index) => `
                      <div>
                          <input type="radio" name="${childSnapshot.key}" value="${index}">
                          <label>${option}</label>
                      </div>
                  `).join("")}
              `;
              questionsContainer.appendChild(questionEl);
          });
      } else {
          alert("No quiz questions found.");
      }
  });
}

 function submitQuiz(db) {
  var score = 0;
  var dbRef = ref(db);
  get(child(dbRef, "quiz-questions")).then(snapshot => {
      snapshot.forEach(childSnapshot => {
          var questionData = childSnapshot.val();
          var selectedOption = document.querySelector(`input[name="${childSnapshot.key}"]:checked`);
          if (selectedOption && parseInt(selectedOption.value) === questionData.answerIndex) {
              score += 1;
          }
      });
      alert(`Your score is ${score}`);
  });
}