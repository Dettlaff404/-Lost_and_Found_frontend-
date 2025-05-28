import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { SignInTask } from "../../service/Auth";
import { NavLink } from "react-router";

export const SignIn = () => {
    interface SignIn {
        email: string;
        password: string;
    }

    const [user, setUser] = useState<SignIn>({
        email: "",
        password: ""
    });

    const [errors, setErrors] = useState<{ email: string }>({
        email: ""
    });

    const [showPassword, setShowPassword] = useState(false); 

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });

        if (name === "email") {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            setErrors(prev => ({ ...prev, email: emailPattern.test(value) ? "" : "Enter a valid email address" }));
        }
    };

    const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (errors.email || !user.email || !user.password) {
            alert("Please enter valid data before submitting.");
            return;
        }

        // API request
        const token = await SignInTask(user);
        console.log(token);

        setUser({ email: "", password: "" });
    };

    return (
        <>
            <h1>Sign In</h1>

            <Form className="d-flex flex-column align-items-center mt-5" onSubmit={handleOnSubmit}>
                <div className="w-50">
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
                    </Form.Group>

                    <div className="d-flex justify-content-between">
                        <NavLink to="/signup">
                            <Button variant="outline-primary" className="me-2">New User? Sign Up</Button>
                        </NavLink>
                        <Button variant="success" type="submit">Log In</Button>
                    </div>

                </div>
            </Form>
        </>
    );
};