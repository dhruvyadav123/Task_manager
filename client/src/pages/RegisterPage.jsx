import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { z } from "zod";

import { getApiError, http } from "../api/http";
import { useAuth } from "../context/AuthContext";

const schema = z.object({
  name: z.string().trim().min(2, "Enter at least 2 characters"),
  email: z.string().trim().email("Enter a valid email address"),
  password: z.string().min(6, "Password must contain at least 6 characters"),
});

const REGISTER_FORM_CSS = `
  .register-form-page {
    color: #173c23;
  }

  .register-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    margin: 0;
    color: #246b3b;
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.16em;
    text-transform: uppercase;
  }

  .register-title {
    margin: 9px 0 0;
    color: #17251b;
    font-size: 31px;
    font-weight: 900;
    line-height: 1.14;
    letter-spacing: -0.04em;
  }

  .register-subtitle {
    margin: 8px 0 0;
    color: #68736b;
    font-size: 13px;
    line-height: 1.6;
  }

  .register-form {
    display: grid;
    gap: 15px;
    margin-top: 24px;
  }

  .register-label {
    display: block;
    margin-bottom: 7px;
    color: #273a2b;
    font-size: 12px;
    font-weight: 800;
  }

  .register-field {
    position: relative;
    display: block;
  }

  .register-field-icon {
    position: absolute;
    top: 50%;
    left: 14px;
    color: #859187;
    transform: translateY(-50%);
    pointer-events: none;
  }

  .register-input {
    width: 100%;
    height: 47px;
    border: 1px solid #d4dfc8;
    border-radius: 14px;
    background: #f8faf5;
    padding: 0 44px;
    color: #17251b;
    font-size: 14px;
    font-weight: 600;
    outline: none;
    transition:
      background 0.18s ease,
      border-color 0.18s ease,
      box-shadow 0.18s ease;
  }

  .register-input::placeholder {
    color: #9aa59c;
    font-weight: 500;
  }

  .register-input:hover {
    border-color: #bccdac;
  }

  .register-input:focus {
    border-color: #78a25a;
    background: #ffffff;
    box-shadow: 0 0 0 4px rgba(120, 162, 90, 0.15);
  }

  .register-password-toggle {
    position: absolute;
    top: 50%;
    right: 9px;
    display: grid;
    width: 34px;
    height: 34px;
    place-items: center;
    border: 0;
    border-radius: 10px;
    background: transparent;
    color: #76847a;
    cursor: pointer;
    transform: translateY(-50%);
    transition: background 0.18s ease, color 0.18s ease;
  }

  .register-password-toggle:hover {
    background: #e7f1cf;
    color: #246b3b;
  }

  .register-error {
    margin: 6px 0 0;
    color: #be123c;
    font-size: 11px;
    font-weight: 600;
  }

  .register-submit {
    display: inline-flex;
    width: 100%;
    height: 48px;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-top: 2px;
    border: 0;
    border-radius: 14px;
    background: #246b3b;
    color: #ffffff;
    font-size: 14px;
    font-weight: 900;
    cursor: pointer;
    box-shadow: 0 14px 30px -18px rgba(36, 107, 59, 0.75);
    transition:
      transform 0.18s ease,
      background 0.18s ease,
      box-shadow 0.18s ease;
  }

  .register-submit:hover:not(:disabled) {
    transform: translateY(-1px);
    background: #1f5d34;
    box-shadow: 0 18px 34px -20px rgba(36, 107, 59, 0.84);
  }

  .register-submit:disabled {
    cursor: not-allowed;
    opacity: 0.62;
  }

  .register-login {
    margin: 20px 0 0;
    text-align: center;
    color: #68736b;
    font-size: 12px;
  }

  .register-login a {
    color: #246b3b;
    font-weight: 800;
    text-decoration: none;
  }

  .register-login a:hover {
    color: #1f5d34;
  }

  @media (max-width: 480px) {
    .register-title {
      font-size: 27px;
    }
  }
`;

export default function RegisterPage() {
  const { user, saveSession } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const submit = async (values) => {
    try {
      const { data } = await http.post("/auth/register", values);
      saveSession(data);
      toast.success("Account created successfully");
      navigate("/dashboard", { replace: true });
    } catch (error) {
      toast.error(getApiError(error, "Registration failed"));
    }
  };

  return (
    <div className="register-form-page">
      <style>{REGISTER_FORM_CSS}</style>

      <p className="register-eyebrow">
        <ShieldCheck size={13} />
        Create account
      </p>

      <h1 className="register-title">Join TaskFlow</h1>
      <p className="register-subtitle">
        Create your account and start organizing your work.
      </p>

      <form
        onSubmit={handleSubmit(submit)}
        className="register-form"
        noValidate
      >
        <label>
          <span className="register-label">Full name</span>

          <span className="register-field">
            <UserRound
              className="register-field-icon"
              size={17}
              aria-hidden="true"
            />

            <input
              type="text"
              autoComplete="name"
              placeholder="Your full name"
              className="register-input"
              aria-invalid={Boolean(errors.name)}
              {...register("name")}
            />
          </span>

          {errors.name ? (
            <p className="register-error">{errors.name.message}</p>
          ) : null}
        </label>

        <label>
          <span className="register-label">Email address</span>

          <span className="register-field">
            <Mail
              className="register-field-icon"
              size={17}
              aria-hidden="true"
            />

            <input
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              className="register-input"
              aria-invalid={Boolean(errors.email)}
              {...register("email")}
            />
          </span>

          {errors.email ? (
            <p className="register-error">{errors.email.message}</p>
          ) : null}
        </label>

        <label>
          <span className="register-label">Password</span>

          <span className="register-field">
            <LockKeyhole
              className="register-field-icon"
              size={17}
              aria-hidden="true"
            />

            <input
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Minimum 6 characters"
              className="register-input"
              aria-invalid={Boolean(errors.password)}
              {...register("password")}
            />

            <button
              type="button"
              className="register-password-toggle"
              onClick={() => setShowPassword((current) => !current)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              title={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </span>

          {errors.password ? (
            <p className="register-error">{errors.password.message}</p>
          ) : null}
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className="register-submit"
        >
          {isSubmitting ? "Creating account..." : "Create account"}
          <ArrowRight size={17} />
        </button>
      </form>

      <p className="register-login">
        Already registered? <Link to="/login">Sign in</Link>
      </p>
    </div>
  );
}
