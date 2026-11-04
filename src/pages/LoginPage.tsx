import { useState, type FormEvent } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface LocationState {
  from?: { pathname: string };
}

export default function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as LocationState | null)?.from?.pathname ?? "/";
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (user) return <Navigate to={from} replace />;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (login(username, password)) navigate(from, { replace: true });
    else setError("Tên đăng nhập trống hoặc mật khẩu sai (mật khẩu: 123456).");
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h1>Đăng nhập</h1>
      <input className="input" placeholder="Tên đăng nhập" value={username} onChange={(e) => setUsername(e.target.value)} />
      <input className="input" type="password" placeholder="Mật khẩu" value={password} onChange={(e) => setPassword(e.target.value)} />
      {error && <p className="error">{error}</p>}
      <button className="btn btn-primary" type="submit">Đăng nhập</button>
    </form>
  );
}
