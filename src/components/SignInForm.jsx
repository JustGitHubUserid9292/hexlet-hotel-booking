import React, { useState, useEffect } from "react";
import * as Yup from "yup";

const schema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
});

const SignInForm = ({ showSignin }) => {
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [errors, setErrors] = useState({})

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
                </div>
                <a className="forget-password">Forget password?</a>
                <button className="signin-confirm" type="submit">Sign in</button>
            </form>
        </div>
    </>)
}

export default SignInForm;

/*/{errors.password && <p className="form-error-text">{errors.password}</p>}/*/