import { useEffect, useState } from 'react';
import { FaEdit, FaTimes, FaSave } from 'react-icons/fa';
import { formatDate } from '../../service/Util';
import styles from "../styles.module.css"

interface ReqEditProps {
    show: boolean;
    selectedRow: Request | null;
    handleClose: () => void;
    handleUpdate: (updatedRequest: Request) => void;
    updateRequests: (request: Request) => Promise<void>;
}

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

function EditRequest({ show, selectedRow, handleClose, handleUpdate, updateRequests }: ReqEditProps) {
    const [request, setRequest] = useState<Request>({
        requestId: '',
        userId: '',
        itemName: '',
        description: '',
        location: '',
        date: '',
        itemStatus: '',
        status: ''
    });

    useEffect(() => {
        if (selectedRow) {
            setRequest({...selectedRow});
        }
    }, [selectedRow]);

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setRequest({ ...request, [e.target.name]: e.target.value });
    }

    const handleSave = async () => {
        try {
            await updateRequests(request);
            handleUpdate(request);
            handleClose();
        } catch (error) {
            console.error("Failed to Update request", error)
        }
    }

    if (!show) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContainer}>
                <div className={styles.modalHeader}>
                    <div className={styles.modalHeaderIcon}>
                        <FaEdit size={20} />
                    </div>
                    <h2 className={styles.modalTitle}>Edit Request</h2>
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
                            <label className={styles.inputLabel}>Request ID</label>
                            <input
                                type="text"
                                name="requestId"
                                value={request.requestId}
                                className={`${styles.formInput} ${styles.readOnlyInput}`}
                                readOnly
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.inputLabel}>User ID</label>
                            <input
                                type="text"
                                name="userId"
                                value={request.userId}
                                className={`${styles.formInput} ${styles.readOnlyInput}`}
                                readOnly
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.inputLabel}>Item Name</label>
                            <input
                                type="text"
                                name="itemName"
                                value={request.itemName}
                                onChange={handleOnChange}
                                className={styles.formInput}
                                placeholder="Enter item name"
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.inputLabel}>Description</label>
                            <textarea
                                name="description"
                                value={request.description}
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
                                value={request.location}
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
                                value={formatDate(request.date)}
                                onChange={handleOnChange}
                                className={styles.formInput}
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.inputLabel}>Item Status</label>
                            <select
                                name="itemStatus"
                                value={request.itemStatus}
                                onChange={handleOnChange}
                                className={styles.formSelect}
                            >
                                <option value="LOST">LOST</option>
                                <option value="FOUND">FOUND</option>
                            </select>
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.inputLabel}>Request Status</label>
                            <select
                                name="status"
                                value={request.status}
                                onChange={handleOnChange}
                                className={styles.formSelect}
                            >
                                <option value="PENDING">PENDING</option>
                                <option value="REJECTED">REJECTED</option>
                                <option value="APPROVED">APPROVED</option>
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
                        Update Request
                    </button>
                </div>
            </div>
        </div>
    );
}

export default EditRequest;