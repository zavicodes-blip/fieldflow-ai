from fastapi import FastAPI, HTTPException

from api.app.equipment_data import EQUIPMENT_RECORDS
from api.app.models import Equipment, TelemetryReading
from api.app.telemetry_service import generate_telemetry


app = FastAPI(
    title="FieldFlow Equipment API",
    description=(
        "Equipment telemetry and service operations API "
        "for the FieldFlow AI platform."
    ),
    version="1.0.0",
)


def find_equipment(equipment_id: str) -> Equipment:
    for equipment in EQUIPMENT_RECORDS:
        if equipment.equipment_id == equipment_id:
            return equipment

    raise HTTPException(
        status_code=404,
        detail=f"Equipment {equipment_id} was not found.",
    )


@app.get("/")
def get_api_information():
    return {
        "name": "FieldFlow Equipment API",
        "version": "1.0.0",
        "status": "operational",
        "documentation": "/docs",
    }


@app.get("/health")
def get_health_status():
    return {
        "status": "healthy",
        "service": "fieldflow-api",
    }


@app.get("/api/equipment", response_model=list[Equipment])
def get_all_equipment():
    return EQUIPMENT_RECORDS


@app.get("/api/equipment/{equipment_id}", response_model=Equipment)
def get_equipment(equipment_id: str):
    return find_equipment(equipment_id)


@app.get(
    "/api/equipment/{equipment_id}/telemetry",
    response_model=TelemetryReading,
)
def get_equipment_telemetry(equipment_id: str):
    equipment = find_equipment(equipment_id)
    return generate_telemetry(equipment)