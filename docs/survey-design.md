# Survey Design — Lifestyle Habits and Metabolic Health Awareness

**Form title:** Lifestyle Habits and Metabolic Health Awareness
**Estimated time:** 3–4 minutes · 17 questions · target 50 responses (30+ usable)
**Tool:** Google Forms

---

## 1. Form Description (Data Protection Notice)

Paste into the form description at the top:

> This anonymous survey is part of an academic assignment for the Higher Diploma in Data Analytics at CCT College Dublin. It asks about everyday lifestyle habits (activity, sitting, sleep, diet) and awareness of metabolic health.
>
> - The data is collected **for academic purposes only** and will not be used commercially or shared with third parties.
> - **No names, email addresses or other identifying details are collected.** All responses are anonymised before analysis.
> - Participation is **voluntary**. Questions marked optional can be skipped, and you can stop at any time before submitting.
> - You must be **18 or older** to take part.
> - This survey does not provide medical advice or diagnosis.
>
> **By submitting this survey, you confirm you have read this notice and agree to your anonymous answers being used for this academic project.**

**Consent question** (required, first question, not analysed):
*"I have read the notice above and agree to take part."* → Checkbox: `I agree`

---

## 2. Questions

### Section A — About You

| # | Question | Google Forms type | Options / validation | CSV column | Data type |
|---|---|---|---|---|---|
| 1 | What is your age? | Short answer | Number, whole, 18–99 | `age` | Integer |
| 2 | What is your gender? | Multiple choice | Female · Male · Non-binary · Prefer not to say | `gender` | Categorical |
| 3 | Which best describes your current situation? | Multiple choice | Working full-time · Working part-time · Studying only · Studying and working · Other | `occupation` | Categorical |

### Section B — Activity and Lifestyle

*Helper text for Q4–5: "Moderate activity makes you breathe harder than normal, e.g. brisk walking, cycling, swimming, gym, sports."*

| # | Question | Google Forms type | Options / validation | CSV column | Data type |
|---|---|---|---|---|---|
| 4 | In a typical week, on how many days do you do at least 10 minutes of moderate or vigorous activity? | Linear scale | 0–7 | `active_days` | Integer |
| 5 | On those days, roughly how many minutes are you active in total? (Enter 0 if none) | Short answer | Number, whole, 0–600 | `active_min_per_day` | Integer |
| 6 | On a typical weekday, how many hours do you spend sitting (work, study, commuting, screens)? | Short answer | Number, 0–24, decimals allowed | `sitting_hours` | Continuous |
| 7 | On average, how many hours do you sleep per night? | Short answer | Number, 2–14, decimals allowed | `sleep_hours` | Continuous |
| 8 | How many sugary drinks (soft drinks, energy drinks, sweetened coffees) do you have per week? | Short answer | Number, whole, 0–100 | `sugary_drinks_week` | Integer |
| 9 | How many takeaway or fast-food meals do you eat per week? | Short answer | Number, whole, 0–30 | `takeaways_week` | Integer |
| 10 | Do you use a fitness tracker or smartwatch to monitor activity? | Multiple choice | Yes · No | `uses_tracker` | Boolean |

### Section C — Body Measurements (Optional)

*Section description: "These questions are optional. Skip them or choose 'Prefer not to say' if you prefer."*

| # | Question | Google Forms type | Options / validation | CSV column | Data type |
|---|---|---|---|---|---|
| 11 | What is your height in centimetres? (optional) | Short answer | Number, 120–220, not required | `height_cm` | Continuous |
| 12 | Which range best describes your weight? (optional) | Multiple choice | Under 50 kg · 50–59 · 60–69 · 70–79 · 80–89 · 90–99 · 100–109 · 110 kg or more · Prefer not to say | `weight_band` | Categorical (ordinal) |

### Section D — Health Awareness

