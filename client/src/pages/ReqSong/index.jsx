import React, { useState } from "react";
import { Button, Paper } from "@material-ui/core";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import ImageIcon from "@mui/icons-material/Image";
import { toast } from "react-toastify";
import Joi from "joi";
import FileInput from "../../components/FileInput"
import TextField from "../../components/Inputs/TextField"
import styles from './styles.module.scss'

const ReqSong = () => {
    const [data, setData] = useState({
		name: "",
		artist: "",
		img: null,
		song: null,
		duration: 0,
	});
	const [errors, setErrors] = useState({ name: "", artist: "" });

    const schema = {
		name: Joi.string().required().label("Name"),
		artist: Joi.string().required().label("Artist"),
		img: Joi.string().required().label("Image"),
		song: Joi.string().required().label("Song"),
		duration: Joi.number().required(),
	};

	const handleInputState = (name, value) => {
		setData((prev) => ({ ...prev, [name]: value }));
	};

	const handleErrorState = (name, value) => {
		setErrors((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const { error } = Joi.object(schema).validate(data);
		if (!error) {
            toast.done('Song Requested Successfully :)')
		} else {
			toast.error(error.message);
		}
	};
    return <>
    <div className={styles.container}>
			<Paper className={styles.form_container}>
				<h1 className={styles.heading}>
					Request a Song {'>'} Enter Song Details <MusicNoteIcon />
				</h1>
				<form onSubmit={handleSubmit}>
					<div className={styles.input_container}>
						<TextField
							name="name"
							label="Enter song name"
							handleInputState={handleInputState}
							handleErrorState={handleErrorState}
							schema={schema.name}
							error={errors.name}
							value={data.name}
							required={true}
						/>
					</div>
					<div className={styles.input_container}>
						<TextField
							name="artist"
							label="Artist name"
							handleInputState={handleInputState}
							required={true}
							value={data.artist}
							handleErrorState={handleErrorState}
							schema={schema.artist}
							error={errors.artist}
						/>
					</div>
					<div className={styles.file_container}>
						<FileInput
							label="Choose song"
							icon={<MusicNoteIcon />}
							type="audio"
							name="song"
							handleInputState={handleInputState}
							value={data.song}
						/>
					</div>
					<div className={styles.file_container}>
						<FileInput
							label="Choose image"
							icon={<ImageIcon />}
							type="image"
							name="img"
							value={data.img}
							handleInputState={handleInputState}
						/>
					</div>
					<Button
						type="submit"
						label='Request'
                        className={styles.submit}
						style={{ marginLeft: "auto", backgroundColor: 'var(--primary)'}}
					>Request <MusicNoteIcon/> </Button>
				</form>
			</Paper>
		</div>
        </>
}

export default ReqSong