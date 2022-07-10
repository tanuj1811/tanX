import { Fragment, useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
import axiosInstance from "../../redux/axiosInstance";
import Playlist from "../../components/Playlist";
import styles from "./styles.module.scss";
import Song from "../../components/Song";

const Home = () => {
	const [playlist, setPlaylist] = useState([]);
	const [songs, setSongs] = useState([]);
	const [isFetching, setIsFetching] = useState(false);

	const getRandomPlaylists = async () => {
		try {
			setIsFetching(true);
			const url = process.env.REACT_APP_API_URL + "/playlists/random";
			const { data } = await axiosInstance.get(url);
			const array1 = data.data.splice(0, 4);
			setPlaylist(array1);
			setIsFetching(false);
		} catch (error) {
			setIsFetching(false);
		}
	};

	const getRandomSongs = async () => {
		try {
			const url_song = process.env.REACT_APP_API_URL + "/songs";
			const { data } = await axiosInstance.get(url_song);
			const array1 = data.data.splice(0, 6);			
			setSongs(array1)
			setIsFetching(false);

		}catch(err) {
			setIsFetching(false);
			console.log(err);
		}
	}

	useEffect(() => {
		getRandomPlaylists();
		getRandomSongs();
	}, []);

	return (
		<Fragment>
			{isFetching ? (
				<div className={styles.progress_container}>
					<CircularProgress style={{ color: "#1ed760" }} size="5rem" />
				</div>
			) : (
				<div className={styles.container}>
					<h1>Recent Playlists</h1>
					<div className={styles.playlists_container}>
						<Playlist playlists={playlist} />
					</div>
					<h1>Songs</h1>
					{/* <div className={styles.playlists_container}>
						<Song playlists={songs} />
					</div> */}
				</div>
			)}
		</Fragment>
	);
};

export default Home;
