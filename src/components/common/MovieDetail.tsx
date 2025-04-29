import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import ReactPlayer from "react-player/youtube";
import {
  Text,
  Loader,
  Badge,
  Group,
  Center,
  Title,
  Stack,
  Anchor,
  Image,
  Flex,
  List,
  Tooltip,
} from "@mantine/core";
import { tmdbApi } from "../../api/tmdb";
import { useEffect, useState } from "react";
import MovieCard from "../common/MovieCard";
import { Star, ExternalLink } from "lucide-react";

const MovieDetail = () => {
  const { movieId } = useParams<{ movieId: string }>();
  const [trailerUrl, setTrailerUrl] = useState<string | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["movieDetail", movieId],
    queryFn: () => tmdbApi.getMovieDetails(movieId!),
    enabled: !!movieId,
  });

  const { data: videosData } = useQuery({
    queryKey: ["movieVideos", movieId],
    queryFn: () => tmdbApi.getMovieVideos(movieId!),
    enabled: !!movieId,
  });

  useEffect(() => {
    if (videosData?.results?.length > 0) {
      const trailer = videosData.results.find(
        (video: any) =>
          video.type === "Trailer" && video.site === "YouTube" && video.official
      );

      const fallbackTrailer = videosData.results.find(
        (video: any) => video.type === "Trailer" && video.site === "YouTube"
      );

      if (trailer || fallbackTrailer) {
        const videoKey = trailer?.key || fallbackTrailer?.key;
        setTrailerUrl(`https://www.youtube.com/watch?v=${videoKey}`);
      }
    }
  }, [videosData]);

  if (isLoading)
    return (
      <Center>
        <Loader size="xl" />
      </Center>
    );
  if (error || !data)
    return <Text content="center">Failed to load movie details.</Text>;

  return (
    <Stack className="text-white md:py-0 py-18 min-h-screen md:pb-8">
      <div className="relative w-full">
        {trailerUrl ? (
          <div className="w-full aspect-video pt-6">
            <ReactPlayer
              url={trailerUrl}
              width="100%"
              height="100%"
              playing={false}
              controls={true}
            />
          </div>
        ) : (
          <Image
            src={data?.Backdrop}
            alt={data?.Title}
            className="w-full h-full pt-6 object-cover"
            radius={60}
          />
        )}
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black to-transparent md:p-6">
          <Group mx="auto" px="sm" maw={1220}>
            <Group gap={24}>
              <div className="md:block hidden">
                <Image
                  src={data?.Poster}
                  alt={data?.Title}
                  className="w-64 h-96 object-cover shadow-lg"
                  radius={30}
                />
              </div>
              <Stack flex={1}>
                <Title>{data?.Title}</Title>
                <Group>
                  <Group>
                    <Star
                      size={20}
                      className="text-yellow-400 fill-yellow-400"
                    />
                    <span className="text-yellow-400">
                      {Number(data?.imdbRating) * 2}
                    </span>
                  </Group>
                  <span className="text-gray-400">
                    ({data?.imdbVotes} votes)
                  </span>
                </Group>
                <Text c="gray.4">
                  {data?.Runtime} • {data?.Year}
                </Text>
                <div className="md:block hidden">
                  <Group gap="xs">
                    {data?.Genre.split(", ").map((genre: string) => (
                      <Badge
                        key={genre}
                        color="dark"
                        variant="filled"
                        size="lg"
                        className="rounded-full"
                      >
                        {genre}
                      </Badge>
                    ))}
                  </Group>
                </div>
              </Stack>
            </Group>
          </Group>
        </div>
      </div>
      <Stack mx="auto" px="xl" maw={1220}>
        <Stack>
          <Title order={2}>Synopsis</Title>
          <Text size="lg" c="gray.3" className="italic">
            {data?.Plot}
          </Text>
        </Stack>
        <Stack>
          <Title order={2}>Useful Links</Title>
          <Flex gap={16}>
            {data?.Website && data?.Website !== "N/A" && (
              <Anchor
                bg="red"
                px="lg"
                c="black"
                href={data?.Website}
                target="_blank"
                rel="noreferrer"
                className="rounded-full"
              >
                <span className="flex flex-row pt-2 p-2 gap-2">
                  Home Page <ExternalLink size={20} />
                </span>
              </Anchor>
            )}
            <Anchor
              bg="yellow"
              px="lg"
              c="black"
              href={`https://www.imdb.com/title/${data.imdbID}`}
              target="_blank"
              rel="noreferrer"
              className="rounded-full "
            >
              <span className="flex flex-row pt-2 p-2 gap-2">
                IMDb <ExternalLink size={20} />
              </span>
            </Anchor>
          </Flex>
        </Stack>
        {data?.Production && data?.Production !== "N/A" && (
          <Stack>
            <Stack>
              <Title order={2}>Production companies</Title>
              <Flex gap="md">
                {data?.Production.split(", ").map((company: string) => (
                  <List key={company} className="rounded-md">
                    <Badge p="md" bg="indigo.9">
                      {company}
                    </Badge>
                  </List>
                ))}
              </Flex>
            </Stack>
            {((data?.Cast && data?.Cast.length > 0) ||
              (data?.Crew && data?.Crew.length > 0)) && (
              <Stack pt={20}>
                <Group grow align="self-start">
                  {data?.Cast && data?.Cast.length > 0 && (
                    <Stack>
                      <Title order={2}>Cast</Title>
                      <List spacing="xs">
                        {data?.Cast.map((member) => (
                          <List.Item key={`cast-${member.id}`}>
                            <Text fw={500}>{member?.name}</Text>
                            <Text size="sm" c="dimmed">
                              as {member?.character ? member?.character : "N/A"}
                            </Text>
                          </List.Item>
                        ))}
                      </List>
                    </Stack>
                  )}
                  {data.Crew && data.Crew.length > 0 && (
                    <Stack>
                      <Title order={2}>Crew</Title>
                      <List spacing="xs">
                        {data.Crew.map((member) => (
                          <List.Item key={`crew-${member.id}`}>
                            <Text fw={500}>{member?.name}</Text>
                            <Text size="sm" c="dimmed">
                              {member?.job}
                            </Text>
                          </List.Item>
                        ))}
                      </List>
                    </Stack>
                  )}
                </Group>
              </Stack>
            )}
          </Stack>
        )}
        {data?.Reviews && data.Reviews.length > 0 && (
          <Stack>
            <Title order={2}>Reviews</Title>
            <div className="space-y-4">
              {data.Reviews.map((review) => (
                <Tooltip
                  key={review.id}
                  label={review.content}
                  position="bottom"
                  multiline
                  w={1000}
                  withArrow
                  transitionProps={{ transition: "fade", duration: 300 }}
                >
                  <div className="p-4 rounded-2xl bg-slate-800 cursor-pointer">
                    <Group justify="space-between" mb="xs">
                      <Text fw={500} size="lg" >
                        {review?.author}
                      </Text>
                      {review?.rating && (
                        <Text size="sm" className="font-mono italic">
                          {review?.rating}/10
                        </Text>
                      )}
                    </Group>
                    <Text size="sm" c="dimmed" mb="xs">
                      {new Date(review?.created_at).toLocaleDateString()}
                    </Text>
                    <Text lineClamp={3} size="sm" className="italic">
                      {review?.content}
                    </Text>
                  </div>
                </Tooltip>
              ))}
            </div>
          </Stack>
        )}
        {data?.Similar && data?.Similar.length > 0 && (
          <Stack>
            <Title order={2}>Similar Movies</Title>
            <div className="grid grid-cols-1 sm:grid-cols-2 xm:grid-cols-4 psm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
              {data?.Similar.map((movie) => (
                <div key={movie.imdbID} className="flex justify-center">
                  <MovieCard movie={movie} />
                </div>
              ))}
            </div>
          </Stack>
        )}
      </Stack>
    </Stack>
  );
};

export default MovieDetail;