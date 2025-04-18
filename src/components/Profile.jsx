/* eslint-disable no-unused-vars */
import { useEffect, useState, useContext } from 'react';
import { FaUser, FaEnvelope } from 'react-icons/fa';
import axios from 'axios';
import Recipe from './RecipeFolder/Recipe';
import AuthContext from './AuthContext';
import styles from './Profile.module.css'
import api from '../api/apiConfig';

const Profile = () => {
  const { token } = useContext(AuthContext); 
  const [userRecipes, setUserRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [ratedRecipes, setRatedRecipes] = useState([]);  // New state for rated recipes
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordChangeMessage, setPasswordChangeMessage] = useState('');
  const [showPasswordChangeForm, setShowPasswordChangeForm] = useState(false); 

  useEffect(() => {
    const fetchUserDetails = async() => {
      try {
        const res = await api.get('/api/user-details', {
          headers: {'x-auth-token': token},
        });
        setUserDetails(res.data);
      } catch {
        setError("Error loading user details");
      }
    };

    if(token) {
      fetchUserDetails();
    }
  }, [token]);

  // Fetching user added recipes
  useEffect(() => {
    const fetchUserRecipes = async () => {
      try {
        const res = await api.get('/api/user-recipes', {
          headers: { 'x-auth-token': token }, 
        });
        setUserRecipes(res.data);
      } catch (err) {
        setError('Error loading user recipes');
      } finally {
        setLoading(false);
      }
    };

    if (token) {  // Only fetch if token is available
      fetchUserRecipes();
    }
  }, [token]);

  // Fetching saved recipes
  useEffect(() => {
    const fetchSavedRecipes = async () => {
      try {
        const res = await api.get('/api/user-saved-recipes', {
          headers: { 'x-auth-token': token }, 
        });
        setSavedRecipes(res.data);
      } catch (err) {
        setError('Error loading saved recipes');
      }
    };

    if (token) { 
      fetchSavedRecipes();
    }
  }, [token]);

  // Fetching rated recipes
  useEffect(() => {
    const fetchRatedRecipes = async () => {
      try {
        const res = await api.get('/api/user-rated-recipes', {
          headers: { 'x-auth-token': token }, 
        });
        setRatedRecipes(res.data);
      } catch (err) {
        setError('Error loading rated recipes');
      }
    };

    if (token) { 
      fetchRatedRecipes();
    }
  }, [token]);

  // Handle password change
  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setPasswordChangeMessage('New password and confirm password do not match');
      return;
    }

    try {
      const res = await api.put(
        '/api/change-password',
        { oldPassword, newPassword },
        { headers: { 'x-auth-token': token } }
      );
      setPasswordChangeMessage(res.data.msg);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPasswordChangeMessage('Error changing password');
    }
  };

  const togglePasswordChangeForm = () => {
    setShowPasswordChangeForm(!showPasswordChangeForm);
  };

  return (
    <div>
      {loading ? (
        <h1>Loading...</h1>
      ) : error ? (
        <h1>{error}</h1>
      ) : (
        <>
          <h1>User Details</h1>
          <div className={styles.deatils_pass}> 
            {userDetails && (
              <div className={styles.details}>
                <p><FaUser /> &nbsp; &nbsp;<strong>Name :</strong>&nbsp;{userDetails.username}</p>
                <p><FaEnvelope /> &nbsp; &nbsp;<strong>Email :</strong>&nbsp;{userDetails.email}</p>
              </div>
            )}

            <div>
              <button className={styles.update_btn} onClick={togglePasswordChangeForm}>
                {showPasswordChangeForm ? 'Cancel' : 'Update Password'}
              </button>

              {showPasswordChangeForm && 
                <>
                  <div className={styles.modalBackdrop} onClick={togglePasswordChangeForm}></div> 
                  <div className={styles.formContainer}>
                    <h2>Change Password</h2>
                    {passwordChangeMessage && <p>{passwordChangeMessage}</p>}
                    <form onSubmit={handlePasswordChange}>
                      <div className={styles.form_group}>
                        <input
                          type="password"
                          value={oldPassword}
                          onChange={(e) => setOldPassword(e.target.value)}
                          placeholder="Old Password"
                          required
                        />
                      </div>
                      <div className={styles.form_group}>
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="New Password"
                          required
                        />
                      </div>
                      <div className={styles.form_group}>
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Confirm New Password"
                          required
                        />
                      </div>
                      <button className={styles.submit_btn} type="submit">Change Password</button>
                    </form>
                  </div>
                </>
              }
            </div>
          </div>

          <h1>Your Added Recipes</h1>
          {userRecipes.length === 0 ? (
            <h2>No recipes added yet</h2>
          ) : (
            <Recipe recipes={userRecipes} showRegion={false} group={false}/>
          )}

          <h1>Your Saved Recipes</h1>
          {savedRecipes.length === 0 ? (
            <h2>No saved recipes yet</h2>
          ) : (
            <Recipe recipes={savedRecipes} />
          )} 

          <h1>Your Rated Recipes</h1>
          {ratedRecipes.length === 0 ? (
            <h2>You havent rated any recipes yet</h2>
          ) : (
            <Recipe recipes={ratedRecipes} showRegion={false} group={false} />
          )}
        </>
      )}
    </div>
  );
};

export default Profile;
