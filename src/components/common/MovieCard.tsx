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
        <div className="md:block hidden w-50">
          <SkeletonTheme baseColor="gray" highlightColor="#444">
            <Skeleton height={300} duration={2} />
          </SkeletonTheme>
        </div>
      ) : (
        <Link to={`/movie/${movie?.imdbID}`} className="no-underline">
          <div className="group relative overflow-hidden xm:w-50 xm:h-75 sm:w-50 md:w-50 md:h-75 w-92 h-105 rounded-xl md:mb-0 mb-5 cursor-pointer transition-all duration-200 ease-in-out hover:scale-120 hover:z-[1000] hover:shadow-[rgba(0,0,0,0.25)_0px_54px_55px,rgba(0,0,0,0.12)_0px_-12px_30px,rgba(0,0,0,0.12)_0px_4px_6px,rgba(0,0,0,0.17)_0px_12px_13px,rgba(0,0,0,0.09)_0px_-3px_5px]">
            <Image
              src={movie?.Poster}
              alt={movie?.Title}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 w-[100%] h-72.5 px-4 pb-4 flex flex-col justify-end bg-gradient-to-t from-black to-transparent transition-opacity duration-200 md:opacity-0 md:group-hover:opacity-100">
              <Title order={4} c="white" >
                {movie?.Title}
              </Title>
              <Group justify="space-between">
                <Text fw={600} c="white" className="text-[0.75rem]">
                  {movie?.Year}
                </Text>
                <Group gap="xs" justify="center" align="center">
                  <Star size={20} className="text-yellow-400 fill-yellow-400" />
                  <Text fw={600} c="yellow.4" className="text-[0.75rem]">
                    {movie?.imdbRating || "N/A"}
                  </Text>
                </Group>
              </Group>
              <Text c="white" lineClamp={3} className="italic">
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
