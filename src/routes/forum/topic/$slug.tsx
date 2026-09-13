import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Lock, Pin } from "lucide-react";

import {
  formatDate,
  getCategories,
  getPosts,
  getTopic,
  useAuth,
} from "../../../lib";
import { ForumShell, ReplyForm } from "../../../ui";

export const Route = createFileRoute("/forum/topic/$slug")({
  component: TopicPage,
});

function TopicPage() {
  const { slug } = Route.useParams();
  const auth = useAuth();
  const queryClient = useQueryClient();
  const categories = useQuery({
    queryKey: ["forum-categories"],
    queryFn: getCategories,
  });
  const topic = useQuery({
    queryKey: ["forum-topic", slug],
    queryFn: () => getTopic(slug),
  });
  const posts = useQuery({
    queryKey: ["forum-posts", topic.data?.id],
    queryFn: () => getPosts(topic.data!.id),
    enabled: Boolean(topic.data),
  });

  if (!topic.isPending && !topic.data) {
    return (
      <ForumShell title="Тема не найдена" categories={categories.data ?? []}>
        <div className="empty-state">
          <span>0</span>
          <h2>Тема недоступна</h2>
          <p>Скоро будет</p>
        </div>
      </ForumShell>
    );
  }

  const refreshPosts = async () => {
    await queryClient.invalidateQueries({
      queryKey: ["forum-posts", topic.data?.id],
    });
  };

  return (
    <ForumShell
      title={topic.data?.title ?? "Форум NCreate"}
      subtitle={topic.data ? `${topic.data.author_name} · ${formatDate(topic.data.created_at)}` : "Скоро будет"}
      categories={categories.data ?? []}
    >
      <div className="topic-badges">
        {topic.data?.is_pinned ? <span><Pin aria-hidden="true" />Закреплено</span> : null}
        {topic.data?.is_locked ? <span><Lock aria-hidden="true" />Закрыто</span> : null}
      </div>
      <div className="post-list">
        {(posts.data ?? []).map((post, index) => (
          <article className="forum-post" key={post.id}>
            <aside>
              <span className="avatar">{post.author_name.slice(0, 1).toUpperCase()}</span>
              <strong>{post.author_name}</strong>
              <small>#{index + 1}</small>
            </aside>
            <div>
              <time dateTime={post.created_at}>{formatDate(post.created_at)}</time>
              <p>{post.body}</p>
            </div>
          </article>
        ))}
      </div>
      {topic.data?.is_locked ? (
        <div className="signin-prompt">
          <Lock aria-hidden="true" />
          Тема закрыта для новых ответов.
        </div>
      ) : auth.user && topic.data ? (
        <ReplyForm topicId={topic.data.id} onCreated={refreshPosts} />
      ) : (
        <div className="signin-prompt">
          Войдите, чтобы ответить.{" "}
          <Link
            to="/login"
            search={{ redirect: `/forum/topic/${slug}` }}
          >
            Войти
          </Link>
        </div>
      )}
    </ForumShell>
  );
}
