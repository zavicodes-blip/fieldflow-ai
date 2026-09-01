# FieldFlow AI

FieldFlow AI is an intelligent equipment service operations platform built to demonstrate enterprise application development, workflow automation, API integration, automated testing, and AI-assisted support.

## Current Features

- Equipment inventory with operational health information
- Simulated real-time machine telemetry
- Threshold-based equipment alerts
- Interactive OpenAPI documentation
- Automated API tests
- Structured error handling

## Technology

- Python
- FastAPI
- Pydantic
- Pytest
- REST APIs

Additional Microsoft Power Platform, Power Automate, Dataverse, and Copilot Studio components will be added as the project develops.

## Run the API

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python -m uvicorn api.app.main:app --reload