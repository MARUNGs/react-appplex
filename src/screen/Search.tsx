import { useLocation } from "react-router-dom";

const Search = () => {
  const location = useLocation();

  // 내가 찾고자 하는 Query String Parameter를 조회하자.
  const search = new URLSearchParams(location.search);
  const keyword = search.get("keyword");

  return <></>;
};

export default Search;
