import React, { useState, useRef, useEffect } from 'react';
import styles from '../src/styles/employeeprofile.module.css';

interface Field {
  id: string;
  label: string;
  value: string;
}

interface CitizenshipField {
  id: string;
  value: string;
}

const EmployeeProfile: React.FC = () => {
  const [profileImage, setProfileImage] = useState<string>('/transparent-background.jpg');
  const [citizenshipFields, setCitizenshipFields] = useState<CitizenshipField[]>([]);
  const [editingEnabled, setEditingEnabled] = useState<boolean>(false);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<number>(1);

  const [personalFields, setPersonalFields] = useState<Field[]>([
    { id: 'dob', label: 'Date of Birth', value: 'Not Set' },
    { id: 'mobile', label: 'Mobile No.', value: 'Not Set' },
    { id: 'philhealth', label: 'PhilHealth No.', value: 'Not Set' },
    { id: 'pagibig', label: 'Pag-IBIG No.', value: 'Not Set' },
    { id: 'emergency', label: 'Emergency No.', value: 'Not Set' },
    { id: 'bpi', label: 'BPI Account No.', value: 'Not Set' },
    { id: 'sss', label: 'SSS No.', value: 'Not Set' }
  ]);

  const [mainFields, setMainFields] = useState<Field[]>([
    { id: 'position', label: 'Position', value: 'Not Set' },
    { id: 'department', label: 'Department', value: 'Not Set' },
    { id: 'status', label: 'Status', value: 'Not Set' },
    { id: 'begin', label: 'Begin Date', value: 'Not Set' },
    { id: 'end', label: 'End Date', value: 'Not Set' }
  ]);

  // Modal form states
  const [newFieldLabel, setNewFieldLabel] = useState<string>('');
  const [newFieldValue, setNewFieldValue] = useState<string>('');
  const [selectedSection, setSelectedSection] = useState<string>('personal');
  const [deleteSection, setDeleteSection] = useState<string>('personal');
  const [selectedDeleteLabel, setSelectedDeleteLabel] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle profile image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle citizenship field addition
  const addCitizenshipField = () => {
    const newField: CitizenshipField = {
      id: Date.now().toString(),
      value: 'Not Set'
    };
    setCitizenshipFields([...citizenshipFields, newField]);
  };

  // Handle citizenship field update
  const updateCitizenshipField = (id: string, value: string) => {
    setCitizenshipFields(fields => 
      fields.map(field => 
        field.id === id ? { ...field, value } : field
      )
    );
  };

  // Handle citizenship field removal
  const removeCitizenshipField = (id: string) => {
    setCitizenshipFields(fields => fields.filter(field => field.id !== id));
  };

  // Handle text input validation
  const validateInput = (value: string, label: string): boolean => {
    if (label.toLowerCase().includes('no.')) {
      return /^[0-9]*$/.test(value);
    } else if (label.toLowerCase().includes('date')) {
      return /^[0-9\/\-\.\s]*$/.test(value);
    } else {
      return /^[a-zA-Z0-9\s]*$/.test(value);
    }
  };

  // Handle label validation
  const validateLabel = (value: string): boolean => {
    return /^[a-zA-Z0-9\s\.\-]*$/.test(value);
  };

  // Handle adding new field
  const handleAddField = () => {
    if (!newFieldLabel.trim() || !newFieldValue.trim()) {
      alert('Both label and value are required.');
      return;
    }

    const newField: Field = {
      id: Date.now().toString(),
      label: newFieldLabel.trim(),
      value: newFieldValue.trim()
    };

    if (selectedSection === 'personal') {
      setPersonalFields([...personalFields, newField]);
    } else {
      setMainFields([...mainFields, newField]);
    }

    setNewFieldLabel('');
    setNewFieldValue('');
    setSelectedSection('personal');
    setShowAddModal(false);
  };

  // Handle deleting field
  const handleDeleteField = () => {
    if (deleteSection === 'personal') {
      setPersonalFields(fields => fields.filter(field => field.label !== selectedDeleteLabel));
    } else {
      setMainFields(fields => fields.filter(field => field.label !== selectedDeleteLabel));
    }
    setShowDeleteModal(false);
  };

  // Get available labels for deletion
  const getAvailableLabels = (section: string) => {
    const fields = section === 'personal' ? personalFields : mainFields;
    return fields.map(field => field.label);
  };

  // Update delete label options when section changes
  useEffect(() => {
    const availableLabels = getAvailableLabels(deleteSection);
    if (availableLabels.length > 0) {
      setSelectedDeleteLabel(availableLabels[0]);
    } else {
      setSelectedDeleteLabel('');
    }
  }, [deleteSection, personalFields, mainFields]);

  // Handle field value update
  const updateFieldValue = (section: string, id: string, value: string) => {
    if (section === 'personal') {
      setPersonalFields(fields => 
        fields.map(field => 
          field.id === id ? { ...field, value } : field
        )
      );
    } else {
      setMainFields(fields => 
        fields.map(field => 
          field.id === id ? { ...field, value } : field
        )
      );
    }
  };

  // Handle field label update
  const updateFieldLabel = (section: string, id: string, label: string) => {
    if (section === 'personal') {
      setPersonalFields(fields => 
        fields.map(field => 
          field.id === id ? { ...field, label } : field
        )
      );
    } else {
      setMainFields(fields => 
        fields.map(field => 
          field.id === id ? { ...field, label } : field
        )
      );
    }
  };

  // Arrow button handlers
  const handleLeftArrow = () => {
    if (currentRow > 1) {
      setCurrentRow(currentRow - 1);
    }
  };

  const handleRightArrow = () => {
    setCurrentRow(currentRow + 1);
  };

  // Default fields component
  const DefaultField: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div className={styles.fieldFormat}>
      <div className={styles.personalInfoFormat}>
        <span 
          className={`${styles.infoLabel} ${editingEnabled ? styles.editable : ''}`}
          contentEditable={editingEnabled}
          suppressContentEditableWarning={true}
          onInput={(e) => {
            const value = e.currentTarget.textContent || '';
            if (!validateLabel(value)) {
              e.currentTarget.textContent = value.slice(0, -1);
            }
          }}
        >
          {label}
        </span>
        <div 
          className={`${styles.infoTextbox} ${editingEnabled ? styles.editable : ''}`}
          contentEditable={editingEnabled}
          suppressContentEditableWarning={true}
          onInput={(e) => {
            const inputValue = e.currentTarget.textContent || '';
            if (!validateInput(inputValue, label)) {
              e.currentTarget.textContent = inputValue.slice(0, -1);
            }
          }}
        >
          {value}
        </div>
      </div>
      <hr
        style={{
          marginTop: '1px',
          width: '600px',
          height: '2px',
          border: 'none',
          background: 'linear-gradient(to right, transparent, rgba(0, 0, 0, 0.25), transparent)'
        }}
      />
    </div>
  );

  // Dynamic field component
  const DynamicField: React.FC<{ field: Field; section: string }> = ({ field, section }) => (
    <div className={styles.fieldFormat}>
      <div className={section === 'personal' ? styles.personalInfoFormat : styles.mainInfoFormat}>
        <span 
          className={`${styles.infoLabel} ${editingEnabled ? styles.editable : ''}`}
          contentEditable={editingEnabled}
          suppressContentEditableWarning={true}
          onInput={(e) => {
            const value = e.currentTarget.textContent || '';
            if (validateLabel(value)) {
              updateFieldLabel(section, field.id, value);
            } else {
              e.currentTarget.textContent = field.label;
            }
          }}
        >
          {field.label}
        </span>
        <div 
          className={`${styles.infoTextbox} ${editingEnabled ? styles.editable : ''}`}
          contentEditable={editingEnabled}
          suppressContentEditableWarning={true}
          onInput={(e) => {
            const value = e.currentTarget.textContent || '';
            if (validateInput(value, field.label)) {
              updateFieldValue(section, field.id, value);
            } else {
              e.currentTarget.textContent = field.value;
            }
          }}
        >
          {field.value}
        </div>
      </div>
      <hr
        style={{
          marginTop: '1px',
          width: '600px',
          height: '2px',
          border: 'none',
          background: 'linear-gradient(to right, transparent, rgba(0, 0, 0, 0.25), transparent)'
        }}
      />
    </div>
  );

  return (
    <div className={styles.employeeBoxFormat}>
      {/* Profile Picture Frame */}
      <div className={styles.profileFormatBox}>
        {/* Picture & Name & Email */}
        <div className={styles.nameImageFrame}>
          <label htmlFor="profileImageInput" style={{ cursor: 'pointer' }}>
            <img
              id="profileImage"
              className={styles.transparentBackgroundIcon}
              src={profileImage}
              alt="Profile"
            />
          </label>
          <input
            ref={fileInputRef}
            type="file"
            id="profileImageInput"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleImageUpload}
          />
          <span className={styles.fullName}>Dave Smith</span>
          <span className={styles.email}>davesmith@gmail.com</span>
        </div>

        {/* ID Title & Number */}
        <div className={styles.idFrame}>
          <span className={styles.idTitle}>ID</span>
          <span className={styles.idNumber}>12124680</span>
        </div>

        {/* Notes Title & Icon & Textbox */}
        <div className={styles.notesFrame}>
          <div className={styles.iconTitleBox}>
            <img
              src="/notes-icon.svg"
              alt="Notes-Icon"
              width="24"
              height="24"
            />
            <span className={styles.notesTitle}>Notes</span>
          </div>
          <hr
            style={{
              marginTop: '4px',
              marginBottom: '8px',
              width: '150px',
              height: '2px',
              border: 'none',
              background: 'linear-gradient(to right, transparent, rgba(0, 0, 0, 0.25), transparent)'
            }}
          />
          <textarea className={styles.notesTextArea}></textarea>
        </div>

        {/* Row Title & Number & Arrows */}
        <div className={styles.currentRowFrame}>
          <button className={styles.arrowLeftButton} onClick={handleLeftArrow}>
            <img
              src="/arrow-icon.svg"
              alt="Arrow-Icon"
              width="24"
              height="24"
            />
          </button>
          <span className={styles.currentRowTitle}>Current Row</span>
          <span className={styles.rowNumber}>{currentRow}</span>
          <button className={styles.arrowRightButton} onClick={handleRightArrow}>
            <img
              src="/arrow-icon.svg"
              alt="Arrow-Icon"
              width="24"
              height="24"
            />
          </button>
        </div>
      </div>

      {/* Profile Information Frame */}
      <div className={styles.backgroundFrameBox}>
        {/* Background Title & Buttons */}
        <div className={styles.backgroundHeader}>
          <span className={styles.employeeTitle}>Employee Details</span>
          <div className={styles.buttonHeaderFrame}>
            <div className={styles.addButtonFormat}>
              <img
                src="/add-icon.svg"
                alt="Add-Icon"
                width="24"
                height="24"
              />
              <button className={styles.addInfoButton} onClick={() => setShowAddModal(true)}>
                Add Info
              </button>
            </div>
            <div className={styles.editButtonFormat}>
              <img
                src="/edit-icon.svg"
                alt="Edit-Icon"
                width="24"
                height="24"
              />
              <button className={styles.editInfoButton} onClick={() => setEditingEnabled(!editingEnabled)}>
                Edit Info
              </button>
            </div>
            <div className={styles.deleteButtonFormat}>
              <img
                src="/delete-icon.svg"
                alt="Delete-Icon"
                width="24"
                height="24"
              />
              <button className={styles.deleteInfoButton} onClick={() => setShowDeleteModal(true)}>
                Delete Info
              </button>
            </div>
          </div>
        </div>

        {/* Information Body */}
        <div className={styles.informationBody}>
          {/* Personal Information Frame */}
          <div className={styles.personalInformationBox}>
            {/* Personal Header */}
            <div className={styles.personalInformationHeader}>
              <span className={styles.personalInformationTitle}>Personal Information</span>
              <hr
                style={{
                  paddingTop: '5px',
                  width: '550px',
                  height: '2px',
                  border: 'none',
                  background: 'linear-gradient(to right, transparent, rgba(0, 0, 0, 0.25), transparent)'
                }}
              />
            </div>

            {/* Personal Body */}
            <div className={styles.personalInformationFrame}>
              <div className={styles.infoTextboxContainer}>
                
              </div>
              {personalFields.map((field, index) => (
              <React.Fragment key={field.id}>
                <DynamicField field={field} section="personal" />
                
                {field.label === 'Date of Birth' && (
                  <div className={styles.fieldFormat} id="citizenship-field">
                    <div className={styles.personalInfoFormat}>
                      <div className={styles.citizenshipLabel}>
                        <span className={styles.infoLabel}>Citizenship</span>
                        <button className={styles.citizenshipButton} onClick={addCitizenshipField}>
                          <img
                            src="/add-icon.svg"
                            alt="Add-Icon"
                            width="24"
                            height="24"
                          />
                        </button>
                      </div>
                      <div className={styles.infoTextbox}>Not Set</div>
                    </div>

                    {citizenshipFields.length > 0 && (
                      <div className={styles.infoTextboxContainer}>
                        {citizenshipFields.map((field) => (
                          <div
                            key={field.id}
                            className={styles.infoTextbox}
                            contentEditable={true}
                            suppressContentEditableWarning={true}
                            style={{ marginTop: '5px' }}
                            onInput={(e) => {
                              const value = e.currentTarget.textContent || '';
                              if (/^[a-zA-Z\s]*$/.test(value)) {
                                updateCitizenshipField(field.id, value);
                              } else {
                                e.currentTarget.textContent = field.value;
                              }
                            }}
                            onBlur={(e) => {
                              const value = e.currentTarget.textContent?.trim() || '';
                              if (!value || value.toLowerCase() === 'not set') {
                                removeCitizenshipField(field.id);
                              }
                            }}
                          >
                            {field.value}
                          </div>
                        ))}
                      </div>
                    )}

                    <hr
                      className={styles.citizenshipHR}
                      style={{
                        marginTop: '1px',
                        width: '600px',
                        height: '2px',
                        border: 'none',
                        background: 'linear-gradient(to right, transparent, rgba(0, 0, 0, 0.25), transparent)'
                      }}
                    />
                  </div>
                )}
              </React.Fragment>
            ))}
            </div>
          </div>

          {/* Main Information Frame */}
          <div className={styles.mainInformationBox}>
            {/* Main Header */}
            <div className={styles.mainInformationHeader}>
              <span className={styles.mainInformationTitle}>Main Information</span>
              <hr
                style={{
                  paddingTop: '5px',
                  width: '550px',
                  height: '2px',
                  border: 'none',
                  background: 'linear-gradient(to right, transparent, rgba(0, 0, 0, 0.25), transparent)'
                }}
              />
            </div>

            {/* Main Body */}
            <div className={styles.mainInformationFrame}>
              {mainFields.map((field) => (
                <DynamicField key={field.id} field={field} section="main" />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add Info Modal */}
      {showAddModal && (
        <div className={styles.modalFrame}>
          <div className={styles.modalContent}>
            <h2 className={styles.modalHeader}>Additional Information</h2>
            <hr
              style={{
                marginTop: '1px',
                width: '350px',
                height: '2px',
                border: 'none',
                background: 'linear-gradient(to right, transparent, rgba(0, 0, 0, 0.25), transparent)'
              }}
            />
            <div className={styles.modalBody}>
              <label>Label:</label>
              <input
                type="text"
                className={styles.modalInput}
                placeholder="Enter label"
                value={newFieldLabel}
                onChange={(e) => setNewFieldLabel(e.target.value)}
              />

              <label>Value:</label>
              <input
                type="text"
                className={styles.modalInput}
                placeholder="Enter value"
                value={newFieldValue}
                onChange={(e) => setNewFieldValue(e.target.value)}
              />

              <label>Section:</label>
              <select 
                className={styles.dropdownFormat}
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
              >
                <option value="personal">Personal Information</option>
                <option value="main">Main Information</option>
              </select>
            </div>

            <div className={styles.modalFooter}>
              <button 
                className={`${styles.modalButton} ${styles.cancel}`}
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>
              <button 
                className={`${styles.modalButton} ${styles.save}`}
                onClick={handleAddField}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Info Modal */}
      {showDeleteModal && (
        <div className={styles.modalFrame}>
          <div className={styles.modalContent}>
            <h2 className={styles.modalHeader}>Delete Information</h2>
            <div className={styles.modalBody}>
              <label>Section:</label>
              <select 
                className={styles.dropdownFormat}
                value={deleteSection}
                onChange={(e) => setDeleteSection(e.target.value)}
              >
                <option value="personal">Personal Information</option>
                <option value="main">Main Information</option>
              </select>

              <label>Label to Delete:</label>
              <select 
                className={styles.dropdownFormat}
                value={selectedDeleteLabel}
                onChange={(e) => setSelectedDeleteLabel(e.target.value)}
              >
                {getAvailableLabels(deleteSection).length > 0 ? (
                  getAvailableLabels(deleteSection).map((label) => (
                    <option key={label} value={label}>{label}</option>
                  ))
                ) : (
                  <option disabled>No deletable fields available</option>
                )}
              </select>
            </div>

            <div className={styles.modalFooter}>
              <button 
                className={`${styles.modalButton} ${styles.cancel}`}
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button 
                className={`${styles.modalButton} ${styles.save}`}
                onClick={handleDeleteField}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeProfile;