'use client';

export default function TarotCard({ data, reversed, isRevealed, onReveal }: {
  data: any,
  reversed: boolean,
  isRevealed: boolean,
  onReveal: () => void
}) {
  return (
    <div
      onClick={onReveal}
      className="cursor-pointer w-32 h-48 rounded overflow-hidden shadow border bg-white flex items-center justify-center"
    >
      {isRevealed ? (
        <img
          src={data.image}
          alt={data.name}
          className={`w-full h-full object-cover ${reversed ? 'rotate-180' : ''}`}
        />
      ) : (
        <div className="w-full h-full bg-purple-200 flex items-center justify-center text-2xl font-bold text-white">
          ?
        </div>
      )}
    </div>
  );
}
