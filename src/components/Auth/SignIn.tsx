import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { FaEye, FaEyeSlash, FaEnvelope, FaLock } from "react-icons/fa";
import { SignInTask } from "../../service/Auth";
import { NavLink, useNavigate } from "react-router";
import styles from "./signstyle.module.css";
import { useAuth } from "./AuthProvider";
import Swal from "sweetalert2";

export const SignIn = () => {
    interface SignIn {
        email: string;
        password: string;
    }

    const { login } = useAuth();
    const navigate = useNavigate();

    const [user, setUser] = useState<SignIn>({
        email: "",
        password: ""
    });

    const [errors, setErrors] = useState<{ email: string }>({
        email: ""
    });

    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

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
            await Swal.fire({
                title: 'Invalid Data',
                text: "Please check your email and password.",
                icon: 'error',
                confirmButtonColor: '#d33',
                confirmButtonText: 'Try Again'
            });
            return;
        }

        setIsLoading(true);
        try {
            const token = await SignInTask(user);

            // Wait for login to complete (including userId fetch)
            await login(token);
            
            console.log(token);
            navigate('/requests');
            setUser({ email: "", password: "" });
        } catch (error) {
            console.error("Sign in failed:", error);
            await Swal.fire({
                title: 'Invalid Credentials',
                text: "Please check your email and password.",
                icon: 'error',
                confirmButtonColor: '#d33',
                confirmButtonText: 'Try Again'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.authContainer}>
            <div className={styles.authBackground}></div>
            <div className={styles.authContent}>
                <div className={styles.authHeader}>
                    <h1 className={styles.authTitle}>Welcome Back</h1>
                    <p className={styles.authSubtitle}>Sign in to your account</p>
                </div>

                <Form className={styles.authForm} onSubmit={handleOnSubmit}>
                    <div className={styles.formCard}>
                        <Form.Group className={styles.inputGroup}>
                            <Form.Label className={styles.inputLabel}>Email Address</Form.Label>
                            <div className={styles.inputWrapper}>
                                {FaEnvelope({ className: styles.inputIcon })}
                                <Form.Control
                                    type="email"
                                    placeholder="Enter your email"
                                    name="email"
                                    value={user.email}
                                    onChange={handleOnChange}
                                    className={`${styles.modernInput} ${errors.email ? styles.inputError : ''}`}
                                />
                            </div>
                            {errors.email && <div className={styles.errorMessage}>{errors.email}</div>}
                        </Form.Group>

                        <Form.Group className={styles.inputGroup}>
                            <Form.Label className={styles.inputLabel}>Password</Form.Label>
                            <div className={styles.inputWrapper}>
                                {FaLock({ className: styles.inputIcon })}
                                <Form.Control
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    name="password"
                                    value={user.password}
                                    onChange={handleOnChange}
                                    className={styles.modernInput}
                                />
                                <button
                                    type="button"
                                    className={styles.togglePassword}
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? FaEyeSlash({ size: 16 }) : FaEye({ size: 16 })}
                                </button>
                            </div>
                        </Form.Group>

                        <div className={styles.formActions}>
                            <Button
                                variant="primary"
                                type="submit"
                                className={styles.primaryButton}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <span className={styles.spinner}></span>
                                        Signing In...
                                    </>
                                ) : (
                                    'Sign In'
                                )}
                            </Button>
                        </div>

                        <div className={styles.authFooter}>
                            <p className={styles.authFooterText}>
                                Don't have an account?{' '}
                                <NavLink to="/signup" className={styles.authLink}>
                                    Sign Up
                                </NavLink>
                            </p>
                        </div>
                    </div>
                </Form>
            </div>
        </div>
    );
};