from flask import Flask, request, jsonify
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
from sklearn.impute import SimpleImputer
import numpy as np
from flask_cors import CORS

app = Flask(__name__)

# Enable CORS for specific origins
CORS(app, origins=["https://www.infradash.space", "https://infradash.space"])

# Load dataset
data = pd.read_csv('filtered_cme_data.csv')

# Preprocess the data (assuming column names as described)
data['Timestamp'] = pd.to_datetime(data['Timestamp'])  # Convert Timestamp to datetime

# Exclude the 'Timestamp' column for imputation
data_without_timestamp = data.drop(columns=['Timestamp'])

# Handle missing values using SimpleImputer (fill with mean for features)
imputer = SimpleImputer(strategy='mean')
data_filled = pd.DataFrame(imputer.fit_transform(data_without_timestamp), columns=data_without_timestamp.columns)

# Include the 'Timestamp' column back into the data
data_filled['Timestamp'] = data['Timestamp']

# Extract features and target variable
features = ['Width', 'Linear Speed', '2nd initial', 'order final', 'speed 20R', 'Accel', 'Mass', 'Kinetic Energy', 'MPA']
X = data_filled[features]
y = data_filled['Severity']

# Standardize features
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Train-test split based on time (split 80% train, 20% test)
train_size = int(len(X_scaled) * 0.8)
X_train, X_test = X_scaled[:train_size], X_scaled[train_size:]
y_train, y_test = y[:train_size], y[train_size:]

# Model training
model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

@app.route('/predict', methods=['GET'])
def predict():
    # Get the "days" parameter from the query string
    days = int(request.args.get('days', 30))  # Default to 30 days if no parameter is given

    # Predict future events
    predictions = model.predict(X_test)

    # Generate future timestamps: assuming one prediction per day starting from tomorrow
    start_date = pd.Timestamp.today() + pd.Timedelta(days=1)
    future_timestamps = pd.date_range(start=start_date, periods=len(predictions), freq='D')

    # Post-process predictions with timestamp and severity
    prediction_results = pd.DataFrame({
        'Severity': np.round(predictions * 100, 0),  # Convert predictions to percentage and truncate after decimal
        'Timestamp': future_timestamps
    })

    # Remove predictions where severity is 100 or higher
    prediction_results = prediction_results[prediction_results['Severity'] < 100]

    # Filter results for the requested number of days
    prediction_results = prediction_results.head(days)

    # Generate warnings based on severity
    warnings = []
    for _, row in prediction_results.iterrows():
        severity = row['Severity']
        if severity > 80:
            code = 'red'
        elif severity > 70:
            code = 'orange'
        elif severity > 60:
            code = 'yellow'
        else:
            continue
        warnings.append({
            'severity': severity,
            'code': code,
            'timestamp': row['Timestamp']
        })

    # Return the results as JSON
    return jsonify({
        'data': prediction_results.to_dict(orient='records'),
        'warnings': warnings
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8001)  # Bind to port 8001
