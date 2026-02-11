from flask import Flask, request, jsonify
import os
from flask_cors import CORS
from ml_modules.dataset_analysis import load_dataset, analyze_dataset
from ml_modules.algorithm_recommendation import detect_problem_type
from ml_modules.training_pipeline import prepare_data, train_models
from ml_modules.visualization import plot_accuracy

app = Flask(__name__)
CORS(app)


UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@app.route("/")
def home():
    return "Backend is running"


# ---------------- DATASET UPLOAD ----------------
@app.route("/upload", methods=["POST"])
def upload_dataset():
    if "file" not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files["file"]

    if file.filename == "":
        return jsonify({"error": "Empty filename"}), 400

    filepath = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(filepath)

    df = load_dataset(filepath)
    analysis = analyze_dataset(df)

    return jsonify({
        "message": "Dataset uploaded successfully",
        "filename": file.filename,
        "analysis": analysis
    })


# ---------------- MODEL TRAINING ----------------
@app.route("/train", methods=["POST"])
def train():
    data = request.get_json()

    filename = data.get("filename")
    target = data.get("target")

    if not filename or not target:
        return jsonify({"error": "filename and target required"}), 400

    filepath = os.path.join(UPLOAD_FOLDER, filename)

    df = load_dataset(filepath)

    # Detect problem type
    problem_type = detect_problem_type(df, target)

    # Simple explanation
    explanation = ""
    if problem_type == "classification":
        explanation = f"The target column '{target}' contains categories, so this is a classification problem."
    else:
        explanation = f"The target column '{target}' contains numeric values, so this is a regression problem."

    # Prepare and train
    X_train, X_test, y_train, y_test = prepare_data(df, target)
    results = train_models(problem_type, X_train, X_test, y_train, y_test)

    plot_accuracy(results)

    best_model = max(results, key=results.get)

    return jsonify({
        "problem_type": problem_type,
        "dataset_explanation": explanation,
        "results": results,
        "best_model": best_model,
        "graph": "static/accuracy_plot.png"
    })
@app.route("/upload_analysis", methods=["GET"])
def upload_analysis():
    filename = request.args.get("filename")
    filepath = os.path.join(UPLOAD_FOLDER, filename)

    df = load_dataset(filepath)
    analysis = analyze_dataset(df)

    return jsonify({"analysis": analysis})


if __name__ == "__main__":
    app.run(debug=True)
