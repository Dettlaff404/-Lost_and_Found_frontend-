import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import styles from './userstyle.module.css'
import { AddUserData, DeleteUser, GetUsers, UpdateUser } from '../../service/UserData';
import EditUser from './EditUser';
import AddUser from './AddUser';
import { useLocation, useNavigate } from 'react-router';
import { useAuth } from '../Auth/AuthProvider';

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

    // Render table cells based on user role
    const renderTableCells = (data: User) => {
        if (userRole === "ROLE_USER") {
            return (
                <>
                    <td>{data.userId}</td>
                    <td>{data.fullname}</td>
                    <td>{data.email}</td>
                    <td>{data.mobile}</td>
                    <td>{data.role}</td>
                </>
            );
        } else {
            return (
                <>
                    <td>{data.userId}</td>
                    <td>{data.fullname}</td>
                    <td>{data.email}</td>
                    <td>{data.mobile}</td>
                    <td>{data.role}</td>
                    <td className={styles.actions}>
                        <div className={styles.actionButtons}>
                            <Button variant="outline-success" onClick={() => handleEdit(data)}>Edit</Button>
                            <Button variant="outline-danger" onClick={() => handleDelete(data.userId)}>Delete</Button>
                        </div>
                    </td>
                </>
            );
        }
    };

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

    const handleUpdate = (updatedUser: User) => {
        const updatedUsers = userData.map((user) => 
            user.userId === updatedUser.userId ? updatedUser : user
        );
        setUserData(updatedUsers);
    }

    //handle delete function
    const handleDelete = async (userId: string) => {
        try {
            await DeleteUser(userId);
            setUserData(userData.filter((user) => user.userId !== userId));
        } catch (error) {
            console.error("Failed to delete user", error)   
        }
    }

    //handle add function
    const handleAdd = (newUser: User) => {
        setUserData((userData) => [...userData, newUser]);
    }

    //page title
    const location = useLocation();
    const routeName = location.pathname.split("/").filter(Boolean).pop() || "Request";
    const formatedTitle = routeName.charAt(0).toUpperCase() + routeName.slice(1) + " List";

    return (
        <>
            <h1 className={styles.userTitle}>{formatedTitle}</h1>
            
            {/* Show "Register New User" button for non-user roles, or spacer div for user roles */}
            {userRole !== "ROLE_USER" ? (
                <div className='d-flex justify-content-end p-3'>
                    <Button variant="outline-primary" onClick={() => setShowAddUser(true)}>Register New User</Button>
                </div>
            ) : (
                <div style={{ paddingBottom: '32px' }}></div>
            )}

            <Table responsive="lg" striped bordered hover>
                <thead className="text-center align-middle">
                    <tr>
                        {tHeads.map((heading, index) => (
                            <th key={index}>{heading}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {userData.map((data) => (
                        <tr key={data.userId} className="text-center align-middle">
                            {renderTableCells(data)}
                        </tr>
                    ))}
                </tbody>
            </Table>
                
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

        </>
    );
}