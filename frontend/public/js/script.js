// --- Global auth tab switcher (needed for inline onclick) ---
function switchAuthTab(tab) {
    const signInTab = document.getElementById('signInTab');
    const signUpTab = document.getElementById('signUpTab');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const loginError = document.getElementById('loginError');
    const loginSuccess = document.getElementById('loginSuccess');

    // Hide messages
    if (loginError) loginError.style.display = 'none';
    if (loginSuccess) loginSuccess.style.display = 'none';

    if (tab === 'signup') {
        signInTab.classList.remove('active');
        signUpTab.classList.add('active');
        loginForm.classList.remove('active-form');
        signupForm.classList.add('active-form');
    } else {
        signUpTab.classList.remove('active');
        signInTab.classList.add('active');
        signupForm.classList.remove('active-form');
        loginForm.classList.add('active-form');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // --- Login Elements ---
    const loginPage = document.getElementById('loginPage');
    const mainApp = document.getElementById('mainApp');
    const loginForm = document.getElementById('loginForm');
    const loginError = document.getElementById('loginError');
    const logoutBtn = document.getElementById('logoutBtn');

    // --- Navigation Elements ---
    const appNavLinks = document.querySelectorAll('.app-nav .nav-link');
    const pageContents = document.querySelectorAll('.page-content');

    // --- Search Elements ---
    const accountNoInput = document.getElementById('accountNo');
    const patientNameInput = document.getElementById('patientName');
    const patientDobInput = document.getElementById('patientDob');
    const searchBtn = document.getElementById('searchBtn');
    const searchResults = document.getElementById('searchResults');
    const patientList = document.getElementById('patientList');

    // --- Transcript Elements ---
    const transcriptSection = document.getElementById('transcriptSection');
    const recordOption = document.getElementById('recordOption');
    const uploadOption = document.getElementById('uploadOption');
    const transcriptFile = document.getElementById('transcriptFile');
    const transcriptInfo = document.getElementById('transcriptInfo');
    const transcriptDetails = document.getElementById('transcriptDetails');
    const generateNoteBtn = document.getElementById('generateNoteBtn');

    // --- Note Elements ---
    const noteSection = document.getElementById('noteSection');
    const noteContent = document.getElementById('noteContent');
    const expandNoteBtn = document.getElementById('expandNoteBtn');
    const downloadNoteBtn = document.getElementById('downloadNoteBtn');
    const newNoteBtn = document.getElementById('newNoteBtn');

    // --- Patient Management Elements ---
    const addPatientForm = document.getElementById('addPatientForm');
    const submitNewPatientButton = document.getElementById('submitNewPatientButton');
    const addPatientStatus = document.getElementById('addPatientStatus'); 
    const patientListContainer = document.getElementById('patientListContainer');
    const patientListPlaceholder = document.getElementById('patientListPlaceholder');
    const refreshPatientListButton = document.getElementById('refreshPatientListButton');

    // --- Audio Recording Elements ---
    const audioRecordingControls = document.getElementById('audioRecordingControls');
    const startRecordingBtn = document.getElementById('startRecordingBtn');
    const stopRecordingBtn = document.getElementById('stopRecordingBtn');
    const recordingStatus = document.getElementById('recordingStatus');
    const audioPlayback = document.getElementById('audioPlayback');
    const audioFileInput = document.getElementById('audioFileInput');
    const showRecordingControlsBtn = document.getElementById('showRecordingControlsBtn');

    let mediaRecorder = null;
    let audioChunks = [];
    let recordedAudioBlob = null;

    const API_BASE_URL = 'http://localhost:8000/api';
    let currentGeneratedDocId = null; 
    let selectedPatient = null;
    let selectedTranscript = null;

    // --- Login Functionality ---
    function checkLoginStatus() {
        const isLoggedIn = sessionStorage.getItem('isLoggedIn');
        if (isLoggedIn === 'true') {
            showMainApp();
        } else {
            showLoginPage();
        }
    }

    function showLoginPage() {
        loginPage.style.display = 'flex';
        mainApp.style.display = 'none';
    }

    function showMainApp() {
        loginPage.style.display = 'none';
        mainApp.style.display = 'flex';
        setInitialPage();
    }

    if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();
        const btnText = document.querySelector('.login-btn .btn-text');
        const spinner = document.querySelector('.login-btn .spinner');
        // Show loading state
        btnText.textContent = 'Signing In...';
        spinner.classList.remove('hidden');
        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({ username, password })
            });
            const result = await response.json();
            if (response.ok && result.status === 'ok') {
                sessionStorage.setItem('isLoggedIn', 'true');
                sessionStorage.setItem('username', username);
                showMainApp();
                loginError.style.display = 'none';
            } else {
                const msg = result.detail || 'Invalid username or password';
                loginError.textContent = msg;
                loginError.style.display = 'block';
            }
        } catch (err) {
            loginError.textContent = 'Login failed: ' + err.message;
            loginError.style.display = 'block';
        } finally {
            // Reset button state
            btnText.textContent = 'Sign In';
            spinner.classList.add('hidden');
        }
    });
}

    // --- Signup Form Handler ---
    const signupForm = document.getElementById('signupForm');
    const loginSuccess = document.getElementById('loginSuccess');

    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const fullName = document.getElementById('signupFullName').value.trim();
            const email = document.getElementById('signupEmail').value.trim();
            const password = document.getElementById('signupPassword').value;
            const confirmPassword = document.getElementById('signupConfirmPassword').value;
            const btnText = signupForm.querySelector('.btn-text');
            const spinner = signupForm.querySelector('.spinner');

            // Hide previous messages
            loginError.style.display = 'none';
            if (loginSuccess) loginSuccess.style.display = 'none';

            // Validate passwords match
            if (password !== confirmPassword) {
                loginError.textContent = 'Passwords do not match.';
                loginError.style.display = 'block';
                return;
            }

            if (password.length < 6) {
                loginError.textContent = 'Password must be at least 6 characters.';
                loginError.style.display = 'block';
                return;
            }

            // Show loading state
            btnText.textContent = 'Creating Account...';
            spinner.classList.remove('hidden');

            try {
                const response = await fetch(`${API_BASE_URL}/auth/signup`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams({ email, password, full_name: fullName })
                });
                const result = await response.json();

                if (response.ok && result.status === 'ok') {
                    // Show success and switch to sign in
                    if (loginSuccess) {
                        loginSuccess.textContent = result.message || 'Account created successfully! You can now sign in.';
                        loginSuccess.style.display = 'block';
                    }
                    signupForm.reset();
                    // Auto-switch to sign in tab after a short delay
                    setTimeout(() => {
                        switchAuthTab('signin');
                        // Pre-fill the email
                        document.getElementById('username').value = email;
                    }, 1500);
                } else {
                    const msg = result.detail || 'Signup failed. Please try again.';
                    loginError.textContent = msg;
                    loginError.style.display = 'block';
                }
            } catch (err) {
                loginError.textContent = 'Signup failed: ' + err.message;
                loginError.style.display = 'block';
            } finally {
                btnText.textContent = 'Create Account';
                spinner.classList.add('hidden');
            }
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            sessionStorage.removeItem('isLoggedIn');
            sessionStorage.removeItem('username');
            showLoginPage();
            resetAllSections();
        });
    }

    // --- Page Navigation ---
    function switchPage(targetPageId) {
        pageContents.forEach(page => {
            page.classList.remove('active-page');
            if (page.id === targetPageId) page.classList.add('active-page');
        });
        appNavLinks.forEach(link => {
            link.classList.remove('active');
            if (link.dataset.page === targetPageId) link.classList.add('active');
        });
        if (targetPageId === 'managePatientsPageContent') loadAndDisplayPatientsForManagementList();
        if (targetPageId === 'scribePageContent') {
            resetScribeForm();
        }
    }

    appNavLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetPageId = link.dataset.page;
            window.location.hash = link.hash; 
            switchPage(targetPageId);
        });
    });

    function setInitialPage() {
        const hash = window.location.hash.substring(1); 
        let targetPageId = 'scribePageContent'; 
        appNavLinks.forEach(link => { 
            if (link.dataset.page === targetPageId) link.classList.add('active');
            else link.classList.remove('active');
        });
        if (hash) {
            const targetLink = document.querySelector(`.app-nav .nav-link[href="#${hash}"]`);
            if (targetLink && targetLink.dataset.page) targetPageId = targetLink.dataset.page;
        }
        switchPage(targetPageId);
    }

    // --- Search Functionality ---
    if (searchBtn) {
        searchBtn.addEventListener('click', async () => {
            const accountNo = accountNoInput.value.trim();
            const name = patientNameInput.value.trim();
            const dob = patientDobInput.value.trim();

            if (!accountNo && !name && !dob) {
                showStatus('Please enter at least one search criteria.', 'error');
                return;
            }

            searchBtn.disabled = true;
            searchBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Searching...';

            try {
                const queryParams = new URLSearchParams();
                if (name) queryParams.append('name', name);
                if (dob) queryParams.append('dob', dob);
                if (accountNo) queryParams.append('account_no', accountNo);

                const response = await fetch(`${API_BASE_URL}/patients/search/?${queryParams.toString()}`);
                const patients = await response.json();

                if (!response.ok) {
                    throw new Error(`Search failed: ${response.status}`);
                }

                displaySearchResults(patients);
            } catch (error) {
                console.error('Error searching patients:', error);
                showStatus(`Search error: ${error.message}`, 'error');
            } finally {
                searchBtn.disabled = false;
                searchBtn.innerHTML = '<i class="fas fa-search"></i><span>Search</span>';
            }
        });
    }

    function displaySearchResults(patients) {
        patientList.innerHTML = '';
        
        if (patients.length === 0) {
            patientList.innerHTML = '<p class="no-results">No patients found matching your criteria.</p>';
            searchResults.style.display = 'block';
            return;
        }

        patients.forEach(patient => {
            const patientItem = document.createElement('div');
            patientItem.className = 'patient-item';
            patientItem.dataset.patientId = patient.id;
            
            const dobText = patient.dob ? new Date(patient.dob + 'T00:00:00Z').toLocaleDateString() : 'N/A';
            
            patientItem.innerHTML = `
                <div class="patient-info">
                    <div class="patient-name">${patient.last_name}, ${patient.first_name}</div>
                    <div class="patient-details">DOB: ${dobText} | Account: ${patient.account_no || 'N/A'}</div>
                </div>
                <i class="fas fa-chevron-right"></i>
            `;
            
            patientItem.addEventListener('click', () => selectPatient(patient));
            patientList.appendChild(patientItem);
        });
        
        searchResults.style.display = 'block';
    }

    // --- Update selectPatient to set persistent status ---
    function selectPatient(patient) {
        selectedPatient = patient;
        document.querySelectorAll('.patient-item').forEach(item => {
            item.classList.remove('selected');
        });
        const selectedItem = document.querySelector(`[data-patient-id="${patient.id}"]`);
        if (selectedItem) {
            selectedItem.classList.add('selected');
        }
        transcriptSection.style.display = 'block';
        transcriptSection.scrollIntoView({ behavior: 'smooth' });
        // Set persistent status below search
        const statusDiv = document.getElementById('selectedPatientStatus');
        if (statusDiv) {
            statusDiv.style.display = 'block';
            statusDiv.style.background = '#e6f9ec';
            statusDiv.style.color = '#218838';
            statusDiv.style.border = '1px solid #b2dfdb';
            statusDiv.style.padding = '6px 12px';
            statusDiv.style.borderRadius = '6px';
            statusDiv.style.fontWeight = 'bold';
            statusDiv.textContent = `Selected Patient: ${patient.last_name}, ${patient.first_name}`;
        }
    }

    // --- Transcript Functionality ---
    if (uploadOption) {
        uploadOption.addEventListener('click', () => {
            transcriptFile.click();
        });
    }

    if (transcriptFile) {
        transcriptFile.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                selectedTranscript = file;
                displayTranscriptInfo(file.name, 'uploaded');
                transcriptInfo.style.display = 'block';
            }
        });
    }

    // --- Remove simulated recording prompt ---
    if (recordOption) {
        recordOption.addEventListener('click', () => {
            audioRecordingControls.style.display = 'block';
            showRecordingControlsBtn.style.display = 'none';
        });
    }

    function displayTranscriptInfo(filename, type) {
        transcriptDetails.innerHTML = `
            <p><strong>Type:</strong> ${type === 'recorded' ? 'Recorded Audio' : 'Uploaded File'}</p>
            <p><strong>File:</strong> ${filename}</p>
            <p><strong>Patient:</strong> ${selectedPatient ? `${selectedPatient.last_name}, ${selectedPatient.first_name}` : 'N/A'}</p>
        `;
    }

    // --- Template Selection ---
    const templateSelect = document.getElementById('templateSelect');
    let availableTemplates = {};
    async function loadTemplates() {
        if (!templateSelect) return;
        try {
            const response = await fetch(`${API_BASE_URL}/templates`);
            const data = await response.json();
            availableTemplates = data.templates || {};
            templateSelect.innerHTML = '';
            Object.entries(availableTemplates).forEach(([id, name], idx) => {
                const opt = document.createElement('option');
                opt.value = id;
                opt.textContent = name;
                if (idx === 0) opt.selected = true;
                templateSelect.appendChild(opt);
            });
        } catch (err) {
            templateSelect.innerHTML = '<option value="">(Failed to load templates)</option>';
        }
    }
    loadTemplates();

    // --- Update generateNoteBtn to send selected template ---
    if (generateNoteBtn) {
        generateNoteBtn.addEventListener('click', async () => {
            if (!selectedPatient || !selectedTranscript) {
                showStatus('Please select a patient and transcript first.', 'error');
                return;
            }
            generateNoteBtn.disabled = true;
            generateNoteBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
            try {
                const formData = new FormData();
                formData.append('patient_id', selectedPatient.id);
                formData.append('provider_name', 'Dr. Iram Sheikh, MD, DO');
                const selectedTemplateId = templateSelect && templateSelect.value ? templateSelect.value : '';
                if (selectedTemplateId) {
                    formData.append('template_id', selectedTemplateId);
                }
                
                // Handle both recorded and uploaded transcripts
                if (selectedTranscript.content) {
                    // For recorded transcripts, create a blob from the transcript content
                    console.log('Processing recorded transcript:', selectedTranscript);
                    console.log('Transcript content:', selectedTranscript.content);
                    const transcriptBlob = new Blob([selectedTranscript.content], { type: 'text/plain' });
                    console.log('Created blob size:', transcriptBlob.size);
                    formData.append('file', transcriptBlob, selectedTranscript.name || 'transcript.txt');
                } else {
                    // For uploaded files
                    console.log('Processing uploaded file:', selectedTranscript);
                    formData.append('file', selectedTranscript);
                }

                console.log('Sending request to generate note...');
                const response = await fetch(`${API_BASE_URL}/generate-note/`, {
                    method: 'POST',
                    body: formData
                });
                console.log('Response status:', response.status);
                const result = await response.json();
                console.log('Response result:', result);
                if (!response.ok) {
                    throw new Error(result.detail || 'Note generation failed');
                }
                displayGeneratedNote(result);
                noteSection.style.display = 'block';
                noteSection.scrollIntoView({ behavior: 'smooth' });
                if (result.generated_document_id) {
                    currentGeneratedDocId = result.generated_document_id;
                }
            } catch (err) {
                showStatus('Error: ' + err.message, 'error');
            } finally {
                generateNoteBtn.disabled = false;
                generateNoteBtn.innerHTML = '<i class="fas fa-file-medical"></i> Generate Note';
            }
        });
    }

    function displayGeneratedNote(result) {
        // Create a beautiful formatted note display with proper styling
        const noteHtml = `
            <div class="note-header-info">
                <h4 style="color: #383535; font-family: 'Inter', sans-serif; font-weight: 600; margin-bottom: 16px;">CLINICAL NOTE</h4>
                <p style="color: #383535; font-family: 'Inter', sans-serif; margin-bottom: 8px;"><strong style="color: #383535;">Patient:</strong> ${result.patient_details?.name || 'N/A'}</p>
                <p style="color: #383535; font-family: 'Inter', sans-serif; margin-bottom: 8px;"><strong style="color: #383535;">Date:</strong> ${new Date().toLocaleDateString()}</p>
                <p style="color: #383535; font-family: 'Inter', sans-serif; margin-bottom: 16px;"><strong style="color: #383535;">Provider:</strong> Dr. Iram Sheikh, MD, DO</p>
            </div>
            <div class="note-body" style="color: #383535; font-family: 'Inter', sans-serif; line-height: 1.6;">
                ${result.html_preview || 'Note content will appear here...'}
            </div>
        `;
        
        noteContent.innerHTML = noteHtml;
    }

    if (expandNoteBtn) {
        expandNoteBtn.addEventListener('click', () => {
            const isCollapsed = noteContent.classList.contains('collapsed');
            if (isCollapsed) {
                noteContent.classList.remove('collapsed');
                expandNoteBtn.innerHTML = '<i class="fas fa-compress-alt"></i><span>Collapse</span>';
            } else {
                noteContent.classList.add('collapsed');
                expandNoteBtn.innerHTML = '<i class="fas fa-expand-alt"></i><span>Expand</span>';
            }
        });
    }

    if (downloadNoteBtn) {
        downloadNoteBtn.addEventListener('click', () => {
            if (currentGeneratedDocId) {
                window.open(`${API_BASE_URL}/documents/${currentGeneratedDocId}`, '_blank');
                showStatus('Download initiated.', 'success');
            } else {
                showStatus('No document available for download.', 'error');
            }
        });
    }

    if (newNoteBtn) {
        newNoteBtn.addEventListener('click', () => {
            resetAllSections();
        });
    }

    // --- Patient Management ---
    async function loadAndDisplayPatientsForManagementList() {
        if (!patientListContainer || !patientListPlaceholder) return;
        
        patientListPlaceholder.textContent = "Loading patients...";
        patientListContainer.innerHTML = ''; 
        patientListContainer.appendChild(patientListPlaceholder);

        try {
            const response = await fetch(`${API_BASE_URL}/patients/`);
            if (!response.ok) throw new Error(`Failed to fetch patients (${response.status})`);
            
            const patients = await response.json();
            patientListContainer.innerHTML = ''; 
            
            if (patients.length === 0) {
                patientListPlaceholder.textContent = "No patients found in the database.";
                patientListContainer.appendChild(patientListPlaceholder);
                return;
            }
            
            patients.forEach(patient => {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'patient-list-item';
                let dobDisplay = 'N/A';
                if (patient.dob) {
                    try {
                        dobDisplay = new Date(patient.dob + 'T00:00:00Z').toLocaleDateString(undefined, {timeZone: 'UTC'});
                    } catch(e) {}
                }
                
                itemDiv.innerHTML = `
                    <span><strong>${patient.last_name || ''}, ${patient.first_name || ''}</strong> (ID: ${patient.id}) DOB: ${dobDisplay}, Acct: ${patient.account_no || 'N/A'}</span>
                    <div class="patient-actions"></div>
                `;
                patientListContainer.appendChild(itemDiv);
            });
        } catch (error) {
            console.error("Error loading patients for management:", error);
            patientListPlaceholder.textContent = `Error loading patients: ${error.message}`;
            patientListContainer.innerHTML = '';
            patientListContainer.appendChild(patientListPlaceholder);
        }
    }

    if (refreshPatientListButton) {
        refreshPatientListButton.addEventListener('click', loadAndDisplayPatientsForManagementList);
    }

    if (addPatientForm) {
        addPatientForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            
            const btnText = submitNewPatientButton.querySelector('.btn-text');
            const spinner = submitNewPatientButton.querySelector('.spinner');
            
            if (btnText) btnText.textContent = 'Adding...';
            if (spinner) spinner.style.display = 'inline-block';
            if (submitNewPatientButton) submitNewPatientButton.disabled = true;
            
            showContextualStatus(addPatientStatus, 'Submitting new patient data...', 'info');

            const patientDataObject = {
                first_name: document.getElementById('newPat_firstName').value.trim(),
                last_name: document.getElementById('newPat_lastName').value.trim(),
                dob: document.getElementById('newPat_dob').value.trim() || null,
                sex: document.getElementById('newPat_sex').value || null,
                account_no: document.getElementById('newPat_accountNo').value.trim() || null,
                address1: document.getElementById('newPat_address1').value.trim() || null,
                city: document.getElementById('newPat_city').value.trim() || null,
                state: document.getElementById('newPat_state').value.trim() || null,
                zip_code: document.getElementById('newPat_zip').value.trim() || null,
                cell_phone: document.getElementById('newPat_cellPhone').value.trim() || null,
                email: document.getElementById('newPat_email').value.trim() || null,
                race: document.getElementById('newPat_race').value.trim() || null,
                ethnicity: document.getElementById('newPat_ethnicity').value.trim() || null,
                marital_status: document.getElementById('newPat_maritalStatus').value || null,
                pcp: document.getElementById('newPat_pcp').value.trim() || null,
                ec_name: document.getElementById('newPat_ecName').value.trim() || null,
                ec_relation: document.getElementById('newPat_ecRelation').value.trim() || null,
                ec_phone: document.getElementById('newPat_ecPhone').value.trim() || null,
            };

            const payload = {};
            for (const key in patientDataObject) {
                if (patientDataObject[key] !== null && patientDataObject[key] !== '') {
                    payload[key] = patientDataObject[key];
                }
            }
            
            if (!payload.first_name || !payload.last_name) {
                showContextualStatus(addPatientStatus, 'First Name and Last Name are required.', 'error');
                if (btnText) btnText.textContent = 'Add Patient to Database';
                if (spinner) spinner.style.display = 'none';
                if (submitNewPatientButton) submitNewPatientButton.disabled = false;
                return;
            }

            try {
                const response = await fetch(`${API_BASE_URL}/patients/`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });
                
                const result = await response.json();
                
                if (!response.ok) {
                    let errorMessage = "Failed to add patient.";
                     if (result && result.detail) {
                         if (Array.isArray(result.detail)) {
                             errorMessage = result.detail.map(err => `${err.loc.join('->')}: ${err.msg}`).join('; ');
                         } else {
                             errorMessage = result.detail;
                         }
                     } else {
                        errorMessage = `Server error (${response.status})`;
                     }
                    throw new Error(errorMessage);
                }
                
                showContextualStatus(addPatientStatus, `Patient "${result.first_name} ${result.last_name}" (ID: ${result.id}) added successfully!`, 'success');
                addPatientForm.reset();
                loadAndDisplayPatientsForManagementList(); 
            } catch (error) {
                console.error('Error adding patient:', error);
                showContextualStatus(addPatientStatus, `Error: ${error.message}`, 'error');
            } finally {
                if (btnText) btnText.textContent = 'Add Patient to Database';
                if (spinner) spinner.style.display = 'none';
                if (submitNewPatientButton) submitNewPatientButton.disabled = false;
            }
        });
    }
    
    // --- Utility Functions ---
    function showStatus(message, type = 'info') {
        // Create a temporary status message
        const statusDiv = document.createElement('div');
        statusDiv.className = `status-message status-${type}`;
        statusDiv.textContent = message;
        statusDiv.style.position = 'fixed';
        statusDiv.style.top = '20px';
        statusDiv.style.right = '20px';
        statusDiv.style.zIndex = '10000';
        statusDiv.style.padding = '16px 20px';
        statusDiv.style.borderRadius = '8px';
        statusDiv.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
        
        document.body.appendChild(statusDiv);
        
        setTimeout(() => {
            statusDiv.remove();
        }, 5000);
    }

    function showContextualStatus(element, message, type = 'info') {
        if (!element) return;
        element.textContent = message;
        element.className = `status-message status-${type}`;
        element.style.display = 'block';
    }

    function resetAllSections() {
        // Reset search
        accountNoInput.value = '';
        patientNameInput.value = '';
        patientDobInput.value = '';
        searchResults.style.display = 'none';
        patientList.innerHTML = '';
        
        // Reset transcript
        transcriptSection.style.display = 'none';
        transcriptInfo.style.display = 'none';
        transcriptFile.value = '';
        selectedTranscript = null;
        
        // Reset note
        noteSection.style.display = 'none';
        noteContent.innerHTML = '';
        noteContent.classList.add('collapsed');
        expandNoteBtn.innerHTML = '<i class="fas fa-expand-alt"></i><span>Expand</span>';
        
        // Reset selections
        selectedPatient = null;
        currentGeneratedDocId = null;
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function resetScribeForm() {
        resetAllSections();
    }

    if (showRecordingControlsBtn) {
        showRecordingControlsBtn.addEventListener('click', () => {
            audioRecordingControls.style.display = 'block';
            showRecordingControlsBtn.style.display = 'none';
        });
    }

    if (startRecordingBtn) {
        startRecordingBtn.addEventListener('click', async () => {
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                alert('Audio recording is not supported in this browser.');
                return;
            }
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                mediaRecorder = new MediaRecorder(stream);
                audioChunks = [];
                recordedAudioBlob = null; // Reset blob on new recording
                uploadAudioBtn.disabled = true; // Disable until recording is stopped
                mediaRecorder.ondataavailable = (e) => {
                    if (e.data.size > 0) audioChunks.push(e.data);
                };
                mediaRecorder.onstop = () => {
                    if (audioChunks.length > 0) {
                        recordedAudioBlob = new Blob(audioChunks, { type: 'audio/webm' });
                        console.log('Audio recorded successfully. Blob size:', recordedAudioBlob.size, 'bytes');
                        audioPlayback.src = URL.createObjectURL(recordedAudioBlob);
                        audioPlayback.style.display = 'block';
                        uploadAudioBtn.disabled = false; // Enable after valid recording
                    } else {
                        recordedAudioBlob = null;
                        uploadAudioBtn.disabled = true;
                        console.log('No audio chunks recorded');
                        showStatus('No audio recorded. Please try again.', 'error');
                    }
                };
                mediaRecorder.start();
                startRecordingBtn.disabled = true;
                stopRecordingBtn.disabled = false;
                recordingStatus.style.display = 'inline';
            } catch (err) {
                alert('Could not start audio recording: ' + err.message);
            }
        });
    }

    if (stopRecordingBtn) {
        stopRecordingBtn.addEventListener('click', () => {
            if (mediaRecorder && mediaRecorder.state !== 'inactive') {
                mediaRecorder.stop();
                startRecordingBtn.disabled = false;
                stopRecordingBtn.disabled = true;
                recordingStatus.style.display = 'none';
            }
        });
    }

    // Upload and transcribe audio
    audioPlayback?.addEventListener('ended', async () => {
        // Optionally trigger upload after playback ends
    });

    // --- Upload and transcribe audio ---
    const uploadAudioBtn = document.getElementById('uploadAudioBtn');
    if (uploadAudioBtn) {
        uploadAudioBtn.addEventListener('click', async () => {
            if (!recordedAudioBlob) {
                showStatus('No audio recorded.', 'error');
                return;
            }
            if (!selectedPatient) {
                showStatus('Please select a patient first.', 'error');
                return;
            }
            uploadAudioBtn.disabled = true;
            uploadAudioBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
            try {
                const formData = new FormData();
                formData.append('audio', recordedAudioBlob, 'recording.webm');
                formData.append('patient_first_name', selectedPatient.first_name);
                formData.append('patient_last_name', selectedPatient.last_name);
                formData.append('patient_id', selectedPatient.id);
                // Add date for filename
                const today = new Date();
                const dateStr = today.toISOString().split('T')[0];
                formData.append('date', dateStr);

                const response = await fetch(`${API_BASE_URL}/transcribe-audio/`, {
                    method: 'POST',
                    body: formData
                });
                const result = await response.json();
                if (!response.ok) {
                    throw new Error(result.detail || 'Transcription failed');
                }
                
                // Debug: Log the response to see what we're getting
                console.log('Transcription response:', result);
                
                // result: { transcript, filename }
                if (result.transcript && result.transcript.trim() && result.filename) {
                    // Change the filename to .txt for note generation, but keep .docx for display
                    const txtFilename = result.filename.replace(/\.docx$/, '.txt');
                    selectedTranscript = { name: txtFilename, content: result.transcript };
                    displayTranscriptInfo(result.filename, 'recorded');
                    transcriptInfo.style.display = 'block';
                    // Download the .docx file
                    const downloadUrl = `${API_BASE_URL}/documents/by-filename/${encodeURIComponent(result.filename)}`;
                    const link = document.createElement('a');
                    link.href = downloadUrl;
                    link.download = result.filename;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                } else if (!result.transcript || !result.transcript.trim()) {
                    showStatus('Transcription returned empty text. Please try recording again.', 'error');
                } else {
                    showStatus('Transcript text not found in response.', 'warning');
                }
            } catch (err) {
                showStatus('Error: ' + err.message, 'error');
            } finally {
                uploadAudioBtn.disabled = false;
                uploadAudioBtn.innerHTML = '<i class="fas fa-upload"></i> Transcribe & Save';
            }
        });
        // Style the button for consistent height
        uploadAudioBtn.style.height = '48px';
        uploadAudioBtn.style.fontSize = '17px';
        uploadAudioBtn.style.padding = '8px 24px';
    }
    // Ensure Start and Stop buttons have the same height as Transcribe & Save
    if (startRecordingBtn) {
        startRecordingBtn.style.height = '48px';
        startRecordingBtn.style.fontSize = '17px';
        startRecordingBtn.style.padding = '8px 24px';
    }
    if (stopRecordingBtn) {
        stopRecordingBtn.style.height = '48px';
        stopRecordingBtn.style.fontSize = '17px';
        stopRecordingBtn.style.padding = '8px 24px';
    }

    // --- Initialize ---
    checkLoginStatus();
});