import { useState } from 'react';
import { FaUserPlus, FaTimes, FaSave, FaEye, FaEyeSlash } from 'react-icons/fa';
import styles from "../styles.module.css"

interface User {
    userId: string;
    fullname: string;
    email: string;
    mobile: string;
    password: string;
    role: string;
}

function AddUser({ show, handleClose, handleAdd, addUser }: any) {
    //state management
    const [newUser, setNewUser] = useState<User>({
        userId: '',
        fullname: '',
        email: '',
        mobile: '',
        password: '',
        role: ''
    });

    const [showPassword, setShowPassword] = useState(false);

    //add user data from the form
    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setNewUser({ ...newUser, [e.target.name]: e.target.value });
    }

    //handle the add user process with the back-end
    const handleOnSubmit = async () => {
        try {
            const newUserDetails = await addUser(newUser);
            handleAdd(newUserDetails)
            handleClose()

            setNewUser({
                userId: '',
                fullname: '',
                email: '',
                mobile: '',
                password: '',
                role: ''
            });

        } catch (err) {
            console.error("Failed to Add the User", err)
        }
    }

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    }

    if (!show) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContainer}>
                <div className={styles.modalHeader}>
                    <div className={styles.modalHeaderIcon}>
                        <FaUserPlus size={20} />
                    </div>
                    <h2 className={styles.modalTitle}>Register a New User</h2>
                    <button 
                        className={styles.modalCloseButton}
                        onClick={handleClose}
                    >
                        <FaTimes size={18} />
                    </button>
                </div>

                <div className={styles.modalBody}>
                    <div className={styles.formContainer}>
                        <div className={styles.inputGroup}>
                            <label className={styles.inputLabel}>Full Name</label>
                            <input
                                type="text"
                                name="fullname"
                                value={newUser.fullname}
                                onChange={handleOnChange}
                                className={styles.formInput}
                                placeholder="Enter full name"
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.inputLabel}>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={newUser.email}
                                onChange={handleOnChange}
                                className={styles.formInput}
                                placeholder="Enter email address"
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.inputLabel}>Mobile</label>
                            <input
                                type="text"
                                name="mobile"
                                value={newUser.mobile}
                                onChange={handleOnChange}
                                className={styles.formInput}
                                placeholder="Enter mobile number"
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.inputLabel}>Password</label>
                            <div className={styles.passwordInputContainer}>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={newUser.password}
                                    onChange={handleOnChange}
                                    className={`${styles.formInput} ${styles.passwordInput}`}
                                    placeholder="Enter password"
                                />
                                <button
                                    type="button"
                                    className={styles.passwordToggleButton}
                                    onClick={togglePasswordVisibility}
                                >
                                    {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                                </button>
                            </div>
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.inputLabel}>User Role</label>
                            <select
                                name="role"
                                value={newUser.role}
                                onChange={handleOnChange}
                                className={styles.formSelect}
                            >
                                <option value="">Select the User Role</option>
                                <option value="ADMIN">ADMIN</option>
                                <option value="STAFF">STAFF</option>
                                <option value="USER">USER</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className={styles.modalFooter}>
                    <button 
                        className={styles.modalSecondaryButton}
                        onClick={handleClose}
                    >
                        <FaTimes size={14} />
                        Cancel
                    </button>
                    <button 
                        className={styles.modalPrimaryButton}
                        onClick={handleOnSubmit}
                    >
                        <FaSave size={14} />
                        Save User
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AddUser;