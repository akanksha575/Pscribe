from sqlalchemy import create_engine, Column, Integer, String, Date, ForeignKey, DateTime
from sqlalchemy.orm import relationship, sessionmaker, declarative_base
from sqlalchemy.sql import func
import os
# Ensure this path is correct for your project structure.
# If config.py is in app/core/, this is fine.
# If config.py is directly in app/, it should be: from .config import SQLALCHEMY_DATABASE_URL
from .core.config import DATABASE_URL

# If DATABASE_URL is not set, fall back to a local SQLite database for development.
DEFAULT_SQLITE_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'pcscribe.db')
DB_URL = DATABASE_URL or f"sqlite:///{DEFAULT_SQLITE_PATH}"

import logging

logger = logging.getLogger(__name__)

# Create the SQLAlchemy engine. Use pool_pre_ping for PostgreSQL health checks.
engine = create_engine(DB_URL, pool_pre_ping=True)

# Test database connection on startup and log result
try:
    with engine.connect() as connection:
        logger.info("Database connection established successfully.")
except Exception as db_err:
    logger.error(f"Failed to connect to database: {db_err}")

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class Patient(Base):
    __tablename__ = "patients"

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String, index=True, nullable=False)
    last_name = Column(String, index=True, nullable=False)
    dob = Column(Date, nullable=True)
    sex = Column(String, nullable=True)
    account_no = Column(String, unique=True, index=True, nullable=True)
    address1 = Column(String, nullable=True)
    city = Column(String, nullable=True)
    state = Column(String, nullable=True)
    zip_code = Column(String, nullable=True)
    cell_phone = Column(String, nullable=True)
    email = Column(String, nullable=True)
    race = Column(String, nullable=True)
    ethnicity = Column(String, nullable=True)
    marital_status = Column(String, nullable=True)
    pcp = Column(String, nullable=True)
    ec_name = Column(String, nullable=True)
    ec_relation = Column(String, nullable=True)
    ec_phone = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now()) # Added server_default

    documents = relationship("MedicalDocument", back_populates="patient", cascade="all, delete-orphan")
    encounters = relationship("Encounter", back_populates="patient", cascade="all, delete-orphan") # Added relationship to Encounter

class MedicalDocument(Base):
    __tablename__ = "medical_documents"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False)
    filename = Column(String, nullable=False)
    original_filename = Column(String, nullable=False)
    document_type = Column(String, nullable=False)
    file_path = Column(String, nullable=False)
    upload_date = Column(DateTime(timezone=True), server_default=func.now())
    content_type = Column(String, default="application/octet-stream") # Changed default for more generic uploads

    patient = relationship("Patient", back_populates="documents")
    
    # Relationships for Encounter if this document is a transcript or generated note
    transcript_for_encounter = relationship("Encounter", foreign_keys="Encounter.transcript_document_id", back_populates="transcript_document", uselist=False)
    generated_note_for_encounter = relationship("Encounter", foreign_keys="Encounter.generated_note_document_id", back_populates="generated_note_document", uselist=False)

# --- ADD THE ENCOUNTER CLASS HERE ---
class Encounter(Base):
    __tablename__ = "encounters"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False)
    appointment_date = Column(Date, nullable=True, server_default=func.current_date())
    
    transcript_document_id = Column(Integer, ForeignKey("medical_documents.id"), unique=True, nullable=True)
    generated_note_document_id = Column(Integer, ForeignKey("medical_documents.id"), unique=True, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())

    patient = relationship("Patient", back_populates="encounters")
    transcript_document = relationship("MedicalDocument", foreign_keys=[transcript_document_id], back_populates="transcript_for_encounter", uselist=False)
    generated_note_document = relationship("MedicalDocument", foreign_keys=[generated_note_document_id], back_populates="generated_note_for_encounter", uselist=False)
# --- END OF ENCOUNTER CLASS ---

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def create_db_tables():
    Base.metadata.create_all(bind=engine)