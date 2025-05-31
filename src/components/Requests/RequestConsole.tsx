import { useEffect, useState } from 'react';
import { DeleteRequest, GetRequests, UpdateRequest, AddRequestData } from '../../service/RequestData';
import EditRequest from './EditRequest';
import { formatDate } from '../../service/Util';
import AddRequest from './AddRequest';
import styles from "../styles.module.css"
import { useLocation, useNavigate } from 'react-router';
import { useAuth } from '../Auth/AuthProvider';
import Swal from 'sweetalert2';
import { FaPlus, FaEdit, FaTrash, FaTable, FaUser, FaMapMarkerAlt, FaCalendar, FaBox } from 'react-icons/fa';

export function RequestConsole() {

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

    const [requestData, setRequestData] = useState<Request[]>([]);
    const [selectedRow, setSelectedRow] = useState<Request | null>(null);
    const [showEditRequest, setShowEditRequest] = useState(false);
    const [showAddRequest, setShowAddRequest] = useState(false);

    // Get user role from auth context
    const { userRole } = useAuth();

    const navigate = useNavigate();

    //Loading Data
    useEffect(() => {
        const loadData = async () => {
            try {
                const reqDetails = await GetRequests()
                //sort the data based on date in Ascending order
                reqDetails.sort((a: Request, b: Request) => new Date(a.date).getTime() - new Date(b.date).getTime());
                setRequestData(reqDetails)
            } catch (error) {
                navigate('/unauth')
                console.error("Failed to fetch requests", error)
            }
        }
        loadData();
    }, [navigate]);

    // Define table headers based on user role
    const tHeads: string[] = userRole === 'ROLE_USER'
        ? [
            "Item Name",
            "Description",
            "Location",
            "Date",
            "Item Status",
            "Request Status"
        ]
        : [
            "Request ID",
            "User ID",
            "Item Name",
            "Description",
            "Location",
            "Date",
            "Item Status",
            "Request Status",
            "Action"
        ];

    // Handle edit function
    const handleEdit = (data: Request) => {
        console.log("Edit clicked for row:", data);
        setSelectedRow(data);
        setShowEditRequest(true);
    };

    const handleClose = () => {
        setShowEditRequest(false);
        setSelectedRow(null);
    }

    const handleUpdate = async (updatedRequest: Request) => {
        const updatedRequests = requestData.map((request) =>
            request.requestId === updatedRequest.requestId ? updatedRequest : request
        );
        setRequestData(updatedRequests);
        await Swal.fire({
            title: 'Success!',
            text: 'Item details edited successfully.',
            icon: 'success',
            confirmButtonText: 'OK'
        })
    }

    //handle delete function
    const handleDelete = async (requestId: string) => {

        //impl custom delete alert
        const result = await Swal.fire({
            title: 'Are you sure to delete this Request?',
            text: `You won't be able to revert this! This will also delete the associated Item.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                await DeleteRequest(requestId);
                setRequestData(requestData.filter((request) => request.requestId !== requestId));
            } catch (error) {
                console.error("Failed to delete request", error)
            }
        }
    }

    //handle add function
    const handleAdd = async (newRequest: Request) => {
        setRequestData((requestData) => [...requestData, newRequest]);

        await Swal.fire({
            title: 'Success!',
            text: 'Request details added successfully.',
            icon: 'success',
            confirmButtonText: 'OK'
        });
    }

    //page title
    const location = useLocation();
    const routeName = location.pathname.split("/").filter(Boolean).pop() || "Request";
    const formatedTitle = routeName.charAt(0).toUpperCase() + routeName.slice(1) + " Management";

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
                        {requestData.length} {requestData.length === 1 ? 'request' : 'requests'} found
                    </p>
                </div>

                <div className={styles.tableControls}>
                    <button 
                        className={styles.addButton}
                        onClick={() => setShowAddRequest(true)}
                    >
                        <FaPlus size={16} />
                        Add New Request
                    </button>
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
                                {requestData.map((data, index) => (
                                    <tr key={data.requestId} className={styles.tableRow}>
                                        {userRole !== 'ROLE_USER' && (
                                            <td className={styles.tableCell}>
                                                <span className={styles.requestId}>#{data.requestId.slice(-6)}</span>
                                            </td>
                                        )}
                                        {userRole !== 'ROLE_USER' && (
                                            <td className={styles.tableCell}>
                                                <div className={styles.userInfo}>
                                                    <FaUser size={14} className={styles.cellIcon} />
                                                    <span className={styles.userId}>#{data.userId.slice(-6)}</span>
                                                </div>
                                            </td>
                                        )}
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
                                            {getStatusBadge(data.itemStatus)}
                                        </td>
                                        <td className={styles.tableCell}>
                                            {getStatusBadge(data.status)}
                                        </td>
                                        {userRole !== 'ROLE_USER' && (
                                            <td className={styles.tableCell}>
                                                <div className={styles.actionButtons}>
                                                    <button 
                                                        className={styles.editButton}
                                                        onClick={() => handleEdit(data)}
                                                        title="Edit Request"
                                                    >
                                                        <FaEdit size={14} />
                                                    </button>
                                                    <button 
                                                        className={styles.deleteButton}
                                                        onClick={() => handleDelete(data.requestId)}
                                                        title="Delete Request"
                                                    >
                                                        <FaTrash size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        
                        {requestData.length === 0 && (
                            <div className={styles.emptyState}>
                                <div className={styles.emptyIcon}>
                                    <FaTable size={48} />
                                </div>
                                <h3 className={styles.emptyTitle}>No Requests Found</h3>
                                <p className={styles.emptyText}>
                                    Get started by adding your first request
                                </p>
                                <button 
                                    className={styles.emptyButton}
                                    onClick={() => setShowAddRequest(true)}
                                >
                                    <FaPlus size={16} />
                                    Add First Request
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <EditRequest
                show={showEditRequest}
                selectedRow={selectedRow}
                handleClose={handleClose}
                handleUpdate={handleUpdate}
                updateRequests={UpdateRequest}
            />

            <AddRequest
                show={showAddRequest}
                handleClose={() => setShowAddRequest(false)}
                handleAdd={handleAdd}
                addRequest={AddRequestData}
            />
        </div>
    );
}