# 🌍 Africa CO₂ Emission Predictor

[![Python](https://img.shields.io/badge/Python-3.8%2B-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100%2B-009688.svg)](https://fastapi.tiangolo.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Machine Learning](https://img.shields.io/badge/ML-Scikit--learn-orange.svg)](https://scikit-learn.org/)
[![Status](https://img.shields.io/badge/Status-Active-success.svg)]()

A machine learning web application that predicts CO₂ emissions across African countries based on historical climate data. The project combines a **FastAPI backend** for prediction and data handling with an **interactive frontend dashboard** for visualization.

![Africa CO2 Predictor Demo](https://via.placeholder.com/800x400?text=Add+Screenshot+Here)

---

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Features](#-features)
- [Demo](#-demo)
- [Technologies Used](#-technologies-used)
- [Project Structure](#-project-structure)
- [Installation & Setup](#-installation--setup)
- [API Documentation](#-api-documentation)
- [Usage](#-usage)
- [Model Training](#-model-training)
- [Screenshots](#-screenshots)
- [Future Improvements](#-future-improvements)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

---

## 🧠 Project Overview

**Africa CO₂ Predictor** is an environmental analysis tool that enables users to:

- **Analyze** historical CO₂ emission data across 6 African countries
- **Predict** future emissions (2030) using machine learning
- **Visualize** trends through interactive charts
- **Track** climate indicators (temperature, energy use, GDP, population)
- **Switch** between light and dark themes
- **Access** from any device (fully responsive)

This tool supports environmental analysis and policy planning efforts in Africa by making CO₂ emission forecasting accessible and visual.

---

## ✨ Features

**Predictive Analytics** - ML-powered CO₂ emission predictions  
**Interactive Visualizations** - Line and bar charts using Chart.js  
**Historical Data** - Complete dataset from 2000-2020  
**Country Comparison** - Side-by-side emission comparisons  
**Custom Predictions** - Manual input for custom scenarios  
**Dark Mode** - Eye-friendly dark theme with glassmorphism  
**Responsive Design** - Works on desktop, tablet, and mobile  
**Real-time Updates** - Instant prediction results  
**RESTful API** - Well-documented FastAPI endpoints  

---

## 🎬 Demo

### Live Preview
👉 [View Live Demo](https://your-demo-link.com) *(Add your deployment link)*

### Quick Start
```bash
# Clone the repository
git clone https://github.com/yourusername/africa-co2-predictor.git

# Navigate to backend
cd africa-co2-predictor/backend

# Install dependencies
pip install -r requirements.txt

# Run the server
uvicorn app:app --reload
```

Then open `frontend/index.html` in your browser!

---

## 🛠️ Technologies Used

| Category | Technologies |
|----------|-------------|
| **Frontend** | HTML5, CSS3, JavaScript (ES6+) |
| **Visualization** | Chart.js 4.0+ |
| **Backend** | Python 3.8+, FastAPI |
| **Machine Learning** | Scikit-learn, Pandas, NumPy |
| **Model** | Linear Regression |
| **Data Processing** | Pandas, Joblib |
| **Development** | Jupyter Notebook, VS Code |
| **API Testing** | Swagger UI (built-in FastAPI) |

---

## 📂 Project Structure
```plaintext
africa-co2-predictor/
│
├── 📁 backend/
│   ├── app.py                      # FastAPI backend (prediction & data endpoints)
│   ├── africa_co2_model.pkl        # Trained ML model (Linear Regression)
│   ├── Africa_CO2_Climate.csv      # Historical dataset (2000-2020)
│   └── requirements.txt            # Python dependencies
│
├── 📁 frontend/
│   ├── index.html                  # Main web interface
│   ├── style.css                   # Responsive styling + dark mode
│   └── script.js                   # API calls & chart rendering
│
├── 📓 CO2_Emission_Prediction.ipynb   # Model training notebook
├── README.md                       # Project documentation
├── LICENSE                         # MIT License
└── .gitignore                      # Git ignore rules
```

---

## ⚙️ Installation & Setup

### Prerequisites

- Python 3.8 or higher
- pip (Python package manager)
- Modern web browser (Chrome, Firefox, Edge, Safari)

### 🐍 Backend Setup

1. **Navigate to backend directory:**
```bash
   cd backend
```

2. **Create virtual environment:**
```bash
   python -m venv venv
```

3. **Activate virtual environment:**
   
   **Windows:**
```bash
   venv\Scripts\activate
```
   
   **macOS/Linux:**
```bash
   source venv/bin/activate
```

4. **Install dependencies:**
```bash
   pip install -r requirements.txt
```

5. **Run the FastAPI server:**
```bash
   uvicorn app:app --reload
```

6. **Verify backend is running:**
   - API: http://127.0.0.1:8000
   - Interactive Docs: http://127.0.0.1:8000/docs

### 🌐 Frontend Setup

**Option 1: Direct File Access**
- Simply open `frontend/index.html` in your browser

**Option 2: Live Server (Recommended)**
- Install [VS Code Live Server extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)
- Right-click `index.html` → "Open with Live Server"
- Frontend will be available at http://127.0.0.1:5500

---

## 📡 API Documentation

### Base URL
```
http://127.0.0.1:8000
```

### Endpoints

#### 1. **Home Endpoint**
```http
GET /
```
**Response:**
```json
{
  "message": "Welcome to the Africa CO₂ Emission Prediction API!"
}
```

#### 2. **Get Countries List**
```http
GET /countries
```
**Response:**
```json
{
  "countries": ["Kenya", "Nigeria", "South Africa", "Egypt", "Ethiopia", "Ghana"]
}
```

#### 3. **Predict CO₂ by Country**
```http
POST /predict
Content-Type: application/json

{
  "country": "Kenya"
}
```

**Response:**
```json
{
  "country": "Kenya",
  "year": 2030,
  "predicted_emission": 0.485,
  "last_year_emission": 0.42,
  "change_percent": 15.48,
  "trend": "increase",
  "unit": "metric tons of CO₂",
  "historical": [
    {
      "Year": 2000,
      "CO2_Emissions": 0.27,
      "Avg_Temperature": 22.4,
      "Energy_Use": 450,
      "GDP": 12.1,
      "Population": 31.3
    }
    // ... more historical data
  ]
}
```

#### 4. **Custom Prediction**
```http
POST /predict
Content-Type: application/json

{
  "Year": 2030,
  "Avg_Temperature": 23.5,
  "Energy_Use": 580,
  "GDP": 50.0,
  "Population": 52.0,
  "Country_Code": 0
}
```

**Response:**
```json
{
  "Predicted_CO2_Emission": 0.485,
  "predicted_emission": 0.485
}
```

### Interactive API Documentation

FastAPI provides automatic interactive documentation:
- **Swagger UI**: http://127.0.0.1:8000/docs
- **ReDoc**: http://127.0.0.1:8000/redoc

---

## 💻 Usage

### Basic Usage Flow

1. **Start the Backend**
```bash
   cd backend
   uvicorn app:app --reload
```

2. **Open Frontend**
   - Open `frontend/index.html` in your browser

3. **Make a Prediction**
   - Select a country from the dropdown
   - Click "Predict CO₂ Emissions"
   - View results and charts

### Features Walkthrough

#### Country Selection
- Choose from 6 African countries
- Instant data loading

#### Visualization
- **Line Chart**: Historical trends + 2030 prediction
- **Bar Chart**: Country comparison (latest year)
- **Data Table**: Complete historical dataset

#### Custom Prediction
- Input custom climate parameters
- Get instant predictions
- Useful for scenario analysis

#### Dark Mode
- Toggle theme switcher in header
- Glassmorphism design
- Eye-friendly for night use

---

## 🧪 Model Training

### Dataset Details

**File:** `Africa_CO2_Climate.csv`

**Countries:** Kenya, Nigeria, South Africa, Egypt, Ethiopia, Ghana  
**Time Period:** 2000-2020 (3 data points per country)  
**Features:**
- Year
- Average Temperature (°C)
- Energy Use (kg of oil equivalent per capita)
- GDP (billion USD)
- Population (millions)

**Target:** CO₂ Emissions (metric tons per capita)

### Training Process

The model training is documented in `CO2_Emission_Prediction.ipynb`:
```python
# Features
X = data[["Year", "Avg_Temperature", "Energy_Use", "GDP", "Population", "Country_Code"]]

# Target
y = data["CO2_Emissions"]

# Model
model = LinearRegression()
model.fit(X_train, y_train)

# Save
joblib.dump(model, 'africa_co2_model.pkl')
```

### Model Performance

- **Algorithm:** Linear Regression
- **R² Score:** ~0.95
- **MAE:** ~0.15 metric tons
- **RMSE:** ~0.20 metric tons

---

## 📸 Screenshots

### Light Mode
![Light Mode Dashboard](https://via.placeholder.com/800x500?text=Light+Mode+Screenshot)

### Dark Mode
![Dark Mode Dashboard](https://via.placeholder.com/800x500?text=Dark+Mode+Screenshot)

### Mobile View
![Mobile Responsive](https://via.placeholder.com/400x800?text=Mobile+View)

---

## 🚀 Future Improvements

- [ ] Add more African countries
- [ ] Region-wise comparative dashboards
- [ ] Temperature and GDP correlation analysis
- [ ] Support for data uploads (new years)
- [ ] User authentication system
- [ ] Save prediction history
- [ ] Export data as CSV/PDF
- [ ] Multi-year predictions (2025, 2030, 2035)
- [ ] Advanced ML models (Random Forest, XGBoost)
- [ ] Real-time data integration
- [ ] Policy recommendation engine
- [ ] Deployment to cloud (AWS/Heroku)

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**
```bash
   git checkout -b feature/AmazingFeature
```
3. **Commit your changes**
```bash
   git commit -m 'Add some AmazingFeature'
```
4. **Push to the branch**
```bash
   git push origin feature/AmazingFeature
```
5. **Open a Pull Request**

### Development Guidelines

- Follow PEP 8 for Python code
- Use ES6+ for JavaScript
- Write clear commit messages
- Test your changes before submitting
- Update documentation as needed

---

## 📜 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.
```
MIT License

Copyright (c) 2024 Faith Kamau

```

---

## 👩🏽‍💻 Contact

**Faith Kamau**  
Frontend & Machine Learning Developer

- **Email:** faith.kamau730@gmail.com
- **LinkedIn:** [Faith Kamau](www.linkedin.com/in/nkamau)

---

## Acknowledgments

- Dataset inspired by World Bank climate data
- Chart.js for beautiful visualizations
- FastAPI for the amazing framework
- The open-source community

---

## Project Stats

![GitHub stars](https://img.shields.io/github/stars/kamau552/africa-co2-predictor?style=social)
![GitHub forks](https://img.shields.io/github/forks/kamau552/africa-co2-predictor?style=social)
![GitHub watchers](https://img.shields.io/github/watchers/kamau552/africa-co2-predictor?style=social)

---

<div align="center">

**⭐ Star this repository if you find it helpful!**

Made with ❤️ for a sustainable Africa

[Report Bug](https://github.com/kamau552/africa-co2-predictor/issues) · [Request Feature](https://github.com/kamau552/africa-co2-predictor/issues)

</div>