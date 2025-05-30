import React from 'react';
import { useNavigate } from 'react-router';
import { FaExclamationTriangle } from 'react-icons/fa';
import styles from './commonstyles.module.css';
import { useAuth } from '../Auth/AuthProvider';

const NotFound = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleGoBack = () => {
        window.history.back();
    };

    const handleGoHome = () => {
        logout();
        navigate('/');
    };

    return (
        <div className={styles.errorContainer}>
            <div className={styles.errorBackground}></div>
            <div className={styles.errorContent}>
                <div className={styles.errorCard}>
                    <div className={styles.iconContainer}>
                        <FaExclamationTriangle 
                            size={50} 
                            className={styles.notFoundIcon}
                        />
                    </div>
                    
                    <h1 className={styles.notFoundTitle}>404 - Page Not Found</h1>
                    
                    <p className={styles.errorSubtitle}>
                        Oops! The page you're looking for seems to have wandered off into the digital abyss. 
                        It might have been moved, deleted, or you entered the wrong URL.
                    </p>
                    
                    <div className={styles.buttonGroup}>
                        <button 
                            onClick={handleGoHome}
                            className={styles.primaryButton}
                        >
                            Return to Home
                        </button>
                        <button 
                            onClick={handleGoBack}
                            className={styles.secondaryButton}
                        >
                            Go Back
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotFound;