import SuitPageClient from './SuitPageClient';

interface SuitPageProps {
  params: Promise<{
    suit: string;
  }>;
}

export default async function SuitPage({ params }: SuitPageProps) {
  const resolvedParams = await params;
  const { suit } = resolvedParams;
  
  return <SuitPageClient suit={suit} />;
}
