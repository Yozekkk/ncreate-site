import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { getCategories, getTopics } from "../../lib";
import { ForumState } from "../../forum-state";
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
      <ForumState error={topics.isError || categories.isError} loading={topics.isPending || categories.isPending} retry={() => { void topics.refetch(); void categories.refetch(); }} />
      {!topics.isPending && !topics.isError && !categories.isError && <TopicList topics={topics.data ?? []} />}
    </ForumShell>
  );
}
