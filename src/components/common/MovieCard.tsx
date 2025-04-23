import React, { useState } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Image, Text, Group, Title } from "@mantine/core";
import { Link } from "react-router-dom";
import { MovieCardProps } from "../../types/types";
import { Star } from "lucide-react";

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const [isLoading, setIsLoading] = useState(true);

  if (isLoading) {
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  }

  return (
    <>
      {isLoading ? (
        <div className="w-[200px]">
          <SkeletonTheme baseColor="gray" highlightColor="#444">
            <Skeleton height={300} duration={2} />
          </SkeletonTheme>
        </div>
      ) : (
        <Link
          to={`/movie/${movie?.imdbID}`}
          className="no-underline"
        >
          <div className="group relative overflow-hidden w-[200px] h-[300px] rounded-xl border border-zinc-600 cursor-pointer transition-all duration-200 ease-in-out hover:scale-120 hover:z-[1000] hover:shadow-[rgba(0,0,0,0.25)_0px_54px_55px,rgba(0,0,0,0.12)_0px_-12px_30px,rgba(0,0,0,0.12)_0px_4px_6px,rgba(0,0,0,0.17)_0px_12px_13px,rgba(0,0,0,0.09)_0px_-3px_5px]">
            <Image
              src={movie?.Poster !== "N/A" ? movie?.Poster : "/placeholder.jpg"}
              alt={movie?.Title}
              className="w-full h-[300px] object-cover"
            />
            <div className="absolute bottom-0 w-[100%] h-[290px] px-4 pb-4 flex flex-col justify-end bg-gradient-to-t from-black to-transparent transition-opacity duration-200 opacity-0 group-hover:opacity-100">
              <Title order={4} className="font-black text-base">{movie?.Title}</Title>
              <Group justify="space-between">
                <Text fw={600} className="text-[0.75rem] text-gray-300">
                  {movie?.Year}
                </Text>
                <Group gap="xs" className="items-center">
                  <Star size={20} className="text-yellow-400 fill-yellow-400"/>
                  <Text fw={600} className="text-[0.75rem] text-yellow-400">
                    {movie?.imdbRating || "N/A"}
                  </Text>
                </Group>
              </Group>
              <Text className="text-[0.75rem] italic text-gray-200 line-clamp-3">
                {movie?.Plot || "No plot available"}
              </Text>
            </div>
          </div>
        </Link>
      )}
    </>
  );
};

export default MovieCard;
