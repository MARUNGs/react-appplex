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
} from "../styles/HomeStyled";
import { makeImagePath } from "../api/utils";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";

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
  const { isLoading, data } = useQuery<IGetMoviesResult>({
    queryKey: ["movies", "nowPlaying"],
    queryFn: getMovies,
  });
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);

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

  // 영화 수
  const offset = 6;

  return (
    <>
      <Wrapper>
        {isLoading ? (
          <Loader></Loader>
        ) : (
          <>
            <Banner
              onClick={creaseIndex}
              bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")}
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
                        key={movie.id}
                        variants={boxVars}
                        initial="normal"
                        whileHover="hover"
                        // 전체적으로도 tween 지정해줘야 튕기는게 사라진다.
                        transition={{ type: "tween" }}
                        bgPhoto={makeImagePath(movie.backdrop_path, "w500")}
                      >
                        <Info variants={infoVars}>
                          <h4>{movie.title}</h4>
                        </Info>
                      </Box>
                    ))}
                </Row>
              </AnimatePresence>
            </Slider>
          </>
        )}
      </Wrapper>
    </>
  );
};

export default Home;
