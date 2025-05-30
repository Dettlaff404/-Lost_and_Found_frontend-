import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import { DeleteRequest, GetRequests, UpdateRequest, AddRequestData } from '../../service/RequestData';
import EditRequest from './EditRequest';
import { formatDate } from '../../service/Util';
import AddRequest from './AddRequest';
import styles from './requeststyle.module.css'
import { useLocation, useNavigate } from 'react-router';
import { useAuth } from '../Auth/AuthProvider';
import Swal from 'sweetalert2';

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
        const result = await Swal.fire({
            title: 'Success!',
            text: 'Item details edited successfully.',
            icon: 'success',
            confirmButtonText: 'OK'
        })
        if (result.isConfirmed) {
            window.location.reload();
        }
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
    const formatedTitle = routeName.charAt(0).toUpperCase() + routeName.slice(1) + " List";

    return (
        <>
            <h1 className={styles.requestTitle}>{formatedTitle}</h1>

            <div className='d-flex justify-content-end p-3'>
                <Button variant="outline-primary" onClick={() => setShowAddRequest(true)}>Add</Button>
            </div>

            <Table responsive="lg" striped bordered hover>
                <thead className="text-center align-middle">
                    <tr>
                        {tHeads.map((headings, index) => (
                            <th key={index}>{headings}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {requestData.map((data) => (
                        <tr key={data.requestId} className="text-center align-middle">
                            {/* Conditionally render table cells based on user role */}
                            {userRole !== 'ROLE_USER' && <td>{data.requestId}</td>}
                            {userRole !== 'ROLE_USER' && <td>{data.userId}</td>}
                            <td>{data.itemName}</td>
                            <td>{data.description}</td>
                            <td>{data.location}</td>
                            <td>{formatDate(data.date)}</td>
                            <td>{data.itemStatus}</td>
                            <td>{data.status}</td>

                            {userRole !== 'ROLE_USER' && (
                                <td className={styles.actions}>
                                    <div className={styles.actionButtons}>
                                        <Button variant="outline-success" onClick={() => handleEdit(data)}>Edit</Button>
                                        <Button variant="outline-danger" onClick={() => handleDelete(data.requestId)}>Delete</Button>
                                    </div>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </Table>

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

        </>
    );
}