import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import { DeleteRequest, GetRequests, UpdateRequest, AddRequestData } from '../../service/RequestData';
import EditRequest from './EditRequest';
import { formatDate } from '../../service/Util';
import AddRequest from './AddRequest';
import styles from './requeststyle.module.css'

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

    //Loading Data
    useEffect(() => {
        const loadData = async () => {
            const reqDetails = await GetRequests()
            //sort the data based on date in Ascending order
            reqDetails.sort((a: Request, b: Request) => new Date(a.date).getTime() - new Date(b.date).getTime());
            setRequestData(reqDetails)
        }
        loadData();
    }, []);

    const tHeads: string[] = [
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

    const handleUpdate = (updatedRequest: Request) => {
        const updatedRequests = requestData.map((request) => 
            request.requestId === updatedRequest.requestId ? updatedRequest : request
        );
        setRequestData(updatedRequests);
    }

    //handle delete function
    const handleDelete = async (requestId: string) => {
        try {
            await DeleteRequest(requestId);
            setRequestData(requestData.filter((request) => request.requestId !== requestId));
        } catch (error) {
            console.error("Failed to delete request", error)   
        }
    }

    //handle add function
    const handleAdd = (newRequest: Request) => {
        setRequestData((requestData) => [...requestData, newRequest]);
    }

    return (
        <>

            <div className='d-flex justify-content-end p-3'>
                <Button variant="outline-primary" onClick={() => setShowAddRequest(true)}>Add</Button>
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

                    {requestData.map((data) => (
                        <tr key={data.requestId} className="text-center align-middle">
                            <td>{data.requestId}</td>
                            <td>{data.userId}</td>
                            <td>{data.itemName}</td>
                            <td>{data.description}</td>
                            <td>{data.location}</td>
                            <td>{formatDate(data.date)}</td>
                            <td>{data.itemStatus}</td>
                            <td>{data.status}</td>

                            <td className={styles.actions}>
                                <div className={styles.actionButtons}>
                                    <Button variant="outline-success" onClick={() => handleEdit(data)}>Edit</Button>
                                    <Button variant="outline-danger" onClick={() => handleDelete(data.requestId)}>Delete</Button>
                                </div>
                            </td>

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