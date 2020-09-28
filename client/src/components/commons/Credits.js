import React, { useEffect, useState } from "react";
import axios from "axios";
import Row from "../commons/Row";
//import Credits from "../../commons/Credits";
import "../commons/Row.css";
import { API_URL, API_KEY, requests, fetchCasts,} from "../Config";
import GridCards from "../commons/GridCards";
import MainNavbar from "../views/NavBar/MainNavbar";
import Favorite from "../views/MovieDetail/Sections/Favorite";
import LikeDislikes from "../views/MovieDetail/Sections/LikeDislikes";
import Comments from "../views/MovieDetail/Sections/Comments";
import MovieInfo from "../views/MovieDetail/Sections/MovieInfo";
import { Grid, Button, Modal, Embed, Segment, Header } from "semantic-ui-react";
import { Link } from "react-router-dom";
import YouTube from "react-youtube";
import movieTrailer from "movie-trailer";
//import ReactPlayer from "react-player";
//import VideoPlayer from "../../commons/VideoPlayer";

const base_url = "https://image.tmdb.org/t/p/original/";
//const youtubeUrl = "https://www.youtube.com/watch?v=";

function Credits(props, match) {
  const [trailerUrl, setTrailerUrl] = useState("");

   const movieId = props.match.params.movieId;
   let params = match.params;
  // const movieId = props.match.params.creditId;
  const [Movie, setMovie] = useState([]);
  const [Casts, setCasts] = useState([]);
  const [CommentLists, setCommentLists] = useState([]);
  const [LoadingForMovie, setLoadingForMovie] = useState(true);
  const [LoadingForCasts, setLoadingForCasts] = useState(true);
  const movieVariable = {
    movieId: movieId,
  };

  useEffect(() => {
    const fetchAPI = async () => {
      setCasts(await fetchCasts(movieId));
    };

    fetchAPI();
  }, [movieId]);

  useEffect(() => {
    async function fetchData() {
      // pick random movie for
      const request = await axios.get(requests.fetchTrending);
      setMovie(
        request.data.results[
          Math.floor(Math.random() * request.data.results.length - 1)
        ]
      );
      //return request;
    }
    fetchData();
  }, []);

  useEffect(() => {
    let endpointForMovieInfo = `${API_URL}movie/${movieId}?api_key=${API_KEY}&language=en-US`;
    fetchDetailInfo(endpointForMovieInfo);

    axios.post("/api/comment/getComments", movieVariable).then((response) => {
      console.log(response);
      if (response.data.success) {
        console.log("response.data.comments", response.data.comments);
        setCommentLists(response.data.comments);
      } else {
        alert("Failed to get comments Info");
      }
    });
  }, []);

  const fetchDetailInfo = (endpoint) => {
    fetch(endpoint)
      .then((result) => result.json())
      .then((result) => {
        console.log(result);
        setMovie(result);
        setLoadingForMovie(false);

        let endpointForCasts = `${API_URL}movie/${movieId}/credits?api_key=${API_KEY}`;
        fetch(endpointForCasts)
          .then((result) => result.json())
          .then((result) => {
            console.log(result);
            setCasts(result.cast);
          });

        setLoadingForCasts(false);
      })
      .catch((error) => console.error("Error:", error));
  };

  const updateComment = (newComment) => {
    setCommentLists(CommentLists.concat(newComment));
  };

  const opts = {
    height: "500",
    width: "800",
    playerVars: {
      autoplay: 1,
    },
  };
  const handleClick = (Movie) => {
    if (trailerUrl) {
      setTrailerUrl("");
    } else {
      movieTrailer(Movie?.title || Movie?.name || Movie?.original_name)
        .then((url) => {
          const urlParams = new URLSearchParams(new URL(url).search);
          setTrailerUrl(urlParams.get("v"));
        })
        .catch((error) => console.log(error));
    }
  };

  const [open, setOpen] = React.useState(false);

  return (
    <div style={{ paddingTop: "4rem" }}>
      <MainNavbar />
      {/* Header */}
      <header
        className="banner"
        style={{
          color: "white",
          backgroundSize: "cover",
          backgroundImage: `url("${base_url}${Movie?.backdrop_path}")`,
          backgroundPosition: "center center",
        }}
      >
        <div className="banner_contents">
          <h1 className="banner_title">
            {Movie?.title || Movie?.name || Movie?.original_name}
          </h1>
          <div className="banner_buttons">
            <Link>
              <button className="banner_button">Play</button>
            </Link>
            <Link>
              <Modal
                basic
                closeIcon
                centered
                onClose={() => setOpen(false)}
                onOpen={() => setOpen(true)}
                open={open}
                trigger={
                  <button
                    className="banner_button"
                    onClick={() => handleClick(Movie)}
                  >
                    Watch Trailer
                  </button>
                }
                style={{ width: "55%" }}
              >
                <Header style={{ justifyContent: "center" }}>
                  {trailerUrl && <YouTube videoId={trailerUrl} opts={opts} />}
                </Header>
              </Modal>
            </Link>
          </div>
          <h1 style={{ color: "white" }} className="banner_descriptionD">
            {Movie?.overview}
          </h1>
        </div>
        <div className="banner-fadeBottom" />
      </header>
      {/* Body */}
      <div style={{ margin: "1rem auto", marginRight: "3rem" }}>
        <Grid divided="vertically" stackable>
          <Grid.Row columns={2}>
            <Grid.Column>
              {/* Movie Info */}
              {!LoadingForMovie ? (
                <MovieInfo movie={Movie} />
              ) : (
                <div>loading...</div>
              )}
            </Grid.Column>
            <Grid.Column>
              {/* Comments */}
              <Comments
                movieTitle={Movie.original_title}
                CommentLists={CommentLists}
                postId={movieId}
                refreshFunction={updateComment}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <LikeDislikes
            video
            videoId={movieId}
            userId={localStorage.getItem("userId")}
          />
        </div>
      </div>
      <Row
        title="CASTS" 
        fetchUrl={`/credit/${movieId}?api_key=${API_KEY}&language=en-US&page=1`}
      />
      {Casts.slice(0, 10).map((c, i) => (
      <div className="col-md-3 text-center" key={i}>
        <img
          className="img-fluid rounded-circle mx-auto d-block"
          src={c.img}
          alt={c.name}
        ></img>
        <p className="font      -weight-bold text-center">{c.name}</p>
        <p
          className="font-weight-light text-center"
          style={{ color: "#5a606b" }}
        >
          {c.character}
        </p>
      </div>
    
      ))};
      <Row
        title="SIMILAR MOVIES"
        fetchUrl={`/movie/${movieId}/similar?api_key=${API_KEY}&language=en-US&page=1`}
      />
    </div>
  );
}

export default Credits;