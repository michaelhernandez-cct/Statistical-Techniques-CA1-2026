"""Anonymise the raw Google Forms export and save it as Data_CA1.csv.

Run from the repo root:  python data/prepare_data.py
The raw export (with timestamps) stays out of git, only Data_CA1.csv is committed.
"""
from pathlib import Path

import pandas as pd

RAW = Path("docs/Lifestyle Habits Survey (Responses) - Form Responses 1.csv")
OUT = Path("data/Data_CA1.csv")

# CSV names from docs/survey-design.md, in the same order as the form questions
COLUMNS = [
    "age", "gender", "occupation",
    "active_days", "active_min_per_day", "sitting_hours", "sleep_hours",
    "sugary_drinks_week", "uses_tracker",
    "height_cm", "weight_band", "waist_increased",
    "heard_of_ir", "last_blood_test",
    "self_rated_health", "diabetes_concern", "would_use_tool",
]

df = pd.read_csv(RAW)

# drop Timestamp and the consent column (first two columns of the export)
df = df.iloc[:, 2:]
df.columns = COLUMNS

# Yes/No -> True/False
for col in ["uses_tracker", "heard_of_ir"]:
    df[col] = df[col].map({"Yes": True, "No": False})

# "Prefer not to say" -> missing. "Not sure" is kept as its own category
df = df.replace("Prefer not to say", pd.NA)

df.to_csv(OUT, index=False)
print(f"Saved {OUT}: {df.shape[0]} rows, {df.shape[1]} columns")
