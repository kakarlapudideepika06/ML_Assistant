def detect_problem_type(df, target_column):
    if df[target_column].dtype == "object":
        return "classification"
    else:
        return "regression"


def recommend_algorithms(problem_type):
    if problem_type == "classification":
        return ["Logistic Regression", "Decision Tree", "Random Forest"]
    else:
        return ["Linear Regression", "Decision Tree Regressor"]
