import React, { useState, useEffect } from "react";
import * as Yup from "yup";

const schema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    surname: Yup.string().required("Surname is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
    confirm: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm your password"),
});

const RegistrationForm = ({ setShowRegistration, setShowSignIn, showRegistration }) => {
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        surname: "",
        email: "",
        password: "",
        confirm: "",
    });
    const [errors, setErrors] = useState({})

    useEffect(() => {
        if (!showRegistration) {
          setFormData({
            name: "",
            surname: "",
            email: "",
            password: "",
            confirm: "",
          });
          setErrors({});
        }
    }, [showRegistration]);

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
    }

    const handleShowPassword = (e) => {
        e.preventDefault()
        setShowPassword((prev) => !prev)
    }

    const handleShowConfirm = (e) => {
        e.preventDefault()
        setShowConfirm((prev) => !prev)
    }

    return (<>
        <div className={showRegistration ? "modal-overlay show" : "modal-overlay"}>
            <form className="registration-form" onSubmit={handleSubmit}>
                <h1 className="registration-title">Create new account</h1>
                <div className={errors.name ? "registration-item error" : "registration-item"}>
                    <span>Name</span>
                    <input type="text" name="name" placeholder="Enter your name" value={formData.name} onChange={handleChange} />
                    {errors.name && <p className="form-error-text">{errors.name}</p>}
                </div>
                <div className={errors.surname ? "registration-item error" : "registration-item"}>
                    <span>Surname</span>
                    <input type="text" name="surname" placeholder="Enter your surname" value={formData.surname} onChange={handleChange} />
                    {errors.surname && <p className="form-error-text">{errors.surname}</p>}
                </div>
                <div className={errors.email ? "registration-item error" : "registration-item"}>
                    <span>Email</span>
                    <input type="text" name="email" placeholder="Enter your email address" value={formData.email} onChange={handleChange} />
                    {errors.email && <p className="form-error-text">{errors.email}</p>}
                </div>
                <div className={errors.password ? "registration-item error" : "registration-item"}>
                    <span>Password</span>
                    <div className="password-input"><input type={showPassword ? "text" : "password"} name="password" placeholder="Enter your password" value={formData.password} onChange={handleChange} /><button className="show-password" onClick={handleShowPassword} disabled={!formData.password}>{showPassword ? <i className="ri-eye-line"></i> : <i className="ri-eye-off-line"></i>}</button></div>
                    {errors.password && <p className="form-error-text">{errors.password}</p>}
                </div>
                <div className={errors.confirm ? "registration-item error" : "registration-item"}>
                    <span>Confirm your password</span>
                    <div className="password-input"><input type={showConfirm ? "text" : "password"} name="confirm" placeholder="Enter your password again" value={formData.confirm} onChange={handleChange} /><button className="show-password" onClick={handleShowConfirm} disabled={!formData.confirm}>{showConfirm ? <i className="ri-eye-line"></i> : <i className="ri-eye-off-line"></i>}</button></div>
                    {errors.confirm && <p className="form-error-text">{errors.confirm}</p>}
                </div>
                <span className="reg-check">Already have an account? <a onClick={() => { setShowRegistration(false); setShowSignIn(true) }}>Sign in.</a></span>
                <button className="registration-confirm" type="submit">Register</button>
            </form>
        </div>
    </>)
}

export default RegistrationForm;