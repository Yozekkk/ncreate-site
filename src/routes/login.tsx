import { createFileRoute, Navigate } from "@tanstack/react-router";

import { useAuth } from "../lib";
import { safeAuthRedirect } from "../auth-redirect";
import { AuthForm, SiteShell } from "../ui";

export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: safeAuthRedirect(search.redirect),
  }),
  component: LoginPage,
});

function LoginPage() {
  const auth = useAuth();
  const { redirect } = Route.useSearch();

  if (auth.ready && auth.user) {
    return <Navigate to="/forum" />;
  }

  return (
    <SiteShell>
      <section className="auth-page">
        <div className="auth-art" aria-hidden="true">
          <div className="auth-glow" />
          <img
            src="/images/ncreate/ncreate-image-06.webp"
            srcSet="/images/ncreate/ncreate-image-06-480.webp 480w, /images/ncreate/ncreate-image-06-640.webp 640w, /images/ncreate/ncreate-image-06.webp 865w"
            sizes="(max-width: 820px) 80vw, 520px"
            width="865"
            height="1465"
            alt=""
            loading="eager"
          />
        </div>
        <div className="auth-card">
          <p className="eyebrow">АККАУНТ NCEA</p>
          <h1>Войти</h1>
          <p>Используйте существующий аккаунт NCEA.</p>
          <AuthForm mode="login" redirect={redirect ?? "/forum"} />
        </div>
      </section>
    </SiteShell>
  );
}
