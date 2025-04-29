import React, { useState, useEffect } from "react";
import { auth } from "../requests/firebase_db";
import { useNavigate } from "react-router-dom";
import { signOut, updateProfile } from "firebase/auth";

const getImage = (imageName) => {
    return new URL(`../assets/${imageName}.jpg`, import.meta.url).href;
};

const normalizeMembership = (dateString) => {
    const date = new Date(dateString);

    const options = { month: 'long', year: 'numeric' };
    return date.toLocaleDateString('en-US', options).toUpperCase();
}

const ProfilePage = ({ user }) => {
    const [isEdit, setEdit] = useState(false)
    const [newName, setNewName] = useState("")
    const [newSurname, setNewSurname] = useState("")
    const navigate = useNavigate()

    const handleLogOut = async () => {
        try {
            await signOut(auth);
            navigate("/");
          } catch (error) {
            console.error("Error signing out:", error);
          }
    }

    const handleEdit = () => {
        setEdit((prev) => !prev)
    }

    const handleChangeName = (e) => {
        setNewName(e.target.value)
    }

    const handleChangeSurname = (e) => {
        setNewSurname(e.target.value)
    }

    const handleSave = async () => {
        try {

            if (newName || newSurname) {
                const name = newName || user.displayName.split(" ")[0];
                const surname = newSurname || user.displayName.split(" ")[1] || "";
                await updateProfile(user, { displayName: `${name} ${surname}` });
            }

            setEdit(false);
            } catch (error) {
            console.error("Failed to update profile:", error.message);
        }
    };


    return (<>
        <div className="profile-page-wrapper">
            <h1 className="profile-page-title">My Profile</h1>
            <div className="profile-page-data">
                <div className="profile-user-bio">
                    <div className="profile-page-avatar-wrapper"><img className="profile-page-avatar" src={getImage("avatar")} alt="profile-avatar"/></div>
                        <h1 className="profile-username">{user.displayName}</h1>
                        <span className="profile-membership-date">MEMBER SINCE {normalizeMembership(user.metadata.creationTime)}</span>
                </div>
                <div className="profile-page-userInfo">
                    <h2 className="profile-page-userInfo-title">Profile Information</h2>
                    <div className="profile-page-field">
                        <span className="profile-page-label">Name:</span>
                        {isEdit ? <input className="profile-page-edit-input" placeholder={user.displayName.split(' ')[0]} value={newName} onChange={handleChangeName} /> : <span className="profile-page-value">{user.displayName.split(' ')[0]}</span>}
                    </div>
                    <div className="profile-page-field">
                        <span className="profile-page-label">Surname:</span>
                        {isEdit ? <input className="profile-page-edit-input" placeholder={user.displayName.split(' ')[1]} value={newSurname} onChange={handleChangeSurname} /> : <span className="profile-page-value">{user.displayName.split(' ')[1]}</span>}
                    </div>
                    <div className="profile-page-field">
                        <span className="profile-page-label">Email:</span>
                        {isEdit ? <input className="profile-page-edit-input" placeholder="Change email is unavailable" readOnly /> : <span className="profile-page-value">{user.email}</span>}
                    </div>
                    <div className="profile-page-field">
                        <span className="profile-page-label">Account ID:</span>
                        <span className="profile-page-value">{user.uid}</span>
                    </div>
                    <div className="profile-page-btns-wrapper">{isEdit ? <button className="profile-edit" onClick={handleSave}>Save</button> : <button className="profile-edit" onClick={handleEdit}>Edit</button>}<button className="profile-quit" onClick={handleLogOut}>Quit</button></div>
                </div>
            </div>
        </div>
    </>)
}

export default ProfilePage;