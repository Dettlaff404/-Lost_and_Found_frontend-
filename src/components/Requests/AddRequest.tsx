import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import { useState } from 'react';

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

function AddRequest({ show, handleClose, handleAdd, addRequest }: any) {

    //state management
    const [newRequest, setNewRequest] = useState<Request>({
        requestId: '',
        userId: '',
        itemName: '',
        description: '',
        location: '',
        date: '',
        itemStatus: '',
        status: ''
    });


    //add request data from the form
    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setNewRequest({ ...newRequest, [e.target.name]: e.target.value });
    }

    //handle the add book process with the back-end
    const handleOnSubmit = async () => {
        try {
            const newRequestDetails = await addRequest(newRequest);
            handleAdd(newRequestDetails)
            handleClose()

            setNewRequest({
                requestId: '',
                userId: '',
                itemName: '',
                description: '',
                location: '',
                date: '',
                itemStatus: '',
                status: ''
            });

        } catch (err) {
            console.error("Failed to Add the Request", err)
        }
    }

    const createFormElement = (label: string, name: keyof Request, type = "text") => (
        <FloatingLabel controlId="floatingInput" label={label} className="mb-3">
            <Form.Control
                type={type}
                name={name}
                value={newRequest[name]}
                onChange={handleOnChange}
            />
        </FloatingLabel>
    );

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Create a new Request</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {/* Form */}
                <Form>
                    {createFormElement("User ID", "userId")}   {/*should be replaced with user id derived from the token*/}
                    {createFormElement("Item Name", "itemName")}
                    {createFormElement("Description", "description")}
                    {createFormElement("Location", "location")}
                    {createFormElement("Date", "date", "date")}

                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Item Status</Form.Label>
                        <Form.Select name='itemStatus' value={newRequest.itemStatus} onChange={handleOnChange}>
                            <option value="">Select the Status</option>
                            <option value="LOST">LOST</option>
                            <option value="FOUND">FOUND</option>
                        </Form.Select>
                    </Form.Group>

                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleOnSubmit}>
                    Save
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default AddRequest;