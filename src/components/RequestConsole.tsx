import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import { GetRequests } from '../service/RequestData';

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
                            <td>{data.date}</td>
                            <td>{data.itemStatus}</td>
                            <td>{data.status}</td>

                            <td className='d-flex justify-content-center'>
                                <div className='d-flex gap-2'>
                                    <Button variant="outline-success">Edit</Button>
                                    <Button variant="outline-danger">Delete</Button>
                                </div>
                            </td>

                        </tr>
                    ))}
                </tbody>
            </Table>
        </>
    );
}