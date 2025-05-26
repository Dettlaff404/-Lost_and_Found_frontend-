import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import { useState } from 'react';

interface User {
    userId: string;
    fullname: string;
    email: string;
    mobile: string;
    password: string;
    role: string;
}

function AddUser({ show, handleClose, handleAdd, addUser }: any) {

    //state management
    const [newUser, setNewUser] = useState<User>({
        userId: '',
        fullname: '',
        email: '',
        mobile: '',
        password: '',
        role: ''
    });


    //add user data from the form
    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setNewUser({ ...newUser, [e.target.name]: e.target.value });
    }

    //handle the add book process with the back-end
    const handleOnSubmit = async () => {
        try {
            const newUserDetails = await addUser(newUser);
            handleAdd(newUserDetails)
            handleClose()

            setNewUser({
                userId: '',
                fullname: '',
                email: '',
                mobile: '',
                password: '',
                role: ''
            });

        } catch (err) {
            console.error("Failed to Add the User", err)
        }
    }

    const createFormElement = (label: string, name: keyof User, type = "text") => (
        <FloatingLabel controlId={`floatingInput-${name}`} label={label} className="mb-3">
            <Form.Control
                type={type}
                name={name}
                value={newUser[name]}
                onChange={handleOnChange}
            />
        </FloatingLabel>
    );

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Register a New User</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {/* Form */}
                <Form>

                    {createFormElement("Full Name", "fullname")}
                    {createFormElement("Email", "email")}
                    {createFormElement("Mobile", "mobile")}
                    {createFormElement("Password", "password")}
                    
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>User Role</Form.Label>
                        <Form.Select name='role' value={newUser.role} onChange={handleOnChange}>
                            <option value="">Select the User Role</option>
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
                <Button variant="primary" onClick={handleOnSubmit}>
                    Save
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default AddUser;