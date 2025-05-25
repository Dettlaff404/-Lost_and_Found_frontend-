import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { formatDate } from '../../service/Util';
import { UpdateRequest } from '../../service/RequestData';

interface ReqEditProps {
    show: boolean;
    selectedRow: Request | null;
    handleClose: () => void;
    handleUpdate: (updatedRequest: Request) => void
}

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

function EditRequest({ show, selectedRow, handleClose, handleUpdate }: ReqEditProps) {

    //state management
    const [request, setRequest] = useState<Request>({
        requestId: '',
        userId: '',
        itemName: '',
        description: '',
        location: '',
        date: '',
        itemStatus: '',
        status: ''
    });

    //load data when componenet mounts
    useEffect(() => {
        if (selectedRow) {
            setRequest({...selectedRow});
        }
    }, [selectedRow]);

    //add request data from the form
    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRequest({...request, [e.target.name]: e.target.value });
    }

    //handle the save/update
    const handleSave = async () => {
        try {
            const updatedRequest = await UpdateRequest(request);
            handleUpdate(updatedRequest);
            handleClose();
        } catch (error) {
            console.error("Failed to Update request", error)
        }
    }

    //handle repeat of floating label
    const renderFloatingLabel = (label: string, name: keyof Request, type = "text", readOnly = false) => (
        <FloatingLabel controlId="floatingInput" label={label} className="mb-3">
            <Form.Control
                type={type}
                name={name}
                value={type === "date" ? formatDate(request[name]) : request[name]}
                onChange={handleOnChange}
                readOnly={readOnly}
            />
        </FloatingLabel>
    );

    return (
         <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Edit Book</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {/* Form */}
                <Form>
                    {renderFloatingLabel("Request Id", "requestId", "text", true)}
                    {renderFloatingLabel("User Id", "userId", "text", true)}
                    {renderFloatingLabel("Item Name", "itemName")}
                    {renderFloatingLabel("Description", "description")}
                    {renderFloatingLabel("Location", "location")}
                    {renderFloatingLabel("Date", "date", "date")}
                    {renderFloatingLabel("Item Status", "itemStatus")}
                    {renderFloatingLabel("Request Status", "status")}
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleSave}>
                    Update
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default EditRequest;