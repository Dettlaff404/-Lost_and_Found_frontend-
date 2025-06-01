import { useState, useEffect } from 'react';
import { FaPlus, FaTimes, FaSave } from 'react-icons/fa';
import styles from "../styles.module.css"
import { useAuth } from '../Auth/AuthProvider';
import Swal from 'sweetalert2';

interface Request {
    requestId: string;
    userId: string;
    itemName: string;
    description: string;
    location: string;
    date: string;
    itemStatus: string;
    status: string;
}

function AddRequest({ show, handleClose, handleAdd, addRequest }: any) {

    const { userId, isLoading } = useAuth();

    const [newRequest, setNewRequest] = useState<Request>({
        requestId: '',
        userId: '',
        itemName: '',
        description: '',
        location: '',
        date: '',
        itemStatus: '',
        status: ''
    });

    // Update userId in request when it becomes available
    useEffect(() => {
        if (userId) {
            setNewRequest(prev => ({ ...prev, userId }));
        }
    }, [userId]);

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setNewRequest({ ...newRequest, [e.target.name]: e.target.value });
    }

    const handleOnSubmit = async () => {
        if (!userId) {
            console.error("User ID is not available yet");
            return;
        }

        try {
            console.log(newRequest)
            const newRequestDetails = await addRequest(newRequest);
            handleAdd(newRequestDetails)
            handleClose()

            setNewRequest({
                requestId: '',
                userId: userId as string,
                itemName: '',
                description: '',
                location: '',
                date: '',
                itemStatus: '',
                status: ''
            });
        } catch (err) {
            console.error("Failed to Add the Request", err)
            await Swal.fire({
                title: 'Invalid Input Data',
                text: "Please check whether all fields are filled correctly.",
                icon: 'error',
                confirmButtonColor: '#d33',
                confirmButtonText: 'Try Again'
            });
        }
    }

    if (!show) return null;

    // Show loading if auth is still loading or userId is not yet available
    if (isLoading || !userId) {
        return (
            <div className={styles.modalOverlay}>
                <div className={styles.modalContainer}>
                    <div className={styles.modalHeader}>
                        <h2 className={styles.modalTitle}>Loading...</h2>
                        <button
                            className={styles.modalCloseButton}
                            onClick={handleClose}
                        >
                            <FaTimes size={18} />
                        </button>
                    </div>
                    <div className={styles.modalBody}>
                        <p>Please wait while we load your information...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContainer}>
                <div className={styles.modalHeader}>
                    <div className={styles.modalHeaderIcon}>
                        <FaPlus size={20} />
                    </div>
                    <h2 className={styles.modalTitle}>Create New Request</h2>
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
                            <label className={styles.inputLabel}>Item Name</label>
                            <input
                                type="text"
                                name="itemName"
                                value={newRequest.itemName}
                                onChange={handleOnChange}
                                className={styles.formInput}
                                placeholder="Enter item name"
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.inputLabel}>Description</label>
                            <textarea
                                name="description"
                                value={newRequest.description}
                                onChange={handleOnChange}
                                className={styles.formTextarea}
                                placeholder="Describe the item"
                                rows={3}
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.inputLabel}>Location</label>
                            <input
                                type="text"
                                name="location"
                                value={newRequest.location}
                                onChange={handleOnChange}
                                className={styles.formInput}
                                placeholder="Where was it lost/found?"
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.inputLabel}>Date</label>
                            <input
                                type="date"
                                name="date"
                                value={newRequest.date}
                                onChange={handleOnChange}
                                className={styles.formInput}
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.inputLabel}>Item Status</label>
                            <select
                                name="itemStatus"
                                value={newRequest.itemStatus}
                                onChange={handleOnChange}
                                className={styles.formSelect}
                            >
                                <option value="">Select Status</option>
                                <option value="LOST">LOST</option>
                                <option value="FOUND">FOUND</option>
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
                        disabled={!userId}
                    >
                        <FaSave size={14} />
                        Save Request
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AddRequest;