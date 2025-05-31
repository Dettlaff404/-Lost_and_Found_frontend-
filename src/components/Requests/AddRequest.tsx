import { useState } from 'react';
import { FaPlus, FaTimes, FaSave } from 'react-icons/fa';
import styles from "../styles.module.css"

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
    const [newRequest, setNewRequest] = useState<Request>({
        requestId: '',
        userId: (localStorage.getItem('lofUserId') as string),
        itemName: '',
        description: '',
        location: '',
        date: '',
        itemStatus: '',
        status: ''
    });

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setNewRequest({ ...newRequest, [e.target.name]: e.target.value });
    }

    const handleOnSubmit = async () => {
        try {
            console.log(newRequest)
            const newRequestDetails = await addRequest(newRequest);
            handleAdd(newRequestDetails)
            handleClose()

            setNewRequest({
                requestId: '',
                userId: (localStorage.getItem('lofUserId') as string),
                itemName: '',
                description: '',
                location: '',
                date: '',
                itemStatus: '',
                status: ''
            });
        } catch (err) {
            console.error("Failed to Add the Request", err)
        }
    }

    if (!show) return null;

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