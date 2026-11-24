// Control: same shape as app/[slug], but never calls notFound().
export function generateStaticParams() {
  return [{ slug: "a" }];
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <h1>ok {slug}</h1>;
}
