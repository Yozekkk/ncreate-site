import { ForumState } from "../../../forum-state";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";

import { getCategories, getCategory, getTopics, useAuth } from "../../../lib";
import { ForumShell, TopicForm, TopicList } from "../../../ui";

export const Route = createFileRoute("/forum/category/$slug")({
  component: CategoryPage,
});

function CategoryPage() {
  const { slug } = Route.useParams();
  const auth = useAuth();
  const categories = useQuery({
    queryKey: ["forum-categories"],
    queryFn: getCategories,
  });
  const category = useQuery({
    queryKey: ["forum-category", slug],
    queryFn: () => getCategory(slug),
  });
  const topics = useQuery({
    queryKey: ["forum-topics", category.data?.id],
    queryFn: () => getTopics(category.data?.id),
    enabled: Boolean(category.data),
  });

  if (category.isPending || category.isError) return <ForumShell title="Форум NCreate" categories={categories.data ?? []}><ForumState error={category.isError} loading={category.isPending} retry={() => { void category.refetch(); void categories.refetch(); } } /></ForumShell>;

  if (!category.isPending && !category.isError && !category.data) {
    return (
      <ForumShell title="Категория не найдена" categories={categories.data ?? []}>
        <div className="empty-state">
          <span>0</span>
          <h2>Категория недоступна</h2>
          <p>Скоро будет</p>
        </div>
      </ForumShell>
    );
  }

  return (
    <ForumShell
      title={category.data?.name ?? "Форум NCreate"}
      subtitle={category.data?.description ?? "Скоро будет"}
      categories={categories.data ?? []}
    >
      <div className="category-page">
        <ForumState error={topics.isError || categories.isError} loading={topics.isPending} retry={() => { void topics.refetch(); void categories.refetch(); }} />
        {!topics.isPending && !topics.isError && <TopicList topics={topics.data ?? []} />}
        {auth.user && category.data ? (
          <TopicForm categoryId={category.data.id} />
        ) : (
          <div className="signin-prompt">
            Войдите, чтобы создать тему.{" "}
            <Link
              to="/login"
              search={{ redirect: `/forum/category/${slug}` }}
            >
              Войти
            </Link>
          </div>
        )}
      </div>
    </ForumShell>
  );
}
