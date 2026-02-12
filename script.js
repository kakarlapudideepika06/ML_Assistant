// ---------- PAGE LOAD SESSION CHECK ----------
document.addEventListener("DOMContentLoaded", function () {

    // Check dashboard session
    if (window.location.pathname.includes("app.html")) {
        const user = localStorage.getItem("currentUser");

        if (!user) {
            window.location.href = "login.html";
        } else {
            const welcome = document.getElementById("welcomeText");
            if (welcome) {
                welcome.innerText = "Hello, " + user + "!";
            }
        }
    }

});


// ---------- FIXED USERS DATABASE ----------
const users = {
    "sharanya": "123",
    "deepika": "123",
    "rishita": "123"
};


// ---------- LOGIN FUNCTION ----------
function login() {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const msg = document.getElementById("message");

    if (users[username] && users[username] === password) {
        localStorage.setItem("currentUser", username);
        window.location.href = "app.html";
    } else {
        msg.innerText = "Invalid username or password";
    }
}


// ---------- LOGOUT FUNCTION ----------
function logout() {
    localStorage.removeItem("currentUser");
    window.location.href = "login.html";
}


// ---------- MODULE NAVIGATION ----------
function openModule(module) {
    if (module === "Dataset Analysis") {
        window.location.href = "dataset_analysis.html";
    } 
    else if (module === "Algorithm Recommendation") {
        window.location.href = "algorithm_recommendation.html";
    }
    else if (module === "Chatbot Assistant") {
        window.location.href = "chatbot.html";
    }
    else if (module === "Accuracy Analysis") {
    window.location.href = "accuracy_analysis.html";
}

}


async function showAccuracy() {
    const fileInput = document.getElementById("datasetFile");
    const target = document.getElementById("targetColumn").value;
    const output = document.getElementById("graphOutput");

    if (!fileInput.files.length) {
        alert("Upload dataset first");
        return;
    }

    if (!target) {
        alert("Enter target column");
        return;
    }

    // upload dataset
    const formData = new FormData();
    formData.append("file", fileInput.files[0]);

    const uploadResponse = await fetch("http://127.0.0.1:5000/upload", {
        method: "POST",
        body: formData
    });

    const uploadData = await uploadResponse.json();
    const filename = uploadData.filename;

    // train models
    const response = await fetch("http://127.0.0.1:5000/train", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            filename: filename,
            target: target
        })
    });

    const data = await response.json();

    output.innerHTML = `
        <h3>Accuracy Comparison</h3>
        <img src="http://127.0.0.1:5000/static/accuracy_plot.png?t=${new Date().getTime()}" width="500">
    `;
}



// ---------- BACK BUTTON ----------
function goBack() {
    window.location.href = "app.html";
}
async function uploadDataset() {
    const fileInput = document.getElementById("datasetFile");
    const output = document.getElementById("analysisOutput");

    if (!fileInput.files.length) {
        alert("Select a dataset first");
        return;
    }

    const formData = new FormData();
    formData.append("file", fileInput.files[0]);

    const response = await fetch("http://127.0.0.1:5000/upload", {
        method: "POST",
        body: formData
    });

    const data = await response.json();
    const analysis = data.analysis;

    output.innerHTML = `
        <h3>Dataset Summary</h3>
        <p><b>Rows:</b> ${analysis.shape[0]}</p>
        <p><b>Columns:</b> ${analysis.shape[1]}</p>

        <p><b>Numeric Columns:</b><br>
        ${analysis.numeric_columns.join(", ")}</p>

        <p><b>Categorical Columns:</b><br>
        ${analysis.categorical_columns.join(", ") || "None"}</p>
    `;
}

async function analyzeDataset() {
    const output = document.getElementById("analysisOutput");

    if (!uploadedFilename) {
        alert("Upload dataset first!");
        return;
    }

    const response = await fetch("http://127.0.0.1:5000/upload_analysis?filename=" + uploadedFilename);
    const data = await response.json();

    const analysis = data.analysis;

    output.innerHTML = `
        <h3>Dataset Summary</h3>
        <p><b>Rows:</b> ${analysis.shape[0]}</p>
        <p><b>Columns:</b> ${analysis.shape[1]}</p>

        <h4>Numeric Columns</h4>
        <p>${analysis.numeric_columns.join(", ")}</p>

        <h4>Categorical Columns</h4>
        <p>${analysis.categorical_columns.join(", ") || "None"}</p>
    `;
}
async function trainModels() {
    const fileInput = document.getElementById("datasetFile");
    const target = document.getElementById("targetColumn").value;
    const output = document.getElementById("resultOutput");

    if (!fileInput.files.length) {
        alert("Upload dataset first");
        return;
    }

    if (!target) {
        alert("Enter target column");
        return;
    }

    // upload dataset first
    const formData = new FormData();
    formData.append("file", fileInput.files[0]);

    const uploadResponse = await fetch("http://127.0.0.1:5000/upload", {
        method: "POST",
        body: formData
    });

    const uploadData = await uploadResponse.json();
    const filename = uploadData.filename;

    // call training endpoint
    const response = await fetch("http://127.0.0.1:5000/train", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            filename: filename,
            target: target
        })
    });

    const data = await response.json();

    output.innerHTML = `
        <h3>Problem Type: ${data.problem_type}</h3>
        <h4>Best Model: ${data.best_model}</h4>
        <p>${data.dataset_explanation}</p>
    `;
}
function signup() {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const msg = document.getElementById("message");

    if (!username || !password) {
        msg.innerText = "Enter username and password";
        return;
    }

    if (users[username]) {
        msg.innerText = "User already exists";
        return;
    }

    users[username] = password;
    msg.innerText = "Account created successfully!";
}



