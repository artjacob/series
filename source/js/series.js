function Episode(props) {
	const title = `Season ${props.season}, Episode ${props.number}`;

	let className = "episode";
	if (props.watched) {
		className += " watched";
	}

	return (
		<span className={className} title={title}></span>
	);
}

function Season(props) {
	const episodes = [ ];
	for (let episode = 1; episode <= props.episodes; episode++) {
		const watched = props.watched === "all" || (typeof props.watched === "object" && props.watched.includes(episode));

		episodes.push({
			number: episode,
			watched: watched,
		});
	}

	return (
		<div className="season">
			<span className="season-number">{props.number}</span>
			{episodes.map(episode =>
				<Episode
					season={props.number}
					number={episode.number}
					watched={episode.watched}
				/>
			)}
		</div>
	);
}

function Series(props) {
	const episodeCount = sumSeasonsEpisodes(props.seasons);
	const watchedEpisodeCount = sumWatchedSeasonsEpisodes(props.seasons);
	const percentWatched = watchedEpisodeCount / episodeCount;

	const seasons = props.seasons.map(season =>
		<Season
			number={season.seasonNumber}
			episodes={season.episodeCount}
			watched={season.watchedEpisodes}
		/>
	);

	return (
		<section className="series">
			<h1 className="series-title">{props.title}</h1>
			<div className="series-stats">
				{formatNumber(episodeCount)} episodes
				{", " + formatNumber(watchedEpisodeCount)} watched&#32;
				({(percentWatched * 100).toFixed(0)}%)
			</div>
			<div className="episode-grid">{seasons}</div>
		</section>
	);
}

function SeriesList(props) {
	const list = props.list.map(series => <Series title={series.seriesTitle} seasons={series.seasons} />);

	return (
		<main className="series-list">{list}</main>
	)
}

function GlobalStats(props) {
	const seriesCount = props.stats.seriesCount;
	const episodeCount = props.stats.episodeCount;
	const watchedEpisodeCount = props.stats.watchedEpisodeCount;
	const percentWatched = watchedEpisodeCount / episodeCount;

	return (
		<aside className="global-stats">
			<div className="stat">{formatNumber(seriesCount)} series</div>
			<div className="stat">
				{formatNumber(episodeCount)} episodes<br />
				{formatNumber(watchedEpisodeCount)} watched<br />
				({(percentWatched * 100).toFixed(0)}%)
			</div>
		</aside>
	);
}

class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			seriesList: [ ],
			globalStats: { },
		};
	}

	componentWillMount() {
		// Load series data
		fetch("data.json").then(response => {
			return response.json();
		}).then(data => {
			this.setState({
				seriesList: data,
				globalStats: {
					seriesCount: data.length,
					episodeCount: data.reduce((total, series) => total + sumSeasonsEpisodes(series.seasons), 0),
					watchedEpisodeCount: data.reduce((total, series) => total + sumWatchedSeasonsEpisodes(series.seasons), 0),
				},
			});
		});
	}

	render() {
		return (
			<div className="container">
				<GlobalStats stats={this.state.globalStats} />
				<SeriesList list={this.state.seriesList} />
			</div>
		);
	}
}

////////////////////////////////////////////////////////////////////////////////////////////////////

function sumSeasonsEpisodes(seasons) {
	return seasons.reduce((total, season) => total + season.episodeCount, 0);
}

function sumWatchedSeasonsEpisodes(seasons) {
	return seasons.reduce((total, season) => {
		if (season.watchedEpisodes === "all") return total + season.episodeCount;
		else return total + (season.watchedEpisodes ? season.watchedEpisodes.length : 0);
	}, 0);
}

function formatNumber(number) {
	if (typeof number === "number")	return new Intl.NumberFormat().format(number);
}

////////////////////////////////////////////////////////////////////////////////////////////////////

ReactDOM.render(
	<App />,
	document.getElementById("root")
);
