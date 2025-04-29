import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../requests/firebase_db";
import * as Yup from "yup";
import { signInWithEmailAndPassword } from "firebase/auth";

const schema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().required("Password is required")
});

const SignInForm = ({ showSignin, setShowSignIn }) => {
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [errors, setErrors] = useState({})
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false)

    const navigate = useNavigate()

    useEffect(() => {
        if (!showSignin) {
          setFormData({
            email: "",
            password: "",
          });
          setErrors({});
        }
    }, [showSignin]);

    const validate = async () => {
        try {
          await schema.validate(formData, { abortEarly: false });
          setErrors({});
        } catch (err) {
          const newErrors = {};
          err.inner.forEach((e) => {
            newErrors[e.path] = e.message;
          });
          setErrors(newErrors);
        }
    };
    
    const handleChange = (e) => {
        setFormData({
          ...formData,
          [e.target.name]: e.target.value,
        });
        setErrors({})
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        await validate()

        setIsSubmitting(true);
        setIsSuccess(false);

        if (Object.keys(errors).length === 0) {
            try {
                const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
                
                if (userCredential) {
                    setIsSuccess(true);
                    setTimeout(() => { setIsSuccess(false); setShowSignIn(false) }, 2000);
                }
            } catch (err) {
                console.log(errors)
                console.error(err.code)
                if (err.code === "auth/invalid-credential") {
                    setErrors(prevErrors => ({
                        ...prevErrors,
                        email: "Incorrect password or email",
                        password: "Incorrect password or email"
                    }));
                }
            }
        }
        setIsSubmitting(false);
    }

    const handleShowPassword = (e) => {
        e.preventDefault()
        setShowPassword((prev) => !prev)
    }

    return (<>
        <div className={showSignin ? "modal-overlay show" : "modal-overlay"}>
            <form className="signin-form" onSubmit={handleSubmit}>
                <h1 className="signin-title">Login in</h1>
                <div className={errors.email ? "signin-item error" : "signin-item"}>
                    <span>Email</span>
                    <input type="text" name="email" placeholder="Enter your email" value={formData.email} onChange={handleChange} />
                    {errors.email && <p className="form-error-text">{errors.email}</p>}
                </div>
                <div className={errors.password ? "signin-item error" : "signin-item"}>
                    <span>Password</span>
                    <div className="password-input"><input type={showPassword ? "text" : "password"} name="password" placeholder="Enter your password" value={formData.password} onChange={handleChange} /><button className="show-password" onClick={handleShowPassword} disabled={!formData.password}>{showPassword ? <i className="ri-eye-line"></i> : <i className="ri-eye-off-line"></i>}</button></div>
                    {errors.password && <p className="form-error-text">{errors.password}</p>}
                </div>
                <a className="forget-password" onClick={() => { navigate("/password-recovery"); setShowSignIn(false)}}>Forget password?</a>
                <button className={`signin-confirm ${isSuccess ? "success" : ""}`} type="submit">{isSubmitting ? <div className="spinner"><i className="ri-loader-4-line spinner-icon"></i></div> : isSuccess ? <span>Success <i className="ri-check-line"></i></span> : "Sign in"}</button>
            </form>
        </div>
    </>)
}

export default SignInForm;