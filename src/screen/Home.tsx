import { useQuery } from "@tanstack/react-query";
import { getMovies, IGetMoviesResult } from "../api/data";
import {
  Wrapper,
  Loader,
  Banner,
  Title,
  Overview,
  Slider,
  Row,
  Box,
  Info,
  BigMovie,
  Overlay,
  BigCover,
  BigTitle,
  BigOverview,
} from "../styles/HomeStyled";
import { makeImagePath } from "../api/utils";
import { AnimatePresence, useScroll } from "framer-motion";
import { useState } from "react";
import { useMatch, useNavigate } from "react-router-dom";

const rowVars = {
  // 사용자의 화면 크기만큼 x 좌표가 멀어져야 함. window.innerWith || window.outerWidth
  hidden: {
    x: window.outerWidth + 5,
  },
  visible: {
    x: 0,
  },
  exit: {
    x: -window.outerWidth - 5,
  },
};

const boxVars = {
  normal: { scale: 1 },
  hover: {
    scale: 1.3,
    y: -50,
    transition: {
      delay: 0.5,
      duration: 0.3,
      type: "tween",
    },
  },
};

const infoVars = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.5,
      duration: 0.3,
      type: "tween",
    },
  },
};

const Home = () => {
  // api
  const { isLoading, data } = useQuery<IGetMoviesResult>({
    queryKey: ["movies", "nowPlaying"],
    queryFn: getMovies,
  });

  // state
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const navigate = useNavigate();
  const bigMovieMatch = useMatch("/movies/:movieId"); // 현재 위치가 해당 라우터와 일치하는지 알려준다. 일치하면 정보반환, 없으면 null
  const offset = 6; // 화면에 보여지는 Slider Movie 최대건수
  const { scrollY } = useScroll(); // 스크롤 정보

  // function
  // 슬라이더 기능. 현재 슬라이더를 떠날거라면 상태값을 설정한다.
  const creaseIndex = () => {
    if (data) {
      if (leaving) return;

      setLeaving(true);
      const totalMovies = data.results.length - 1; // 배너에서 영화 사용중이니 1개는 빼자
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : ++prev));
    }
  };

  // eixt 이벤트가 끝날때 실행됨. 상태값 변경
  const toggleLeaving = () => setLeaving((prev) => !prev);

  // box click시 URL변경
  const onBoxClicked = (movieId: number) => {
    navigate(`/movies/${movieId}`);
  };

  // Overlay Click시 Home으로 이동
  const onOverlayClicked = () => {
    navigate("/");
  };

  const clickedMovie =
    bigMovieMatch?.params.movieId &&
    data?.results.find(
      (movie) => movie.id === Number(bigMovieMatch.params.movieId)
    );

  return (
    <>
      <Wrapper>
        {isLoading ? (
          <Loader></Loader>
        ) : (
          <>
            <Banner
              onClick={creaseIndex}
              $bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")}
            >
              <Title>{data?.results[0].title}</Title>
              <Overview>{data?.results[0].overview}</Overview>
            </Banner>

            <Slider>
              {/* initial: 컴포넌트가 처음 mount될때 애니메이션 동작하지 않음 */}
              {/* onExitComplete: exit이 끝날때 실행되는 기능 */}
              <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
                <Row
                  key={index}
                  variants={rowVars}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ type: "tween", duration: 1 }}
                >
                  {data?.results
                    .slice(1) // 배너에 있는 영화는 제외한다.
                    .slice(offset * index, offset * index + offset)
                    .map((movie) => (
                      <Box
                        // layoutId는 유니크해야 한다.
                        layoutId={String(movie.id)}
                        onClick={() => onBoxClicked(movie.id)}
                        key={movie.id}
                        variants={boxVars}
                        initial="normal"
                        whileHover="hover"
                        // 전체적으로도 tween 지정해줘야 튕기는게 사라진다.
                        transition={{ type: "tween" }}
                        $bgPhoto={makeImagePath(movie.backdrop_path, "w500")}
                      >
                        <Info variants={infoVars}>
                          <h4>{movie.title}</h4>
                        </Info>
                      </Box>
                    ))}
                </Row>
              </AnimatePresence>
            </Slider>

            <AnimatePresence>
              {bigMovieMatch ? (
                <>
                  <Overlay
                    onClick={onOverlayClicked}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  ></Overlay>
                  {/* 서로 다른 영역에 있어서 movie.id를 활용할 수 없다. */}
                  {/* 그래서 bigMovieMatch를 사용하는 것. */}
                  <BigMovie
                    style={{ top: scrollY.get() + 100 }}
                    layoutId={bigMovieMatch.params.movieId}
                  >
                    {clickedMovie && (
                      <>
                        <BigCover
                          style={{
                            backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                              clickedMovie.backdrop_path,
                              "w500"
                            )})`,
                          }}
                        />
                        <BigTitle>{clickedMovie.title}</BigTitle>
                        <BigOverview>{clickedMovie.overview}</BigOverview>
                      </>
                    )}
                  </BigMovie>
                </>
              ) : null}
            </AnimatePresence>
          </>
        )}
      </Wrapper>
    </>
  );
};

export default Home;
