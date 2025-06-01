import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { FaEye, FaEyeSlash, FaEnvelope, FaLock, FaUser, FaPhone } from "react-icons/fa";
import { SignUpTask } from "../../service/Auth";
import { NavLink, useNavigate } from "react-router";
import styles from "./signstyle.module.css";
import { useAuth } from "./AuthProvider";
import Swal from "sweetalert2";

export const SignUp = () => {
    interface User {
        userId: string;
        fullname: string;
        email: string;
        mobile: string;
        password: string;
        role: string;
    }

    const { login } = useAuth();
    const navigate = useNavigate();

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

    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

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

        if (errors.email || errors.mobile || errors.password || !user.fullname || !user.email || !user.mobile || !user.password) {
            await Swal.fire({
                title: 'Invalid Credentials',
                text: "Please check your email and password.",
                icon: 'error',
                confirmButtonColor: '#d33',
                confirmButtonText: 'Try Again'
            });
            return;
        }

        setIsLoading(true);
        try {
            const token = await SignUpTask(user);
            console.log(token);
            login(token);
            setUser({
                userId: '',
                fullname: '',
                email: '',
                mobile: '',
                password: '',
                role: 'USER'
            });
            navigate('/requests');
        } catch (error) {
            console.error("Sign up failed:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.authContainer}>
            <div className={styles.authBackground}></div>
            <div className={styles.authContent}>
                <div className={styles.authHeader}>
                    <h1 className={styles.authTitle}>Create Account</h1>
                    <p className={styles.authSubtitle}>Join us today and get started</p>
                </div>

                <Form className={styles.authForm} onSubmit={handleOnSubmit}>
                    <div className={styles.formCard}>
                        <Form.Group className={styles.inputGroup}>
                            <Form.Label className={styles.inputLabel}>Full Name</Form.Label>
                            <div className={styles.inputWrapper}>
                                {FaUser({ className: styles.inputIcon })}
                                <Form.Control
                                    type="text"
                                    placeholder="Enter your full name"
                                    name="fullname"
                                    value={user.fullname}
                                    onChange={handleOnChange}
                                    className={styles.modernInput}
                                />
                            </div>
                        </Form.Group>

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
                            <Form.Label className={styles.inputLabel}>Contact Number</Form.Label>
                            <div className={styles.inputWrapper}>
                                {FaPhone({ className: styles.inputIcon })}
                                <Form.Control
                                    type="tel"
                                    inputMode="numeric"
                                    placeholder="Enter your mobile number"
                                    name="mobile"
                                    value={user.mobile}
                                    onChange={handleOnChange}
                                    className={`${styles.modernInput} ${errors.mobile ? styles.inputError : ''}`}
                                />
                            </div>
                            {errors.mobile && <div className={styles.errorMessage}>{errors.mobile}</div>}
                        </Form.Group>

                        <Form.Group className={styles.inputGroup}>
                            <Form.Label className={styles.inputLabel}>Password</Form.Label>
                            <div className={styles.inputWrapper}>
                                {FaLock({ className: styles.inputIcon })}
                                <Form.Control
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Create a strong password"
                                    name="password"
                                    value={user.password}
                                    onChange={handleOnChange}
                                    className={`${styles.modernInput} ${errors.password ? styles.inputError : ''}`}
                                />
                                <button
                                    type="button"
                                    className={styles.togglePassword}
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? FaEyeSlash({ size: 16 }) : FaEye({ size: 16 })}
                                </button>
                            </div>
                            {errors.password && <div className={styles.errorMessage}>{errors.password}</div>}
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
                                        Creating Account...
                                    </>
                                ) : (
                                    'Create Account'
                                )}
                            </Button>
                        </div>

                        <div className={styles.authFooter}>
                            <p className={styles.authFooterText}>
                                Already have an account?{' '}
                                <NavLink to="/signin" className={styles.authLink}>
                                    Sign In
                                </NavLink>
                            </p>
                        </div>
                    </div>
                </Form>
            </div>
        </div>
    );
};