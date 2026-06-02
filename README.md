# PCScribe v4.0.3
A comprehensive, AI-powered medical transcription and documentation system designed for healthcare professionals. PCScribe helps medical practitioners transcribe audio, generate clinical notes, manage patient records, and extract structured medical information from consultations using advanced AI technology.


## 🚀 Features
### Core Functionality
- **Audio Transcription**: Convert audio files to text using OpenAI Whisper API
- **Medical Note Generation**: AI-powered generation of coherent clinical notes from transcripts
- **Patient Management**: Complete patient record system with search and CRUD operations
- **Document Management**: Upload, store, and retrieve medical documents (transcripts, notes, etc.)
- **Encounter Tracking**: Link transcripts to patient encounters with appointment dates
- **Template System**: Multiple note templates for different medical specialties
- **Real-time Processing**: Fast API responses with background task handling

### Advanced Capabilities
- **Multi-format Support**: Handle DOCX, TXT, and audio files
- **Patient Search**: Search by name, date of birth, or account number
- **Document Storage**: Secure file storage with unique naming and organization
- **Database Integration**: SQLite database with SQLAlchemy ORM
- **API-First Design**: RESTful API for easy integration and scalability
- **Modern Web Interface**: Responsive frontend with real-time updates


## 🏗️ Architecture
PCScribe uses a modern, decoupled architecture:
- **Backend**: FastAPI-based REST API with SQLite database
- **Frontend**: Modern HTML/CSS/JavaScript with responsive design
- **AI Engine**: OpenAI API for transcription and Anthropic Claude for note generation
- **Database**: SQLAlchemy with Alembic migrations
- **File Storage**: Organized patient data directory structure


## 🛠️ Technology Stack
### Backend
- **Python 3.8+** - Core runtime
- **FastAPI** - Modern, fast web framework with automatic API documentation
- **Uvicorn** - ASGI server for production deployment
- **SQLAlchemy** - Database ORM with relationship management
- **Alembic** - Database migrations and version control
- **OpenAI** - Whisper API for audio transcription
- **Anthropic** - Claude API for advanced language processing
- **Pydantic** - Data validation and serialization
- **Python-docx** - Microsoft Word document processing
- **Pydub** - Audio file processing and conversion
- **SpeechRecognition** - Speech-to-text capabilities
- **Python-multipart** - File upload handling
- **Aiofiles** - Asynchronous file operations

### Frontend
- **HTML5** - Semantic markup and structure
- **CSS3** - Modern styling with responsive design
- **JavaScript (ES6+)** - Interactive functionality and API communication
- **Font Awesome** - Icon library for UI elements
- **HTTP Server** - Development server for local testing

### Database
- **SQLite** - Lightweight, file-based database
- **SQLAlchemy** - Python SQL toolkit and ORM
- **Alembic** - Database migration tool


## 📁 Project Structure
```
PCScribe/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py             # FastAPI app & API endpoints
│   │   ├── scribe.py           # Core PCScribe logic & AI processing
│   │   ├── schemas.py          # Pydantic data models & validation
│   │   ├── db_models.py        # SQLAlchemy database models
│   │   └── core/
│   │       └── config.py       # Configuration & environment variables
│   ├── patient_data/           # Patient file storage (transcripts, notes, docs)
│   ├── temp_notes/             # Temporary document storage
│   ├── venv/                   # Python virtual environment
│   ├── requirements.txt        # Python dependencies
│   ├── .gitignore             # Git ignore rules
│   └── pcscribe.db            # SQLite database file
├── frontend/
│   ├── public/
│   │   ├── index.html         # Main application interface
│   │   ├── css/
│   │   │   └── style.css      # Application styles & responsive design
│   │   ├── js/
│   │   │   └── script.js      # Frontend logic & API integration
│   │   └── images/            # Application images & logos
│   ├── server.js              # Development server configuration
│   ├── package.json           # Node.js dependencies & scripts
│   └── node_modules/          # Installed packages
├── transcripts/                # Global transcript storage
└── README.md                  # This documentation file
```


## 🗄️ Database Schema
### Core Tables
#### Patients
- **id**: Primary key
- **first_name**, **last_name**: Patient identification (required)
- **dob**: Date of birth
- **sex**: Patient gender
- **account_no**: Unique account number
- **address1**, **city**, **state**, **zip_code**: Contact information
- **cell_phone**, **email**: Communication details
- **race**, **ethnicity**, **marital_status**: Demographics
- **pcp**: Primary care provider
- **ec_name**, **ec_relation**, **ec_phone**: Emergency contact
- **created_at**, **updated_at**: Timestamps

