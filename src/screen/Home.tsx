import { useQuery } from "@tanstack/react-query";
import { getMovies } from "../api/data";

const Home = () => {
  const { isLoading, data } = useQuery({
    queryKey: ["movies", "nowPlaying"],
    queryFn: getMovies,
  });

  return (
    <>
      <div style={{ backgroundColor: "whitesmoke", height: "200vg" }}></div>
    </>
  );
};

export default Home;
