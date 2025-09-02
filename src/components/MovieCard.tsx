import React from 'react';

type Movie = {
  title: string;
  vote_average: number | null;       // API might send null
  poster_path: string | null;        // poster may be missing
  release_date: string | null;       // may be missing
  original_language: string;
};

interface MovieCardProps {
  movie: Movie;
}

const MovieCard = ({ movie }: MovieCardProps) => {
  const { title, vote_average, poster_path, release_date, original_language } = movie;

  return (
    <div className="movie-card">
      <img
        src={poster_path ? `https://image.tmdb.org/t/p/w500/${poster_path}` : './no-movie.png'}
        alt={title}
      />

      <div className="mt-4 movie-info">
        <h3 className="text-white">{title}</h3>

        <div className="content">
          <div className="rating">
            <img src="./star.svg" alt="rating" />
            <p>{typeof vote_average === 'number' ? vote_average.toFixed(1) : 'N/A'}</p>
          </div>

          <span>•</span>
          <p className="lang">{original_language}</p>

          <span>•</span>
          <p className="year">{release_date ? release_date.split('-')[0] : 'N/A'}</p>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
