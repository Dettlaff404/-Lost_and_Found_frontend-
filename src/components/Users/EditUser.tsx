import { useEffect, useState } from 'react';
import { FaEdit, FaTimes, FaSave, FaEye, FaEyeSlash } from 'react-icons/fa';
import styles from "../styles.module.css"

interface UserEditProps {
    show: boolean;
    selectedRow: User | null;
    handleClose: () => void;
    handleUpdate: (updatedUser: User) => void;
    updateUsers: (user: User) => Promise<void>;
}

interface User {
    userId: string;
    fullname: string;
    email: string;
    mobile: string;
    password: string;
    role: string;
}

function EditUser({ show, selectedRow, handleClose, handleUpdate, updateUsers }: UserEditProps) {

    //state management
    const [user, setUser] = useState<User>({
        userId: '',
        fullname: '',
        email: '',
        mobile: '',
        password: '',
        role: ''
    });

    // Password visibility state
    const [showPassword, setShowPassword] = useState(false);

    //load data when componenet mounts
    useEffect(() => {
        if (selectedRow) {
            setUser({...selectedRow});
        }
    }, [selectedRow]);

    //add user data from the form
    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    }

    //handle the save/update
    const handleSave = async () => {
        try {
            await updateUsers(user);
            handleUpdate(user);
            handleClose();
        } catch (error) {
            console.error("Failed to Update user", error)
        }
    }

    // Toggle password visibility
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    }

    if (!show) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContainer}>
                <div className={styles.modalHeader}>
                    <div className={styles.modalHeaderIcon}>
                        <FaEdit size={20} />
                    </div>
                    <h2 className={styles.modalTitle}>Edit User Details</h2>
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
                            <label className={styles.inputLabel}>User ID</label>
                            <input
                                type="text"
                                name="userId"
                                value={user.userId}
                                className={`${styles.formInput} ${styles.readOnlyInput}`}
                                readOnly
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.inputLabel}>Full Name</label>
                            <input
                                type="text"
                                name="fullname"
                                value={user.fullname}
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
                                value={user.email}
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
                                value={user.mobile}
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
                                    value={user.password}
                                    onChange={handleOnChange}
                                    className={`${styles.formInput} ${styles.passwordInput}`}
                                    placeholder="Enter password"
                                />
                                <button
                                    type="button"
                                    className={styles.passwordToggleButton}
                                    onClick={togglePasswordVisibility}
                                    title={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                                </button>
                            </div>
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.inputLabel}>User Role</label>
                            <select
                                name="role"
                                value={user.role}
                                onChange={handleOnChange}
                                className={styles.formSelect}
                            >
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
                        onClick={handleSave}
                    >
                        <FaSave size={14} />
                        Update User
                    </button>
                </div>
            </div>
        </div>
    );
}

export default EditUser;