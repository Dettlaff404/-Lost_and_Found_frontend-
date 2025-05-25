import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import { DeleteRequest, GetRequests } from '../../service/RequestData';
import EditRequest from './EditRequest';
import { formatDate } from '../../service/Util';

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

    //Loading Data
    useEffect(() => {
        const loadData = async () => {
            const reqDetails = await GetRequests()
            console.log(reqDetails)
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
            console.error("Failed to delete book", error)   
        }
    }

    return (
        <>
            <Table responsive="lg" striped bordered hover>
                <thead className="text-center">
                    <tr>
                        {tHeads.map((headings) => (
                            <th>{headings}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>

                    {requestData.map((data) => (
                        <tr key={data.requestId}>
                            <td>{data.requestId}</td>
                            <td>{data.userId}</td>
                            <td>{data.itemName}</td>
                            <td>{data.description}</td>
                            <td>{data.location}</td>
                            <td>{formatDate(data.date)}</td>
                            <td>{data.itemStatus}</td>
                            <td>{data.status}</td>

                            <td className='d-flex justify-content-center'>
                                <div className='d-flex gap-2'>
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
            />

        </>
    );
}