import React from 'react';
import { useNavigate } from 'react-router';
import { FaLock } from 'react-icons/fa';
import { useAuth } from '../Auth/AuthProvider';
import styles from './commonstyles.module.css';

export const UnAuth = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleSignIn = () => {
        logout();
        navigate('/signin');
    };

    return (
        <div className={styles.errorContainer}>
            <div className={styles.errorBackground}></div>
            <div className={styles.errorContent}>
                <div className={styles.errorCard}>
                    <div className={styles.iconContainer}>
                        <FaLock 
                            size={50} 
                            className={styles.unauthorizedIcon}
                        />
                    </div>
                    
                    <h1 className={styles.unauthorizedTitle}>Access Denied</h1>
                    
                    <p className={styles.errorSubtitle}>
                        You don't have permission to access this resource. 
                        Please sign in with proper credentials to continue.
                    </p>
                    
                    <div className={styles.buttonGroup}>
                        <button 
                            onClick={handleSignIn}
                            className={styles.primaryButton}
                        >
                            Return to Sign In
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};