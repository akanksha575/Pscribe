from pydantic import BaseModel, Field, validator
from typing import Optional, Dict, List
from datetime import date, datetime

# --- Medical Document Schemas ---
class MedicalDocumentDisplay(BaseModel):
    id: int
    original_filename: str
    document_type: str
    upload_date: datetime
    content_type: str
    file_path: str

    class Config:
        from_attributes = True # Updated from orm_mode


# --- Encounter Schemas ---
class EncounterBase(BaseModel):
    patient_id: int
    appointment_date: Optional[date] = None
    transcript_document_id: Optional[int] = None
    generated_note_document_id: Optional[int] = None

class EncounterCreate(EncounterBase):
    pass

class EncounterDisplay(EncounterBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    transcript_document: Optional[MedicalDocumentDisplay] = None
    generated_note_document: Optional[MedicalDocumentDisplay] = None
    patient_first_name: Optional[str] = None
    patient_last_name: Optional[str] = None
    patient_dob: Optional[date] = None

    @validator('appointment_date', 'patient_dob', pre=True, allow_reuse=True)
    def format_date(cls, value):
        if isinstance(value, str):
            try:
                return datetime.strptime(value, "%Y-%m-%d").date()
            except ValueError:
                 pass
        return value
        
    class Config:
        from_attributes = True # Updated from orm_mode


# --- Patient Schemas ---
class PatientBase(BaseModel):
    first_name: Optional[str] = Field(None, description="Patient's first name")
    last_name: Optional[str] = Field(None, description="Patient's last name")
    dob: Optional[date] = Field(None, description="Patient's date of birth (YYYY-MM-DD)")
    sex: Optional[str] = Field(None, description="Patient's sex")
    account_no: Optional[str] = Field(None, description="Patient's account number")
    address1: Optional[str] = Field(None, description="Patient's address line 1")
    city: Optional[str] = Field(None, description="Patient's city")
    state: Optional[str] = Field(None, description="Patient's state")
    zip_code: Optional[str] = Field(None, alias="zip", description="Patient's ZIP code") # Alias example
    cell_phone: Optional[str] = Field(None, description="Patient's cell phone number")
    email: Optional[str] = Field(None, description="Patient's email address")
    race: Optional[str] = Field(None, description="Patient's race")
    ethnicity: Optional[str] = Field(None, description="Patient's ethnicity")
    marital_status: Optional[str] = Field(None, description="Patient's marital status")
    pcp: Optional[str] = Field(None, description="Patient's Primary Care Provider")
    ec_name: Optional[str] = Field(None, description="Emergency contact name")
    ec_relation: Optional[str] = Field(None, description="Emergency contact relation")
    ec_phone: Optional[str] = Field(None, description="Emergency contact phone number")

    class Config:
        populate_by_name = True    # Updated from allow_population_by_field_name
        from_attributes = True     # Updated from orm_mode

class PatientCreate(PatientBase):
    first_name: str 
    last_name: str  

    @validator('dob', pre=True, allow_reuse=True)
    def parse_dob_string(cls, value):
        if isinstance(value, str):
            try:
                return datetime.strptime(value, "%m-%d-%Y").date()
            except ValueError:
                try: 
                    return datetime.strptime(value, "%Y-%m-%d").date()
                except ValueError:
                    raise ValueError("Invalid date format for DOB. Use MM-DD-YYYY or YYYY-MM-DD.")
        return value
    
    # Inherits Config from PatientBase, so from_attributes=True applies

class PatientDisplay(PatientBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    documents: List[MedicalDocumentDisplay] = []
    # encounters: List[EncounterDisplay] = [] # Decide if you need encounters here
    
    # Inherits Config from PatientBase, so from_attributes=True applies


# --- API Response Schemas ---
class PatientInfoForNote(BaseModel): # For displaying patient details with the note
    account_no: Optional[str] = "N/A"
    name: str # Format: "Last Name, First Name"
    dob: Optional[str] = "N/A" # Format: "YYYY-MM-DD"
    sex: Optional[str] = "N/A"
    address: Optional[str] = "N/A" # Format: "address1, city, state zip"
    cell_phone: Optional[str] = "N/A"
    email: Optional[str] = "N/A"

    # No Config needed here unless you're creating instances from ORM objects directly
    # or need other Pydantic V2 specific configurations.

class GenerateNoteResponse(BaseModel):
    message: str
    html_preview: str
    template_used: str
    patient_id: Optional[int] = None
    encounter_id: Optional[int] = None
    generated_document_id: Optional[int] = None
    patient_details: Optional[PatientInfoForNote] = None

    # No Config needed here unless you're creating instances from ORM objects directly

class TemplatesResponse(BaseModel):
    templates: Dict[str, str] = Field(..., description="Dictionary of available template_id: template_name")

    # No Config needed

class HealthCheckResponse(BaseModel):
    status: str
    api_key_present: bool

    # No Config needed