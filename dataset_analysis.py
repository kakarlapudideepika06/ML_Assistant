import pandas as pd

def load_dataset(filepath):
    df = pd.read_csv(filepath)
    return df

def analyze_dataset(df):
    analysis = {
        "shape": df.shape,
        "missing_values": df.isnull().sum().to_dict(),
        "dtypes": df.dtypes.astype(str).to_dict(),
        "numeric_columns": df.select_dtypes(include="number").columns.tolist(),
        "categorical_columns": df.select_dtypes(include="object").columns.tolist()
    }
    return analysis
