import { createFileRoute, Navigate } from "@tanstack/react-router";

import { useAuth } from "../lib";
import { AuthForm, SiteShell } from "../ui";

export const Route = createFileRoute("/register")({
  component: RegisterPage,
});

function RegisterPage() {
  const auth = useAuth();

  if (auth.ready && auth.user) {
    return <Navigate to="/forum" />;
  }

  return (
    <SiteShell>
      <section className="auth-page reverse">
        <div className="auth-art accent" aria-hidden="true">
          <div className="auth-glow" />
          <img
            src="/images/ncreate/mascot-back.webp"
            srcSet="/images/ncreate/mascot-back-480.webp 480w, /images/ncreate/mascot-back.webp 552w"
            sizes="(max-width: 820px) 80vw, 520px"
            width="552"
            height="1199"
            alt=""
            loading="eager"
          />
        </div>
        <div className="auth-card">
          <p className="eyebrow">ОБЩИЙ АККАУНТ</p>
          <h1>Регистрация</h1>
          <p>Один аккаунт для NCEA и NCreate.</p>
          <AuthForm mode="register" />
        </div>
      </section>
    </SiteShell>
  );
}