#### Medical Documents
- **id**: Primary key
- **patient_id**: Foreign key to patients
- **filename**: Unique filename on disk
- **original_filename**: Original uploaded filename
- **document_type**: Type (transcript, generated_note, etc.)
- **file_path**: Relative path in patient_data directory
- **upload_date**: When document was uploaded
- **content_type**: MIME type

#### Encounters
- **id**: Primary key
- **patient_id**: Foreign key to patients
- **appointment_date**: Date of medical encounter
- **transcript_document_id**: Link to transcript document
- **generated_note_document_id**: Link to generated note
- **created_at**, **updated_at**: Timestamps


## 🔌 API Endpoints
### Authentication & Health
- `GET /api/health` - API health check and API key status
- `GET /api/templates` - Available note templates

### Patient Management
- `POST /api/patients/` - Create new patient
- `GET /api/patients/` - List all patients (with pagination)
- `GET /api/patients/{patient_id}` - Get specific patient details
- `GET /api/patients/search/` - Search patients by name, DOB, or account number

### Document Management
- `POST /api/patients/{patient_id}/documents/` - Upload patient document
- `GET /api/documents/{document_id}` - Download document by ID
- `GET /api/documents/by-filename/{filename}` - Download document by filename

### Encounter Management
- `GET /api/patients/{patient_id}/encounters/` - List patient encounters

### Core Functionality
- `POST /api/generate-note/` - Generate medical note from transcript
- `POST /api/transcribe-audio/` - Transcribe audio file to text


