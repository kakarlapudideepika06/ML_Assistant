import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, mean_squared_error
from sklearn.linear_model import LogisticRegression, LinearRegression
from sklearn.tree import DecisionTreeClassifier, DecisionTreeRegressor
from sklearn.ensemble import RandomForestClassifier

def prepare_data(df, target_column):
    X = df.drop(columns=[target_column])
    y = df[target_column]

    X = pd.get_dummies(X)

    return train_test_split(X, y, test_size=0.2, random_state=42)


def train_models(problem_type, X_train, X_test, y_train, y_test):
    results = {}

    if problem_type == "classification":
        models = {
            "Logistic Regression": LogisticRegression(max_iter=1000),
            "Decision Tree": DecisionTreeClassifier(),
            "Random Forest": RandomForestClassifier()
        }

        for name, model in models.items():
            model.fit(X_train, y_train)
            preds = model.predict(X_test)
            results[name] = accuracy_score(y_test, preds)

    else:
        models = {
            "Linear Regression": LinearRegression(),
            "Decision Tree Regressor": DecisionTreeRegressor()
        }

        for name, model in models.items():
            model.fit(X_train, y_train)
            preds = model.predict(X_test)
            results[name] = mean_squared_error(y_test, preds)

    return results
