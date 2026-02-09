import CardPageClient from './CardPageClient';

interface CardPageProps {
  params: Promise<{
    cardId: string;
  }>;
}

export default async function CardPage({ params }: CardPageProps) {
  const resolvedParams = await params;
  const { cardId } = resolvedParams;
  
  return <CardPageClient cardId={cardId} />;
}