## ⚙️ Prerequisites
Before you begin, ensure you have the following installed:
- **Python 3.8+** with pip
- **Node.js 16+** with npm
- **FFmpeg** (for audio processing)
  - **Windows**: Download from [ffmpeg.org](https://ffmpeg.org/download.html) and add to PATH
  - **macOS**: `brew install ffmpeg`
  - **Ubuntu/Debian**: `sudo apt update && sudo apt install ffmpeg`


## 🔑 Environment Setup
### 1. API Keys Required
- **OpenAI API Key**: For audio transcription (Whisper API)
- **Anthropic API Key**: For note generation (Claude API)

### 2. Get API Keys
- **OpenAI**: Sign up at [platform.openai.com](https://platform.openai.com)
- **Anthropic**: Sign up at [console.anthropic.com](https://console.anthropic.com)

### 3. Clone the Repository
```bash
git clone <repository-url>
cd PCScribe
```


## 🚀 Quick Start
### 1. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file with your API keys
echo "OPENAI_API_KEY=your_openai_api_key_here" > .env
echo "ANTHROPIC_API_KEY=your_anthropic_api_key_here" >> .env

# Optional: Set custom database URL
echo "SQLALCHEMY_DATABASE_URL=sqlite:///./pcscribe.db" >> .env

# Run the FastAPI server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The backend API will be available at `http://localhost:8000`

### 2. Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run
node server.js
```

The frontend will be available at `http://localhost:3000`

### 3. Database Setup
```bash
# Navigate to backend directory
cd backend

# Activate virtual environment (if not already active)
venv\Scripts\activate  # Windows
# source venv/bin/activate  # macOS/Linux

# Run database migrations (if using Alembic)
alembic upgrade head

# Or create tables directly (if not using migrations)
python -c "from app.db_models import create_db_tables; create_db_tables()"
```


## 📖 API Documentation
Once the backend is running, you can access:
- **Interactive API Docs**: `http://localhost:8000/docs` - Swagger UI
- **ReDoc Documentation**: `http://localhost:8000/redoc` - Alternative documentation
- **OpenAPI Schema**: `http://localhost:8000/openapi.json` - Raw API specification


## 🔧 Configuration
### Environment Variables
Create a `.env` file in the `backend` directory:

```env
# Required API Keys
OPENAI_API_KEY=your_openai_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Database Configuration
SQLALCHEMY_DATABASE_URL=sqlite:///./pcscribe.db

# File Storage
PATIENT_DATA_DIR=./patient_data

# Debug Mode
DEBUG=True
```

### Database Configuration
The application uses SQLite by default. For production, you can modify the database URL to use:
- **PostgreSQL**: `postgresql://user:password@localhost/dbname`
- **MySQL**: `mysql://user:password@localhost/dbname`
- **SQL Server**: `mssql+pyodbc://user:password@server/dbname`


## 🧪 Development
### Running Tests

```bash
# Navigate to backend directory
cd backend

# Activate virtual environment
venv\Scripts\activate  # Windows
# source venv/bin/activate  # macOS/Linux

# Run tests (if available)
python -m pytest
```

### Code Style
- **Python**: Follow PEP 8 guidelines
- **JavaScript**: Use ES6+ features and consistent formatting
- **HTML/CSS**: Follow semantic HTML and modern CSS practices

### Development Workflow
1. **Backend Changes**: Modify Python files in `backend/app/`
2. **Frontend Changes**: Modify files in `frontend/public/`
3. **Database Changes**: Update models in `db_models.py` and run migrations
4. **API Changes**: Update schemas in `schemas.py` and endpoints in `main.py`


## 🚀 Deployment
### Production Considerations
1. **Environment Variables**: Set production environment variables
2. **Database**: Use production-grade database (PostgreSQL recommended)
3. **Static Files**: Serve frontend through CDN or web server
4. **HTTPS**: Enable SSL/TLS encryption
5. **Monitoring**: Implement logging and monitoring
6. **Security**: Review and harden security settings

### Docker Deployment
```dockerfile
# Example Dockerfile for backend
FROM python:3.9-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Environment-Specific Configurations
#### Development
```env
DEBUG=True
LOG_LEVEL=DEBUG
CORS_ORIGINS=["http://localhost:3000"]
```

#### Production
```env
DEBUG=False
LOG_LEVEL=INFO
CORS_ORIGINS=["https://yourdomain.com"]
```


## 🔒 Security Features
- **CORS Configuration**: Configurable cross-origin resource sharing
- **Input Validation**: Pydantic models for data validation
- **File Upload Security**: File type and size validation
- **Database Security**: SQL injection prevention through ORM
- **API Key Management**: Secure environment variable handling


## 📱 Frontend Features
### User Interface
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Modern UI**: Clean, professional medical application interface
- **Real-time Updates**: Live feedback during operations
- **Error Handling**: User-friendly error messages and validation

### Key Components
- **Patient Search**: Advanced search with multiple criteria
- **Document Upload**: Drag-and-drop file upload support
- **Note Generation**: Real-time note creation with templates
- **Patient Management**: Complete patient record CRUD operations


## 🤝 Contributing
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- **Code Quality**: Maintain high code quality standards
- **Testing**: Write tests for new features
- **Documentation**: Update documentation for API changes
- **Security**: Follow security best practices

## 📝 License
This project is licensed under the MIT License - see the LICENSE file for details.


## 🆘 Support & Troubleshooting
### Common Issues
1. **API Key Errors**: Ensure environment variables are set correctly
2. **Database Issues**: Check database file permissions and paths
3. **File Upload Errors**: Verify file types and sizes
4. **CORS Issues**: Check CORS configuration for frontend-backend communication

### Getting Help
If you encounter any issues:
1. Check the [Issues](https://github.com/your-repo/issues) page
2. Review the API documentation at `/docs`
3. Check the logs in the backend console
4. Ensure all prerequisites are properly installed
5. Verify environment variables are set correctly

### Logging
The application includes comprehensive logging:
- **Backend**: Python logging with configurable levels
- **Frontend**: Console logging for debugging
- **Database**: SQLAlchemy query logging (when enabled)


## 🔄 Version History
- **v4.0.3** - Current version with FastAPI backend and modern frontend
- **v3.x** - Previous Streamlit-based versions
- **v2.x** - Earlier iterations


## 🙏 Acknowledgments
- **OpenAI** for providing the Whisper API for audio transcription
- **Anthropic** for providing the Claude API for advanced language processing
- **FastAPI** team for the excellent web framework
- **SQLAlchemy** for robust database operations
- **Open Source Community** for various supporting libraries


## 📋 Compliance & Legal
**Important**: This application is designed for medical professionals and should be used in compliance with relevant healthcare regulations and privacy laws:

- **HIPAA** (Health Insurance Portability and Accountability Act)
- **GDPR** (General Data Protection Regulation)
- **Local Healthcare Regulations**
- **Data Privacy Laws**

Ensure proper data handling, encryption, and access controls are implemented for production use.

---

**PCScribe** - Transforming medical documentation through AI-powered precision and efficiency.
