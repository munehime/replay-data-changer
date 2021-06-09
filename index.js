const osr = require("node-osr");
const fs = require("fs");

const config = JSON.parse(fs.readFileSync("config.json", "utf8"));

// Get replays
const replayDirectory = `${config.danserReplaysPath}/${config.beatmapMD5}`;
const replayFiles = fs.readdirSync(replayDirectory);

Promise.all(
	replayFiles.map((replay) => {
		// Create temp osr file
		const replayFileName = replay.split(".")[0];
		const tempReplayFile = `temp_${replayFileName}.osr`;

		fs.copyFileSync(`${replayDirectory}/${replay}`, `${replayDirectory}/${tempReplayFile}`);
		const oldReplayData = osr.readSync(`${replayDirectory}/${tempReplayFile}`);

		// Remove temp osr file
		fs.unlinkSync(`${replayDirectory}/${tempReplayFile}`);

		// Check replay beatmapMD5
		if (oldReplayData.beatmapMD5 === config.beatmapMD5) return;

		// Write new replay file
		const newReplay = oldReplayData;
		newReplay.beatmapMD5 = config.beatmapMD5;
		newReplay.writeSync(`${replayDirectory}/${replay}`);
		console.log(`Finished writing: ${replay}`);
	}),
)
	.then(() => console.log("Finished writing all file"))
	.catch((error) => console.error(error));