| # | Question | Google Forms type | Options / validation | CSV column | Data type |
|---|---|---|---|---|---|
| 13 | Before today, had you heard of "insulin resistance"? | Multiple choice | Yes · No | `heard_of_ir` | Boolean |
| 14 | When did you last have a routine blood test? | Multiple choice | Within the last year · 1–2 years ago · More than 2 years ago · Never · Not sure | `last_blood_test` | Categorical |
| 15 | How would you rate your overall health? | Linear scale | 1 (Very poor) – 5 (Excellent) | `self_rated_health` | Likert |
| 16 | How concerned are you about developing type 2 diabetes in the future? | Linear scale | 1 (Not at all) – 5 (Very concerned) | `diabetes_concern` | Likert |
| 17 | How likely would you be to use a free online tool that estimates your metabolic health risk from lifestyle questions? | Linear scale | 1 (Very unlikely) – 5 (Very likely) | `would_use_tool` | Likert |

**Data types covered:** Integer (6) · Continuous (3) · Categorical (5) · Likert (3) · Boolean (2). This meets the brief's minimum of 10 questions and 3 data types.

---

## 3. Derived Columns (created in the notebook)

| Column | Formula | Purpose |
|---|---|---|
| `weekly_activity_min` | `active_days × active_min_per_day` | **Target variable** |
| `meets_who` | `weekly_activity_min ≥ 150` (WHO adult guideline) | Binary target for Bayes and chi-square |
| `bmi_approx` | weight band midpoint ÷ (height_m²) | Optional, only where both are given |
| `age_band` | 18–24 · 25–34 · 35–44 · 45–54 · 55+ | Grouping for plots and chi-square |

---

## 4. Mapping to Marked Sections

| Section | Planned analysis | Columns used |
|---|---|---|
| **1. Descriptive (30)** | Mean, median, mode, SD, IQR, skewness, kurtosis; Shapiro-Wilk normality test | All numeric columns |
| **2. Visualisations (30)** | ① Histogram of weekly activity ② Histogram of sleep with normal curve ③ Q-Q plot of sleep ④ Box plot of sitting hours by occupation ⑤ Box plot of activity by tracker use ⑥ Bar chart of Likert responses ⑦ Scatter plot of sitting vs activity ⑧ Correlation heatmap ⑨ Count plot of awareness by blood-test recency | Mixed |
| **3. Outliers (10)** | IQR and z-score detection on activity and sitting; compare mean, SD and skew with vs without outliers; 95% confidence intervals for mean sleep and activity; bootstrap resampling | `weekly_activity_min`, `sitting_hours`, `sleep_hours` |
| **4. Inferential (15)** | **Bayes:** prior P(meets WHO) → posterior P(meets WHO \| uses tracker). **Normal distribution:** z-score sleep, P(sleep < 7 h) with `scipy.stats.norm.cdf`, compare P(sleep < 7 \| sitting > 8 h) with the empirical proportion | `meets_who`, `uses_tracker`, `sleep_hours`, `sitting_hours` |
| **5. Correlation / Chi-square (15)** | Pearson and Spearman correlation of numeric features vs `weekly_activity_min`; chi-square: `meets_who` × `occupation`, `meets_who` × `uses_tracker`, `heard_of_ir` × `last_blood_test` | Features vs target |

---

## 5. Google Forms Settings

- **Settings → Responses:** Collect email addresses = **Off**; Limit to 1 response = **Off** (this would require sign-in)
- **Required:** consent and Q1–Q10, Q13–Q17. **Optional:** Q11–Q12
- Turn on **response validation** for every number question (see ranges above)
- Link responses to a Google Sheet, then export as CSV

## 6. Cleaning Checklist (before saving `Data_CA1.csv`)

- [ ] Drop the `Timestamp` and consent columns
- [ ] Rename columns to the CSV names above
- [ ] Encode Yes/No → `True`/`False`
- [ ] Convert "Prefer not to say" → missing (NaN)
- [ ] Check for impossible values (e.g. active minutes > 600, sleep + sitting > 24)
- [ ] Commit only the anonymised `Data_CA1.csv`, never the raw export

## 7. Before Launch

- [ ] Pilot with 3–5 people. Check the time taken, unclear wording and whether Q5 is understood
- [ ] Distribute: class group, work colleagues, friends and family (aim for a mix of ages)
- [ ] Send a reminder after 3–4 days
