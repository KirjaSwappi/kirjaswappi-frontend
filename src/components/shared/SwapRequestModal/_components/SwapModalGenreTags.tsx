/* eslint-disable @typescript-eslint/no-explicit-any */
const GenreTags = ({ swappableGenres }: { swappableGenres: any }) => {
  if (!swappableGenres.length) return null;

  return (
    <div className="flex flex-wrap gap-1 mt-3">
      <p className="text-grayDark font-poppins text-xs">Condition Genre:</p>
      {swappableGenres.map((genre: { name: string }, index: number) => (
        <p key={index} className="font-poppins text-blackOlive text-xs">
          {genre?.name}
          {swappableGenres.length - 2 === index
            ? ' &'
            : index < swappableGenres.length - 1
              ? ','
              : ''}
        </p>
      ))}
    </div>
  );
};
export default GenreTags;
