import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { getCategories, getTopics } from "../../lib";
import { ForumShell, TopicList } from "../../ui";

export const Route = createFileRoute("/forum/")({
  component: ForumPage,
});

function ForumPage() {
  const categories = useQuery({
    queryKey: ["forum-categories"],
    queryFn: getCategories,
  });
  const topics = useQuery({
    queryKey: ["forum-topics"],
    queryFn: () => getTopics(),
  });

  return (
    <ForumShell
      title="Форум NCreate"
      subtitle="Обсуждения сообщества NCreate"
      categories={categories.data ?? []}
    >
      {topics.isError ? (
        <div className="form-alert" role="alert">
          Не удалось загрузить форум
        </div>
      ) : (
        <TopicList topics={topics.data ?? []} />
      )}
    </ForumShell>
  );
}
