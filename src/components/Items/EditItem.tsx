import { useEffect, useState } from 'react';
import { FaEdit, FaTimes, FaSave } from 'react-icons/fa';
import { formatDate } from '../../service/Util';
import styles from "../styles.module.css"

interface ItemEditProps {
    show: boolean;
    selectedRow: Item | null;
    handleClose: () => void;
    handleUpdate: (updatedItem: Item) => void;
    updateItems: (item: Item) => Promise<void>;
}

interface Item {
    itemId: string;
    requestId: string;
    claimedUserId: string;
    itemName: string;
    description: string;
    location: string;
    date: string;
    status: string;
}

function EditItem({ show, selectedRow, handleClose, handleUpdate, updateItems }: ItemEditProps) {
    const [item, setItem] = useState<Item>({
        itemId: '',
        requestId: '',
        claimedUserId: '',
        itemName: '',
        description: '',
        location: '',
        date: '',
        status: ''
    });

    useEffect(() => {
        if (selectedRow) {
            setItem({...selectedRow});
        }
    }, [selectedRow]);

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setItem({ ...item, [e.target.name]: e.target.value });
    }

    const handleSave = async () => {
        try {
            await updateItems(item);
            handleUpdate(item);
            handleClose();
        } catch (error) {
            console.error("Failed to Update item", error)
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
                    <h2 className={styles.modalTitle}>Edit Item Details</h2>
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
                            <label className={styles.inputLabel}>Item ID</label>
                            <input
                                type="text"
                                name="itemId"
                                value={item.itemId}
                                className={`${styles.formInput} ${styles.readOnlyInput}`}
                                readOnly
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.inputLabel}>Request ID</label>
                            <input
                                type="text"
                                name="requestId"
                                value={item.requestId}
                                className={`${styles.formInput} ${styles.readOnlyInput}`}
                                readOnly
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.inputLabel}>Claimed User ID</label>
                            <input
                                type="text"
                                name="claimedUserId"
                                value={item.claimedUserId}
                                onChange={handleOnChange}
                                className={styles.formInput}
                                placeholder="Enter claimed user ID"
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.inputLabel}>Item Name</label>
                            <input
                                type="text"
                                name="itemName"
                                value={item.itemName}
                                onChange={handleOnChange}
                                className={styles.formInput}
                                placeholder="Enter item name"
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.inputLabel}>Description</label>
                            <textarea
                                name="description"
                                value={item.description}
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
                                value={item.location}
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
                                value={formatDate(item.date)}
                                onChange={handleOnChange}
                                className={styles.formInput}
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.inputLabel}>Item Status</label>
                            <select
                                name="status"
                                value={item.status}
                                onChange={handleOnChange}
                                className={styles.formSelect}
                            >
                                <option value="LOST">LOST</option>
                                <option value="FOUND">FOUND</option>
                                <option value="CLAIMED">CLAIMED</option>
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
                        Update Item
                    </button>
                </div>
            </div>
        </div>
    );
}

export default EditItem;