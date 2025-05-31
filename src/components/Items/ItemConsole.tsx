import { useEffect, useState } from 'react';
import { formatDate } from '../../service/Util';
import styles from "../styles.module.css"
import { DeleteItem, GetItems, UpdateItem } from '../../service/ItemData';
import { useItemType } from "../NavBar/ItemTypeContext";
import EditItem from './EditItem';
import { useAuth } from '../Auth/AuthProvider';
import { useNavigate } from 'react-router';
import Swal from 'sweetalert2';
import { FaEdit, FaTrash, FaTable, FaUser, FaMapMarkerAlt, FaCalendar, FaBox } from 'react-icons/fa';

export function ItemConsole() {
    // Get user role from auth context
    const { userRole } = useAuth();

    const navigate = useNavigate();

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

    const [itemData, setItemData] = useState<Item[]>([]);
    const [selectedRow, setSelectedRow] = useState<Item | null>(null);
    const [showEditItem, setShowEditItem] = useState(false);
    const { selectedItemType } = useItemType();

    // Loading Data
    useEffect(() => {
        const loadData = async () => {
            try {
                const itmDetails = await GetItems()
                // sort the data based on date in Ascending order
                itmDetails.sort((a: Item, b: Item) => new Date(a.date).getTime() - new Date(b.date).getTime());

                // Data Selection
                if (selectedItemType === "ALL") {
                    setItemData(itmDetails)
                } else {
                    setItemData(itmDetails.filter((item: Item) => item.status === selectedItemType));
                }
            } catch (error) {
                navigate('/unauth')
                console.error("Failed to fetch items", error)
            }
        }
        loadData();
    }, [selectedItemType, navigate]);

    // Dynamic table headers based on user role and item type
    const getTableHeaders = (): string[] => {
        if (userRole === 'ROLE_USER') {
            if (selectedItemType === 'CLAIMED') {
                return [
                    "Item Name",
                    "Claimed User ID",
                    "Description",
                    "Location",
                    "Date",
                    "Status"
                ];
            } else {
                return [
                    "Item Name",
                    "Description",
                    "Location",
                    "Date",
                    "Status"
                ];
            }
        } else {
            // For non-user roles (ADMIN, STAFF, etc.)
            if (selectedItemType === 'CLAIMED' || selectedItemType === 'ALL') {
                return [
                    "Item ID",
                    "Request ID",
                    "Claimed User ID",
                    "Item Name",
                    "Description",
                    "Location",
                    "Date",
                    "Status",
                    "Action"
                ];
            } else {
                return [
                    "Item ID",
                    "Request ID",
                    "Item Name",
                    "Description",
                    "Location",
                    "Date",
                    "Status",
                    "Action"
                ];
            }
        }
    };

    const tHeads = getTableHeaders();

    // Handle edit function
    const handleEdit = (data: Item) => {
        console.log("Edit clicked for row:", data);
        setSelectedRow(data);
        setShowEditItem(true);
    };

    const handleClose = () => {
        setShowEditItem(false);
        setSelectedRow(null);
    }

    const handleUpdate = async (updatedItem: Item) => {
        const updatedItems = itemData.map((item) => 
            item.itemId === updatedItem.itemId ? updatedItem : item
        );

        if (selectedItemType === "ALL") {
            setItemData(updatedItems)
        } else {
            setItemData(updatedItems.filter((item: Item) => item.status === selectedItemType));
        }

        await Swal.fire({
            title: 'Success!',
            text: 'Item details edited successfully.',
            icon: 'success',
            confirmButtonText: 'OK'
        });
    }

    // Handle delete function
    const handleDelete = async (itemId: string) => {
        const result = await Swal.fire({
            title: 'Are you sure to delete this Item?',
            text: `You won't be able to revert this! This will also delete the associated Request.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        });

        if(result.isConfirmed) {
            try {
                await DeleteItem(itemId);
                setItemData(itemData.filter((item) => item.itemId !== itemId));
            } catch (error) {
                console.error("Failed to delete item", error)   
            }
        }
    }

    // Page title
    const formatedTitle = selectedItemType === "ALL" ? "Items Management" : selectedItemType + " Items Management";

    const getStatusBadge = (status: string) => {
        const statusClasses = {
            'pending': styles.statusPending,
            'approved': styles.statusApproved,
            'rejected': styles.statusRejected,
            'completed': styles.statusCompleted,
            'found': styles.statusFound,
            'lost': styles.statusLost,
            'claimed': styles.statusClaimed
        };
        
        const statusClass = statusClasses[status.toLowerCase() as keyof typeof statusClasses] || styles.statusDefault;
        
        return (
            <span className={`${styles.statusBadge} ${statusClass}`}>
                {status}
            </span>
        );
    };

    // Render table cells based on user role and item type
    const renderTableCells = (data: Item) => {
        if (userRole === 'ROLE_USER') {
            if (selectedItemType === 'CLAIMED') {
                return (
                    <>
                        <td className={styles.tableCell}>
                            <div className={styles.itemInfo}>
                                <FaBox size={14} className={styles.cellIcon} />
                                <span className={styles.itemName}>{data.itemName}</span>
                            </div>
                        </td>
                        <td className={styles.tableCell}>
                            <div className={styles.userInfo}>
                                <FaUser size={14} className={styles.cellIcon} />
                                <span className={styles.userId}>#{data.claimedUserId.slice(-6)}</span>
                            </div>
                        </td>
                        <td className={styles.tableCell}>
                            <span className={styles.description}>{data.description}</span>
                        </td>
                        <td className={styles.tableCell}>
                            <div className={styles.locationInfo}>
                                <FaMapMarkerAlt size={14} className={styles.cellIcon} />
                                {data.location}
                            </div>
                        </td>
                        <td className={styles.tableCell}>
                            <div className={styles.dateInfo}>
                                <FaCalendar size={14} className={styles.cellIcon} />
                                {formatDate(data.date)}
                            </div>
                        </td>
                        <td className={styles.tableCell}>
                            {getStatusBadge(data.status)}
                        </td>
                    </>
                );
            } else {
                return (
                    <>
                        <td className={styles.tableCell}>
                            <div className={styles.itemInfo}>
                                <FaBox size={14} className={styles.cellIcon} />
                                <span className={styles.itemName}>{data.itemName}</span>
                            </div>
                        </td>
                        <td className={styles.tableCell}>
                            <span className={styles.description}>{data.description}</span>
                        </td>
                        <td className={styles.tableCell}>
                            <div className={styles.locationInfo}>
                                <FaMapMarkerAlt size={14} className={styles.cellIcon} />
                                {data.location}
                            </div>
                        </td>
                        <td className={styles.tableCell}>
                            <div className={styles.dateInfo}>
                                <FaCalendar size={14} className={styles.cellIcon} />
                                {formatDate(data.date)}
                            </div>
                        </td>
                        <td className={styles.tableCell}>
                            {getStatusBadge(data.status)}
                        </td>
                    </>
                );
            }
        } else {
            // For non-user roles (ADMIN, STAFF, etc.)
            if (selectedItemType === 'CLAIMED' || selectedItemType === 'ALL') {
                return (
                    <>
                        <td className={styles.tableCell}>
                            <span className={styles.requestId}>#{data.itemId.slice(-6)}</span>
                        </td>
                        <td className={styles.tableCell}>
                            <span className={styles.requestId}>#{data.requestId.slice(-6)}</span>
                        </td>
                        <td className={styles.tableCell}>
                            <div className={styles.userInfo}>
                                <FaUser size={14} className={styles.cellIcon} />
                                <span className={styles.userId}>#{data.claimedUserId?.slice(-6) || 'N/A'}</span>
                            </div>
                        </td>
                        <td className={styles.tableCell}>
                            <div className={styles.itemInfo}>
                                <FaBox size={14} className={styles.cellIcon} />
                                <span className={styles.itemName}>{data.itemName}</span>
                            </div>
                        </td>
                        <td className={styles.tableCell}>
                            <span className={styles.description}>{data.description}</span>
                        </td>
                        <td className={styles.tableCell}>
                            <div className={styles.locationInfo}>
                                <FaMapMarkerAlt size={14} className={styles.cellIcon} />
                                {data.location}
                            </div>
                        </td>
                        <td className={styles.tableCell}>
                            <div className={styles.dateInfo}>
                                <FaCalendar size={14} className={styles.cellIcon} />
                                {formatDate(data.date)}
                            </div>
                        </td>
                        <td className={styles.tableCell}>
                            {getStatusBadge(data.status)}
                        </td>
                        <td className={styles.tableCell}>
                            <div className={styles.actionButtons}>
                                <button 
                                    className={styles.editButton}
                                    onClick={() => handleEdit(data)}
                                    title="Edit Item"
                                >
                                    <FaEdit size={14} />
                                </button>
                                <button 
                                    className={styles.deleteButton}
                                    onClick={() => handleDelete(data.itemId)}
                                    title="Delete Item"
                                >
                                    <FaTrash size={14} />
                                </button>
                            </div>
                        </td>
                    </>
                );
            } else {
                return (
                    <>
                        <td className={styles.tableCell}>
                            <span className={styles.requestId}>#{data.itemId.slice(-6)}</span>
                        </td>
                        <td className={styles.tableCell}>
                            <span className={styles.requestId}>#{data.requestId.slice(-6)}</span>
                        </td>
                        <td className={styles.tableCell}>
                            <div className={styles.itemInfo}>
                                <FaBox size={14} className={styles.cellIcon} />
                                <span className={styles.itemName}>{data.itemName}</span>
                            </div>
                        </td>
                        <td className={styles.tableCell}>
                            <span className={styles.description}>{data.description}</span>
                        </td>
                        <td className={styles.tableCell}>
                            <div className={styles.locationInfo}>
                                <FaMapMarkerAlt size={14} className={styles.cellIcon} />
                                {data.location}
                            </div>
                        </td>
                        <td className={styles.tableCell}>
                            <div className={styles.dateInfo}>
                                <FaCalendar size={14} className={styles.cellIcon} />
                                {formatDate(data.date)}
                            </div>
                        </td>
                        <td className={styles.tableCell}>
                            {getStatusBadge(data.status)}
                        </td>
                        <td className={styles.tableCell}>
                            <div className={styles.actionButtons}>
                                <button 
                                    className={styles.editButton}
                                    onClick={() => handleEdit(data)}
                                    title="Edit Item"
                                >
                                    <FaEdit size={14} />
                                </button>
                                <button 
                                    className={styles.deleteButton}
                                    onClick={() => handleDelete(data.itemId)}
                                    title="Delete Item"
                                >
                                    <FaTrash size={14} />
                                </button>
                            </div>
                        </td>
                    </>
                );
            }
        }
    };

    return (
        <div className={styles.consoleContainer}>
            <div className={styles.consoleBackground}></div>
            
            <div className={styles.consoleContent}>
                <div className={styles.consoleHeader}>
                    <div className={styles.headerIcon}>
                        <FaTable size={24} />
                    </div>
                    <h1 className={styles.consoleTitle}>{formatedTitle}</h1>
                    <p className={styles.consoleSubtitle}>
                        {itemData.length} {itemData.length === 1 ? 'item' : 'items'} found
                    </p>
                </div>

                <div className={styles.tableContainer}>
                    <div className={styles.tableWrapper}>
                        <table className={styles.modernTable}>
                            <thead>
                                <tr>
                                    {tHeads.map((heading, index) => (
                                        <th key={index} className={styles.tableHeader}>
                                            {heading}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {itemData.map((data) => (
                                    <tr key={data.itemId} className={styles.tableRow}>
                                        {renderTableCells(data)}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        
                        {itemData.length === 0 && (
                            <div className={styles.emptyState}>
                                <div className={styles.emptyIcon}>
                                    <FaTable size={48} />
                                </div>
                                <h3 className={styles.emptyTitle}>No Items Found</h3>
                                <p className={styles.emptyText}>
                                    {selectedItemType === "ALL" 
                                        ? "No items available at the moment" 
                                        : `No ${selectedItemType.toLowerCase()} items found`
                                    }
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Only show EditItem modal for non-user roles */}
            {userRole !== 'ROLE_USER' && (
                <EditItem
                    show={showEditItem}
                    selectedRow={selectedRow}
                    handleClose={handleClose}
                    handleUpdate={handleUpdate}
                    updateItems={UpdateItem}
                />
            )}
        </div>
    );
}