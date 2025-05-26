import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import styles from './userstyle.module.css'
import { AddUserData, DeleteUser, GetUsers, UpdateUser } from '../../service/UserData';
import EditUser from './EditUser';
import AddUser from './AddUser';

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

    //Loading Data
    useEffect(() => {
        const loadData = async () => {
            const usrDetails = await GetUsers()
            setUserData(usrDetails)
        }
        loadData();
    }, []);

    const tHeads: string[] = [
        "User ID",
        "Full Name",
        "Email",
        "Mobile",
        "Role",
        "Action"
    ];

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

    return (
        <>

            <div className='d-flex justify-content-end p-3'>
                <Button variant="outline-primary" onClick={() => setShowAddUser(true)}>Register New User</Button>
            </div>

            <Table responsive="lg" striped bordered hover>
                <thead className="text-center align-middle">
                    <tr>
                        {tHeads.map((headings) => (
                            <th>{headings}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>

                    {userData.map((data) => (
                        <tr key={data.userId} className="text-center align-middle">
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

                        </tr>
                    ))}
                </tbody>
            </Table>
                
            <EditUser
                show={showEditUser}
                selectedRow={selectedRow}
                handleClose={handleClose}
                handleUpdate={handleUpdate}
                updateUsers={UpdateUser}
            />

            <AddUser
                show={showAddUser}
                handleClose={() => setShowAddUser(false)}
                handleAdd={handleAdd}
                addUser={AddUserData}
            />

        </>
    );
}