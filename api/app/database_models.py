from __future__ import annotations

from datetime import date, datetime, timezone

from sqlalchemy import Date, DateTime, Float, ForeignKey, Index, Integer
from sqlalchemy import String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from api.app.database import Base


class EquipmentRecord(Base):
    __tablename__ = "equipment"

    equipment_id: Mapped[str] = mapped_column(
        String(20),
        primary_key=True,
    )
    model: Mapped[str] = mapped_column(String(100))
    category: Mapped[str] = mapped_column(String(100))
    serial_number: Mapped[str] = mapped_column(
        String(50),
        unique=True,
    )
    location: Mapped[str] = mapped_column(String(100))
    assigned_dealer: Mapped[str] = mapped_column(String(100))
    status: Mapped[str] = mapped_column(String(20))
    engine_hours: Mapped[float] = mapped_column(Float)
    fuel_level: Mapped[float] = mapped_column(Float)
    health_score: Mapped[int] = mapped_column(Integer)
    last_service_date: Mapped[date] = mapped_column(Date)

    service_cases: Mapped[list[ServiceCaseRecord]] = relationship(
        back_populates="equipment",
        cascade="all, delete-orphan",
    )


class ServiceCaseRecord(Base):
    __tablename__ = "service_cases"
    __table_args__ = (
        Index(
            "idx_service_cases_status_priority",
            "status",
            "priority",
        ),
    )

    case_id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True,
    )
    equipment_id: Mapped[str] = mapped_column(
        String(20),
        ForeignKey("equipment.equipment_id", ondelete="CASCADE"),
        index=True,
    )
    title: Mapped[str] = mapped_column(String(150))
    description: Mapped[str] = mapped_column(Text)
    priority: Mapped[str] = mapped_column(String(20))
    status: Mapped[str] = mapped_column(
        String(20),
        default="open",
    )
    source: Mapped[str] = mapped_column(
        String(30),
        default="manual",
    )
    assigned_to: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    equipment: Mapped[EquipmentRecord] = relationship(
        back_populates="service_cases",
    )