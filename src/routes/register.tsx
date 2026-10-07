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
            src="/images/ncreate/ncreate-image-08.webp"
            srcSet="/images/ncreate/ncreate-image-08-480.webp 480w, /images/ncreate/ncreate-image-08-640.webp 640w, /images/ncreate/ncreate-image-08.webp 898w"
            sizes="(max-width: 820px) 80vw, 520px"
            width="898"
            height="1076"
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
