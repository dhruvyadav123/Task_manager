import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { z } from "zod";

import { getApiError, http } from "../api/http";
import { useAuth } from "../context/AuthContext";

const schema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
  password: z.string().min(6, "Password must contain at least 6 characters"),
});

const LOGIN_FORM_CSS = `
  .login-form-page {
    color: #173c23;
  }

  .login-eyebrow {
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

  .login-title {
    margin: 9px 0 0;
    color: #17251b;
    font-size: 31px;
    font-weight: 900;
    line-height: 1.14;
    letter-spacing: -0.04em;
  }

  .login-subtitle {
    margin: 8px 0 0;
    color: #68736b;
    font-size: 13px;
    line-height: 1.6;
  }

  .login-form {
    display: grid;
    gap: 17px;
    margin-top: 26px;
  }

  .login-label {
    display: block;
    margin-bottom: 7px;
    color: #273a2b;
    font-size: 12px;
    font-weight: 800;
  }

  .login-field {
    position: relative;
    display: block;
  }

  .login-field-icon {
    position: absolute;
    top: 50%;
    left: 14px;
    color: #859187;
    transform: translateY(-50%);
    pointer-events: none;
  }

  .login-input {
    width: 100%;
    height: 48px;
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

  .login-input::placeholder {
    color: #9aa59c;
    font-weight: 500;
  }

  .login-input:hover {
    border-color: #bccdac;
  }

  .login-input:focus {
    border-color: #78a25a;
    background: #ffffff;
    box-shadow: 0 0 0 4px rgba(120, 162, 90, 0.15);
  }

  .login-password-toggle {
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

  .login-password-toggle:hover {
    background: #e7f1cf;
    color: #246b3b;
  }

  .login-error {
    margin: 6px 0 0;
    color: #be123c;
    font-size: 11px;
    font-weight: 600;
  }

  .login-submit {
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

  .login-submit:hover:not(:disabled) {
    transform: translateY(-1px);
    background: #1f5d34;
    box-shadow: 0 18px 34px -20px rgba(36, 107, 59, 0.84);
  }

  .login-submit:disabled {
    cursor: not-allowed;
    opacity: 0.62;
  }

  .login-register {
    margin: 21px 0 0;
    text-align: center;
    color: #68736b;
    font-size: 12px;
  }

  .login-register a {
    color: #246b3b;
    font-weight: 800;
    text-decoration: none;
  }

  .login-register a:hover {
    color: #1f5d34;
  }

  @media (max-width: 480px) {
    .login-title {
      font-size: 27px;
    }
  }
`;

export default function LoginPage() {
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
      email: "",
      password: "",
    },
  });

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const submit = async (values) => {
    try {
      const { data } = await http.post("/auth/login", values);
      saveSession(data);
      toast.success("Welcome back!");
      navigate("/dashboard", { replace: true });
    } catch (error) {
      toast.error(getApiError(error, "Login failed"));
    }
  };

  return (
    <div className="login-form-page">
      <style>{LOGIN_FORM_CSS}</style>

      <p className="login-eyebrow">
        <ShieldCheck size={13} />
        Secure sign in
      </p>

      <h1 className="login-title">Welcome back</h1>
      <p className="login-subtitle">Sign in to continue to your workspace.</p>

      <form
        onSubmit={handleSubmit(submit)}
        className="login-form"
        noValidate
      >
        <label>
          <span className="login-label">Email address</span>

          <span className="login-field">
            <Mail
              className="login-field-icon"
              size={17}
              aria-hidden="true"
            />

            <input
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              className="login-input"
              aria-invalid={Boolean(errors.email)}
              {...register("email")}
            />
          </span>

          {errors.email ? (
            <p className="login-error">{errors.email.message}</p>
          ) : null}
        </label>

        <label>
          <span className="login-label">Password</span>

          <span className="login-field">
            <LockKeyhole
              className="login-field-icon"
              size={17}
              aria-hidden="true"
            />

            <input
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Enter your password"
              className="login-input"
              aria-invalid={Boolean(errors.password)}
              {...register("password")}
            />

            <button
              type="button"
              className="login-password-toggle"
              onClick={() => setShowPassword((current) => !current)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              title={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </span>

          {errors.password ? (
            <p className="login-error">{errors.password.message}</p>
          ) : null}
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className="login-submit"
        >
          {isSubmitting ? "Signing in..." : "Sign in"}
          <ArrowRight size={17} />
        </button>
      </form>

      <p className="login-register">
        New to TaskFlow? <Link to="/register">Create an account</Link>
      </p>
    </div>
  );
}
