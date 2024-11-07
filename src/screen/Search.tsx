import { useLocation } from "react-router-dom";

const Search = () => {
  const location = useLocation();

  // 내가 찾고자 하는 Query String Parameter를 조회하자.
  const search = new URLSearchParams(location.search);
  const keyword = search.get("keyword");
  console.log(keyword);

  // movie, tv list 중 검색키워드에 맞는 것만 보여주기

  return <></>;
};

export default Search;
