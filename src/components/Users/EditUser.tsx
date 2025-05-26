import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

interface UserEditProps {
    show: boolean;
    selectedRow: User | null;
    handleClose: () => void;
    handleUpdate: (updatedUser: User) => void;
    updateUsers: (user: User) => Promise<void>;
}

interface User {
    userId: string;
    fullname: string;
    email: string;
    mobile: string;
    password: string;
    role: string;
}

function EditUser({ show, selectedRow, handleClose, handleUpdate, updateUsers }: UserEditProps) {

    //state management
    const [user, setUser] = useState<User>({
        userId: '',
        fullname: '',
        email: '',
        mobile: '',
        password: '',
        role: ''
    });

    //load data when componenet mounts
    useEffect(() => {
        if (selectedRow) {
            setUser({...selectedRow});
        }
    }, [selectedRow]);

    //add user data from the form
    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    }

    //handle the save/update
    const handleSave = async () => {
        try {
            await updateUsers(user);
            handleUpdate(user);
            handleClose();
        } catch (error) {
            console.error("Failed to Update user", error)
        }
    }

    //handle repeat of floating label
    const renderFloatingLabel = (label: string, name: keyof User, type = "text", readOnly = false) => (
        <FloatingLabel controlId={`floatingInput-${name}`} label={label} className="mb-3">
            <Form.Control
                type={type}
                name={name}
                value={user[name]}
                onChange={handleOnChange}
                readOnly={readOnly}
            />
        </FloatingLabel>
    );

    return (
         <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Edit User Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {/* Form */}
                <Form>
                    {renderFloatingLabel("User Id", "userId", "text", true)}
                    {renderFloatingLabel("Full Name", "fullname")}
                    {renderFloatingLabel("Email", "email")}
                    {renderFloatingLabel("Mobile", "mobile")}
                    {renderFloatingLabel("Password", "password")}

                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>User Role</Form.Label>
                        <Form.Select name='role' value={user.role} onChange={handleOnChange}>
                            <option value="ADMIN">ADMIN</option>
                            <option value="STAFF">STAFF</option>
                            <option value="USER">USER</option>
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

export default EditUser;