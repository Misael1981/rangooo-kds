interface OperationalPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function OperationalPage() {
  return (
    <>
      <h1>Sistema Operacional</h1>
    </>
  );
}
