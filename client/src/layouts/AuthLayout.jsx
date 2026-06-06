import { CheckSquare2, ShieldCheck } from "lucide-react";
import { Outlet } from "react-router-dom";

const AUTH_LAYOUT_CSS = `
  .taskflow-auth-page {
    min-height: 100vh;
    background:
      radial-gradient(circle at 12% 10%, rgba(215, 232, 174, 0.78), transparent 30%),
      radial-gradient(circle at 88% 86%, rgba(225, 239, 189, 0.72), transparent 32%),
      linear-gradient(180deg, #edf4dc 0%, #e8f0d3 100%);
    color: #173c23;
  }

  .taskflow-auth-shell {
    width: min(100% - 24px, 480px);
    overflow: hidden;
    border: 1px solid rgba(36, 107, 59, 0.14);
    border-radius: 26px;
    background: rgba(255, 255, 255, 0.96);
    box-shadow: 0 30px 80px -48px rgba(23, 60, 35, 0.48);
  }

  .taskflow-auth-header {
    position: relative;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 24px 26px 18px;
    border-bottom: 1px solid #d7e2ca;
    background: linear-gradient(135deg, #e7f49d 0%, #edf4dc 62%, #f8faef 100%);
  }

  .taskflow-auth-header::before {
    content: "";
    position: absolute;
    inset: 0 0 auto;
    height: 6px;
    background: linear-gradient(90deg, #246b3b, #7ca34f, #dce99a);
  }

  .taskflow-auth-logo {
    display: grid;
    width: 44px;
    height: 44px;
    flex: 0 0 44px;
    place-items: center;
    border-radius: 14px;
    background: #246b3b;
    color: #ffffff;
    box-shadow: 0 12px 26px -16px rgba(36, 107, 59, 0.72);
  }

  .taskflow-auth-brand {
    min-width: 0;
  }

  .taskflow-auth-brand-title {
    margin: 0;
    color: #173c23;
    font-size: 18px;
    font-weight: 900;
    letter-spacing: -0.025em;
  }

  .taskflow-auth-brand-copy {
    margin: 2px 0 0;
    color: #68736b;
    font-size: 11px;
  }

  .taskflow-auth-content {
    padding: 26px;
  }

  .taskflow-auth-footer {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 0 20px 22px;
    color: #879287;
    font-size: 10px;
    font-weight: 600;
  }

  @media (max-width: 480px) {
    .taskflow-auth-page {
      align-items: flex-start;
      padding-top: 14px;
      padding-bottom: 14px;
    }

    .taskflow-auth-shell {
      width: min(100% - 16px, 480px);
      border-radius: 22px;
    }

    .taskflow-auth-header {
      padding: 22px 18px 16px;
    }

    .taskflow-auth-content {
      padding: 23px 18px;
    }
  }
`;

export default function AuthLayout() {
  return (
    <main className="taskflow-auth-page flex items-center justify-center px-0 py-6">
      <style>{AUTH_LAYOUT_CSS}</style>

      <section className="taskflow-auth-shell">
        <header className="taskflow-auth-header">
          <div className="taskflow-auth-logo">
            <CheckSquare2 size={21} />
          </div>

          <div className="taskflow-auth-brand">
            <p className="taskflow-auth-brand-title">TaskFlow</p>
            <p className="taskflow-auth-brand-copy">Smart task management</p>
          </div>
        </header>

        <div className="taskflow-auth-content">
          <Outlet />
        </div>

        <footer className="taskflow-auth-footer">
          <ShieldCheck size={12} />
          Secure authentication and protected user data
        </footer>
      </section>
    </main>
  );
}
