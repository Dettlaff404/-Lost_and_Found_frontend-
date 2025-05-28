import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { SignUpTask } from "../../service/Auth";

export const SignUp = () => {
    interface User {
        userId: string;
        fullname: string;
        email: string;
        mobile: string;
        password: string;
        role: string;
    }

    const [user, setUser] = useState<User>({
        userId: '',
        fullname: '',
        email: '',
        mobile: '',
        password: '',
        role: 'USER'
    });

    const [errors, setErrors] = useState<{ email: string; mobile: string; password: string }>({
        email: '',
        mobile: '',
        password: ''
    });

    const [showPassword, setShowPassword] = useState(false); // Toggle state for password visibility

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });

        if (name === "email") {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            setErrors(prev => ({ ...prev, email: emailPattern.test(value) ? '' : 'Enter a valid email address' }));
        }

        if (name === "mobile") {
            const mobilePattern = /^[0-9]*$/;
            setErrors(prev => ({ ...prev, mobile: mobilePattern.test(value) ? '' : 'Only numbers are allowed' }));
        }

        if (name === "password") {
            const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
            setErrors(prev => ({
                ...prev,
                password: passwordPattern.test(value) ? '' : 'Password must be at least 8 characters with uppercase, lowercase, number, and special character'
            }));
        }
    };

    const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (errors.email || errors.mobile || errors.password || !user.email || !user.mobile || !user.password) {
            alert("Please enter valid data before submitting.");
            return;
        }

        const token = await SignUpTask(user);

        console.log(token)
        setUser({
            userId: '',
            fullname: '',
            email: '',
            mobile: '',
            password: '',
            role: 'USER'
        });
    };

    return (
        <>
            <h1>Sign Up</h1>

            <Form className="d-flex flex-column align-items-center mt-5" onSubmit={handleOnSubmit}>
                <div className="w-50">

                    <Form.Group className="mb-3">
                        <Form.Label>Full Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter your full name"
                            name="fullname"
                            value={user.fullname}
                            onChange={handleOnChange}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Enter email"
                            name="email"
                            value={user.email}
                            onChange={handleOnChange}
                        />
                        {errors.email && <small className="text-danger">{errors.email}</small>}
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Contact Number</Form.Label>
                        <Form.Control
                            type="tel"
                            inputMode="numeric"
                            placeholder="Enter your mobile number"
                            name="mobile"
                            value={user.mobile}
                            onChange={handleOnChange}
                        />
                        {errors.mobile && <small className="text-danger">{errors.mobile}</small>}
                    </Form.Group>

                    <Form.Group className="mb-3 position-relative">
                        <Form.Label>Password</Form.Label>
                        <div className="d-flex align-items-center">
                            <Form.Control
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter Password"
                                name="password"
                                value={user.password}
                                onChange={handleOnChange}
                            />
                            <Button
                                variant="outline-secondary"
                                className="ms-2"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? FaEyeSlash({ size: 20 }) : FaEye({ size: 20 })}
                            </Button>
                        </div>
                        {errors.password && <small className="text-danger">{errors.password}</small>}
                    </Form.Group>

                    <Button variant="success" type="submit">
                        Sign Up
                    </Button>
                </div>
            </Form>
        </>
    );
};