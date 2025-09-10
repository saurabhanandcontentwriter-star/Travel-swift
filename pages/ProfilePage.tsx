import React, { useState, useEffect } from 'react';
import type { User } from '../types';
import { UserIcon, LogoutIcon, CameraIcon, EmailIcon, PhoneIcon, EditIcon } from '../components/icons/Icons';
import CameraUpload from '../components/CameraUpload';

interface ProfilePageProps {
  user: User;
  onLogout: () => void;
  onUpdateProfilePic: (imageDataUrl: string) => void;
  onUpdateProfile: (updatedData: { name: string; phone?: string }) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user, onLogout, onUpdateProfilePic, onUpdateProfile }) => {
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState(user.name);
    const [editedPhone, setEditedPhone] = useState(user.phone || '');
    const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});

    useEffect(() => {
        if (!isEditing) {
            setEditedName(user.name);
            setEditedPhone(user.phone || '');
            setErrors({}); // Clear errors when exiting edit mode
        }
    }, [user, isEditing]);

    useEffect(() => {
        if (isEditing) {
            const newErrors: { name?: string; phone?: string } = {};
            if (editedName.trim().length < 2) {
                newErrors.name = 'Name must be at least 2 characters.';
            }
            if (editedPhone.trim() && !/^\d{10}$/.test(editedPhone.trim())) {
                newErrors.phone = 'Please enter a valid 10-digit phone number.';
            }
            setErrors(newErrors);
        }
    }, [editedName, editedPhone, isEditing]);

    const handleCapture = (imageDataUrl: string) => {
        onUpdateProfilePic(imageDataUrl);
        setIsCameraOpen(false);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (Object.keys(errors).length === 0) {
            onUpdateProfile({ name: editedName.trim(), phone: editedPhone.trim() });
            setIsEditing(false);
        }
    };

    return (
        <>
            <div className="profile-page">
                <div className="profile-header">
                    <div className="profile-picture-container">
                        {user.profilePic ? (
                            <img src={user.profilePic} alt="User profile" className="profile-picture" />
                        ) : (
                            <div className="profile-picture-placeholder">
                                <UserIcon />
                            </div>
                        )}
                        <button className="upload-picture-btn" onClick={() => setIsCameraOpen(true)} aria-label="Upload profile picture">
                            <CameraIcon />
                        </button>
                    </div>
                    <h2>
                        {isEditing ? 'Edit Profile' : 'My Profile'}
                    </h2>
                </div>

                {!isEditing ? (
                    <div className="profile-info">
                        <p><strong>Name:</strong> {user.name}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>Phone:</strong> {user.phone || 'Not provided'}</p>
                    </div>
                ) : (
                    <form className="profile-info-edit" onSubmit={handleSave}>
                        <div className="form-group">
                          <label htmlFor="profile-name">Name</label>
                          <div className="input-wrapper">
                            <span className="icon"><UserIcon /></span>
                            <input
                              type="text"
                              id="profile-name"
                              value={editedName}
                              onChange={e => setEditedName(e.target.value)}
                              placeholder="Enter your name"
                              required
                              aria-invalid={!!errors.name}
                              aria-describedby="name-error"
                            />
                          </div>
                           {errors.name && <p id="name-error" className="error-text" role="alert">{errors.name}</p>}
                        </div>
                        <div className="form-group">
                          <label htmlFor="profile-email">Email (cannot be changed)</label>
                          <div className="input-wrapper">
                            <span className="icon"><EmailIcon /></span>
                            <input
                              type="email"
                              id="profile-email"
                              value={user.email}
                              disabled
                            />
                          </div>
                        </div>
                        <div className="form-group">
                          <label htmlFor="profile-phone">Phone Number</label>
                          <div className="input-wrapper">
                            <span className="icon"><PhoneIcon /></span>
                            <input
                              type="tel"
                              id="profile-phone"
                              value={editedPhone}
                              onChange={e => setEditedPhone(e.target.value)}
                              placeholder="Enter your phone number"
                               aria-invalid={!!errors.phone}
                               aria-describedby="phone-error"
                            />
                          </div>
                          {errors.phone && <p id="phone-error" className="error-text" role="alert">{errors.phone}</p>}
                        </div>
                        <div className="profile-edit-actions">
                            <button type="button" onClick={handleCancelEdit} className="cancel-edit-btn">Cancel</button>
                            <button type="submit" className="save-edit-btn" disabled={Object.keys(errors).length > 0}>
                                Save Changes
                            </button>
                        </div>
                    </form>
                )}
                
                <div className="profile-actions">
                    {!isEditing && (
                         <button onClick={() => setIsEditing(true)} className="action-btn">
                            <EditIcon />
                            Edit Profile
                         </button>
                    )}
                    <button onClick={onLogout} className="logout-btn">
                    <LogoutIcon />
                    Logout
                    </button>
                </div>
            </div>

            {isCameraOpen && (
                <CameraUpload 
                    onCapture={handleCapture}
                    onClose={() => setIsCameraOpen(false)}
                />
            )}
        </>
    );
};

export default ProfilePage;