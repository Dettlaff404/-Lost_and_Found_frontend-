import { useEffect, useState } from 'react';
import { AddUserData, DeleteUser, GetUsers, UpdateUser } from '../../service/UserData';
import EditUser from './EditUser';
import AddUser from './AddUser';
import styles from "../styles.module.css"
import { useLocation, useNavigate } from 'react-router';
import { useAuth } from '../Auth/AuthProvider';
import Swal from 'sweetalert2';
import { FaPlus, FaEdit, FaTrash, FaUser, FaEnvelope, FaPhone, FaIdCard } from 'react-icons/fa';

export function UserConsole() {

    interface User {
        userId: string;
        fullname: string;
        email: string;
        mobile: string;
        password: string;
        role: string;
    }

    const [userData, setUserData] = useState<User[]>([]);
    const [selectedRow, setSelectedRow] = useState<User | null>(null);
    const [showEditUser, setShowEditUser] = useState(false);
    const [showAddUser, setShowAddUser] = useState(false);

    // Get user role from auth context
    const { userRole } = useAuth();

    const navigate = useNavigate();

    //Loading Data
    useEffect(() => {
        const loadData = async () => {
            try {
                const usrDetails = await GetUsers();

                // Filter data based on user role
                if (userRole === "ROLE_USER") {
                    // Only show users with role "USER" for ROLE_USER
                    const filteredUsers = usrDetails.filter((user: User) => user.role === "USER");
                    setUserData(filteredUsers);
                } else {
                    // Show all users for other roles (ADMIN, STAFF, etc.)
                    setUserData(usrDetails);
                }
            } catch (error) {
                navigate('/unauth');
                console.error("Failed to fetch users", error);
            }
        }
        loadData();
    }, [userRole, navigate]);

    // Dynamic table headers based on user role
    const getTableHeaders = (): string[] => {
        if (userRole === "ROLE_USER") {
            return [
                "User ID",
                "Full Name",
                "Email",
                "Mobile",
                "Role"
            ];
        } else {
            return [
                "User ID",
                "Full Name",
                "Email",
                "Mobile",
                "Role",
                "Action"
            ];
        }
    };

    const tHeads = getTableHeaders();

    // Handle edit function
    const handleEdit = (data: User) => {
        console.log("Edit clicked for row:", data);
        setSelectedRow(data);
        setShowEditUser(true);
    };

    const handleClose = () => {
        setShowEditUser(false);
        setSelectedRow(null);
    }

    const handleUpdate = async (updatedUser: User) => {
        const updatedUsers = userData.map((user) =>
            user.userId === updatedUser.userId ? updatedUser : user
        );
        setUserData(updatedUsers);

        await Swal.fire({
            title: 'Success!',
            text: 'User details edited successfully.',
            icon: 'success',
            confirmButtonText: 'OK'
        });
    }

    //handle delete function
    const handleDelete = async (userId: string) => {

        // impl custom delete alert
        const result = await Swal.fire({
            title: 'Are you sure to delete this User?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                await DeleteUser(userId);
                setUserData(userData.filter((user) => user.userId !== userId));
            } catch (error) {
                console.error("Failed to delete user", error)
            }
        }
    }

    //handle add function
    const handleAdd = async (newUser: User) => {
        setUserData((userData) => [...userData, newUser]);

        await Swal.fire({
            title: 'Success!',
            text: 'User details added successfully.',
            icon: 'success',
            confirmButtonText: 'OK'
        });
    }

    //page title
    const location = useLocation();
    const routeName = location.pathname.split("/").filter(Boolean).pop() || "User";
    const formatedTitle = routeName.charAt(0).toUpperCase() + routeName.slice(1) + " Management";

    const getRoleBadge = (role: string) => {
        const roleClasses = {
            'admin': styles.statusApproved,
            'staff': styles.statusPending,
            'user': styles.statusCompleted,
            'role_admin': styles.statusApproved,
            'role_staff': styles.statusPending,
            'role_user': styles.statusCompleted
        };
        
        const roleClass = roleClasses[role.toLowerCase() as keyof typeof roleClasses] || styles.statusDefault;
        
        return (
            <span className={`${styles.statusBadge} ${roleClass}`}>
                {role.replace('ROLE_', '')}
            </span>
        );
    };

    return (
        <div className={styles.consoleContainer}>
            <div className={styles.consoleBackground}></div>
            
            <div className={styles.consoleContent}>
                <div className={styles.consoleHeader}>
                    <div className={styles.headerIcon}>
                        <FaUser size={24} />
                    </div>
                    <h1 className={styles.consoleTitle}>{formatedTitle}</h1>
                    <p className={styles.consoleSubtitle}>
                        {userData.length} {userData.length === 1 ? 'user' : 'users'} found
                    </p>
                </div>

                {userRole !== "ROLE_USER" && (
                    <div className={styles.tableControls}>
                        <button 
                            className={styles.addButton}
                            onClick={() => setShowAddUser(true)}
                        >
                            <FaPlus size={16} />
                            Register New User
                        </button>
                    </div>
                )}

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
                                {userData.map((data) => (
                                    <tr key={data.userId} className={styles.tableRow}>
                                        <td className={styles.tableCell}>
                                            <div className={styles.userInfo}>
                                                <FaIdCard size={14} className={styles.cellIcon} />
                                                <span className={styles.requestId}>#{data.userId.slice(-6)}</span>
                                            </div>
                                        </td>
                                        <td className={styles.tableCell}>
                                            <div className={styles.itemInfo}>
                                                <FaUser size={14} className={styles.cellIcon} />
                                                <span className={styles.itemName}>{data.fullname}</span>
                                            </div>
                                        </td>
                                        <td className={styles.tableCell}>
                                            <div className={styles.locationInfo}>
                                                <FaEnvelope size={14} className={styles.cellIcon} />
                                                <span className={styles.description}>{data.email}</span>
                                            </div>
                                        </td>
                                        <td className={styles.tableCell}>
                                            <div className={styles.dateInfo}>
                                                <FaPhone size={14} className={styles.cellIcon} />
                                                {data.mobile}
                                            </div>
                                        </td>
                                        <td className={styles.tableCell}>
                                            {getRoleBadge(data.role)}
                                        </td>
                                        {userRole !== "ROLE_USER" && (
                                            <td className={styles.tableCell}>
                                                <div className={styles.actionButtons}>
                                                    <button 
                                                        className={styles.editButton}
                                                        onClick={() => handleEdit(data)}
                                                        title="Edit User"
                                                    >
                                                        <FaEdit size={14} />
                                                    </button>
                                                    <button 
                                                        className={styles.deleteButton}
                                                        onClick={() => handleDelete(data.userId)}
                                                        title="Delete User"
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
                        
                        {userData.length === 0 && (
                            <div className={styles.emptyState}>
                                <div className={styles.emptyIcon}>
                                    <FaUser size={48} />
                                </div>
                                <h3 className={styles.emptyTitle}>No Users Found</h3>
                                <p className={styles.emptyText}>
                                    Get started by adding your first user
                                </p>
                                {userRole !== "ROLE_USER" && (
                                    <button 
                                        className={styles.emptyButton}
                                        onClick={() => setShowAddUser(true)}
                                    >
                                        <FaPlus size={16} />
                                        Add First User
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Only show EditUser modal for non-user roles */}
            {userRole !== "ROLE_USER" && (
                <EditUser
                    show={showEditUser}
                    selectedRow={selectedRow}
                    handleClose={handleClose}
                    handleUpdate={handleUpdate}
                    updateUsers={UpdateUser}
                />
            )}

            {/* Only show AddUser modal for non-user roles */}
            {userRole !== "ROLE_USER" && (
                <AddUser
                    show={showAddUser}
                    handleClose={() => setShowAddUser(false)}
                    handleAdd={handleAdd}
                    addUser={AddUserData}
                />
            )}
        </div>
    );
}