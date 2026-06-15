import { redirect } from "next/navigation";

export default function ExploreRedirect({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  redirect(searchParams.q ? `/locations?q=${encodeURIComponent(searchParams.q)}` : "/locations");
}
