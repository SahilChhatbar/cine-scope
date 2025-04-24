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
} from "@mantine/core";
import { tmdbApi } from "../../api/tmdb";
import { useEffect, useState } from "react";
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
    <Stack className="bg-slate-900 text-white min-h-screen pb-4">
      <div className="relative w-full md:py-0 py-15">
        {trailerUrl ? (
          <div className="w-full aspect-video">
            <ReactPlayer
              url={trailerUrl}
              width="100%"
              height="100%"
              playing={false}
              controls={true}
              light={
                data?.Backdrop 
              }
            />
          </div>
        ) : (
          <Image
            src={data?.Backdrop }
            alt={data?.Title}
            className="w-full h-[50vh] object-cover"
            radius={10}
          />
        )}
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black to-transparent p-6">
          <Group mx="auto" className="max-w-6xl">
            <Group gap={24}>
              <Image
                src={data?.Poster}
                alt={data?.Title}
                className="w-64 h-96 object-cover shadow-lg hidden md:block"
                radius={10}
              />
              <Stack className="flex-1">
                <Title order={1} className="text-4xl font-bold ">
                  {data?.Title}
                </Title>
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
                <Text className="text-gray-300 ">
                  {data?.Runtime} • {data?.Year}
                </Text>
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
              </Stack>
            </Group>
          </Group>
        </div>
      </div>
      <Stack mx="auto" className="max-w-6xl">
        <Stack>
          <Title order={2}>Synopsis</Title>
          <Text size="lg" className="text-gray-300 leading-relaxed">
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
                className="rounded-full "
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
          <div className="md:block hidden">
            <Stack>
              <Title order={2}>Production companies</Title>
              <Flex gap="md">
                {data?.Production.split(", ").map((company: string) => (
                  <List key={company} className=" rounded-md">
                    <Badge p="md" bg="indigo.9">
                      {company}
                    </Badge>
                  </List>
                ))}
              </Flex>
            </Stack>
          </div>
        )}
      </Stack>
    </Stack>
  );
};

export default MovieDetail;
