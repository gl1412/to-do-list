import { initializeApp } from 'firebase/app';
import { doc, getDocs, addDoc, updateDoc, getFirestore, collection } from
"firebase/firestore";
import log from "loglevel";

const firebaseConfig = {
  apiKey: "AIzaSyB329seVanZ48z35Ef71ipOrxsaqRtpbes",
  authDomain: "to-do-list-71a94.firebaseapp.com",
  projectId: "to-do-list-71a94",
  storageBucket: "to-do-list-71a94.firebasestorage.app",
  messagingSenderId: "61362830210",
  appId: "1:61362830210:web:e42496a5ab68d56a302d9b"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');


const sw = new URL('service-worker.js', import.meta.url)
if ('serviceWorker' in navigator) {
 const s = navigator.serviceWorker;
 s.register(sw.href, {
 scope: '/to-do-list/'
 })
 .then(_ => console.log('Service Worker Registered for scope:', sw.href,
'with', import.meta.url))
 .catch(err => console.error('Service Worker Error:', err));
}

//Fetch tasks from firestore when the app loads
async function renderTasks() {
 var tasks = await getTasksFromFirestore();
 taskList.innerHTML = "";

 tasks.forEach((task, index) => {
 if(!task.data().completed){
 const taskItem = document.createElement("li");
 taskItem.id = task.id;
 taskItem.textContent = task.data().text;
 taskList.appendChild(taskItem);
 }
 });
 }
async function getTasksFromFirestore() {
 var data = await getDocs(collection(db, "todos"));
 let userData = [];
 data.forEach((doc) => {
 userData.push(doc);
 });
 return userData;
}

//Input Validation
function sanitizeInput(input) {
 const div = document.createElement("div");
 div.textContent = input;
 return div.innerHTML;
}


// Add Task
addTaskBtn.addEventListener('click', async () => {
try {    
 const task = taskInput.value.trim();
 if (task) {
 const taskInput = document.getElementById("taskInput");
 const taskText = sanitizeInput(taskInput.value.trim()); // Could also use sanitizeInput(task) for optimization
 if (taskText) {
 await addTaskToFirestore(taskText);
 renderTasks();
 taskInput.value = "";
 }
 renderTasks();
 // Log user action
 log.info(`Task added: ${task}`);
 }
} catch (error) {
 // Log error
 log.error("Error adding task", error);
 }});

async function addTaskToFirestore(taskText) {
 await addDoc(collection(db, "todos"), {
 text: taskText,
 completed: false
 });
 }


// Remove Task on Click
taskList.addEventListener('click', (e) => {
    if (e.target.tagName === 'LI') {
        e.target.remove();
    }
});

// Set the log level (trace, debug, info, warn, error)
log.setLevel("info");
// Example logs
log.info("Application started");
log.debug("Debugging information");
log.error("An error occurred");