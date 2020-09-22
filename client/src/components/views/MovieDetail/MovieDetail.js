import React, { useEffect, useState } from "react";
import axios from "axios";
import Row from "../../commons/Row";
import Credits from '../../commons/Credits'
import "../../commons/Row.css";
import Comments from "./Sections/Comments";
import LikeDislikes from "./Sections/LikeDislikes";
import { API_URL, API_KEY, requests } from "../../Config";
import GridCards from "../../commons/GridCards";
import MovieInfo from "./Sections/MovieInfo";
import MainNavbar from "../NavBar/MainNavbar";
import Favorite from "./Sections/Favorite";
import { Grid, Button, Modal, Embed } from "semantic-ui-react";
import { Link } from "react-router-dom";
//import ReactPlayer from "react-player";
//import VideoPlayer from "../../commons/VideoPlayer";

const base_url = "https://image.tmdb.org/t/p/original/";
const youtubeUrl = "https://www.youtube.com/watch?v=";

function MovieDetailPage(props) {
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
  const [isOpen, setIsOpen] = useState(false);
	const movieId = props.match.params.movieId;
	const [Movie, setMovie] = useState([]);
	const [Casts, setCasts] = useState([]);
	const [CommentLists, setCommentLists] = useState([]);
	const [LoadingForMovie, setLoadingForMovie] = useState(true);
	const [LoadingForCasts, setLoadingForCasts] = useState(true);
	const [ActorToggle, setActorToggle] = useState(false);
	const movieVariable = {
		movieId: movieId,
	};

	useEffect(() => {
		let endpointForMovieInfo = `${API_URL}movie/${movieId}?api_key=${API_KEY}&language=en-US`;
		fetchDetailInfo(endpointForMovieInfo);

		axios
			.post("/api/comment/getComments", movieVariable)
			.then((response) => {
				console.log(response);
				if (response.data.success) {
					console.log(
						"response.data.comments",
						response.data.comments
					);
					setCommentLists(response.data.comments);
				} else {
					alert("Failed to get comments Info");
				}
			});
	}, []);

	const playVideo = () => {
		setActorToggle(!ActorToggle);
	};

	const toggleActorView = () => {
		setActorToggle(!ActorToggle);
	};

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

  return (
    <div style={{ paddingTop: "4rem" }}>
      <MainNavbar />
      {/* <VideoPlayer /> */}
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
            <button className="banner_button">Play</button>
            <button className="banner_button">Watch Trailer</button>
          </div>
          <h2 style={{ color: "white" }} className="banner_descriptionD">
            {Movie?.overview}
          </h2>
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

							{/* Actors Grid*/}
							<Button onClick={toggleActorView}>
								Toggle Actor View{" "}
							</Button>
							{ActorToggle && (
								<Row gutter={[16, 16]}>
									{!LoadingForCasts ? (
										Casts.map(
											(cast, index) =>
												cast.profile_path && (
													<GridCards
														actor
														image={
															cast.profile_path
														}
														characterName={
															cast.characterName
														}
													/>
												)
										)
									) : (
										<div>loading...</div>
									)}
								</Row>
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
      <Credits
      title='CASTS'
				fetchUrl={`/movie/${movieId}/credits?api_key=${API_KEY}&language=en-US&page=1`}
      />
			<Row
				title='SIMILAR MOVIES'
				fetchUrl={`/movie/${movieId}/similar?api_key=${API_KEY}&language=en-US&page=1`}
			/>
		</div>
	);
}

export default MovieDetailPage;
