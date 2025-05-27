import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { formatDate } from '../../service/Util';

interface ItemEditProps {
    show: boolean;
    selectedRow: Item | null;
    handleClose: () => void;
    handleUpdate: (updatedItem: Item) => void;
    updateItems: (item: Item) => Promise<void>;
}

interface Item {
    itemId: string;
    requestId: string;
    claimedUserId: string;
    itemName: string;
    description: string;
    location: string;
    date: string;
    status: string;
}

function EditItem({ show, selectedRow, handleClose, handleUpdate, updateItems }: ItemEditProps) {

    //state management
    const [item, setItem] = useState<Item>({
        itemId: '',
        requestId: '',
        claimedUserId: '',
        itemName: '',
        description: '',
        location: '',
        date: '',
        status: ''
    });

    //load data when componenet mounts
    useEffect(() => {
        if (selectedRow) {
            setItem({...selectedRow});
        }
    }, [selectedRow]);

    //add user data from the form
    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setItem({ ...item, [e.target.name]: e.target.value });
    }

    //handle the save/update
    const handleSave = async () => {
        try {
            await updateItems(item);
            handleUpdate(item);
            handleClose();
        } catch (error) {
            console.error("Failed to Update item", error)
        }
    }

    //handle repeat of floating label
    const renderFloatingLabel = (label: string, name: keyof Item, type = "text", readOnly = false) => (
        <FloatingLabel controlId={`floatingInput-${name}`} label={label} className="mb-3">
            <Form.Control
                type={type}
                name={name}
                value={type === "date" ? formatDate(item[name]) : item[name]}
                onChange={handleOnChange}
                readOnly={readOnly}
            />
        </FloatingLabel>
    );

    return (
         <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Edit Item Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {/* Form */}
                <Form>

                    {renderFloatingLabel("Item Id", "itemId", "text", true)}
                    {renderFloatingLabel("Request Id", "requestId", "text", true)}
                    {renderFloatingLabel("Claimed User Id", "claimedUserId")}
                    {renderFloatingLabel("Item Name", "itemName")}
                    {renderFloatingLabel("Description", "description")}
                    {renderFloatingLabel("Location", "location")}
                    {renderFloatingLabel("Date", "date", "date")}

                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Item Status</Form.Label>
                        <Form.Select name='status' value={item.status} onChange={handleOnChange}>
                            <option value="LOST">LOST</option>
                            <option value="FOUND">FOUND</option>
                            <option value="CLAIMED">CLAIMED</option>
                        </Form.Select>
                    </Form.Group>

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

export default EditItem;