export function ForumState({ error, loading, retry }: { error?: boolean; loading?: boolean; retry: () => unknown }) {
  if (error) return <div className="form-alert" role="alert">Не удалось загрузить форум. <button className="text-button" onClick={retry}>Повторить</button></div>;
  if (loading) return <div className="signin-prompt" role="status">Загружаем форум…</div>;
  return null;
}
