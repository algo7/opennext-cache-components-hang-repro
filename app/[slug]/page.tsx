import { notFound } from "next/navigation";

const KNOWN = ["a", "b"];

export function generateStaticParams() {
  return KNOWN.map((slug) => ({ slug }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!KNOWN.includes(slug)) notFound();
  return <h1>page {slug}</h1>;
}
