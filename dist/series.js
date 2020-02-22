"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function Episode(props) {
  var title = "Season ".concat(props.season, ", Episode ").concat(props.number);
  var className = "episode";

  if (props.watched) {
    className += " watched";
  }

  return React.createElement("span", {
    className: className,
    title: title
  });
}

function Season(props) {
  var episodes = [];

  for (var episode = 1; episode <= props.episodes; episode++) {
    var watched = props.watched === "all" || _typeof(props.watched) === "object" && props.watched.includes(episode);
    episodes.push({
      number: episode,
      watched: watched
    });
  }

  return React.createElement("div", {
    className: "season"
  }, React.createElement("span", {
    className: "season-number"
  }, props.number), episodes.map(function (episode) {
    return React.createElement(Episode, {
      season: props.number,
      number: episode.number,
      watched: episode.watched
    });
  }));
}

function Series(props) {
  var episodeCount = sumSeasonsEpisodes(props.seasons);
  var watchedEpisodeCount = sumWatchedSeasonsEpisodes(props.seasons);
  var percentWatched = watchedEpisodeCount / episodeCount;
  var seasons = props.seasons.map(function (season) {
    return React.createElement(Season, {
      number: season.seasonNumber,
      episodes: season.episodeCount,
      watched: season.watchedEpisodes
    });
  });
  return React.createElement("section", {
    className: "series"
  }, React.createElement("h1", {
    className: "series-title"
  }, props.title), React.createElement("div", {
    className: "series-stats"
  }, formatNumber(episodeCount), " episodes", ", " + formatNumber(watchedEpisodeCount), " watched (", (percentWatched * 100).toFixed(0), "%)"), React.createElement("div", {
    className: "episode-grid"
  }, seasons));
}

function SeriesList(props) {
  var list = props.list.map(function (series) {
    return React.createElement(Series, {
      title: series.seriesTitle,
      seasons: series.seasons
    });
  });
  return React.createElement("main", {
    className: "series-list"
  }, list);
}

function GlobalStats(props) {
  var seriesCount = props.stats.seriesCount;
  var episodeCount = props.stats.episodeCount;
  var watchedEpisodeCount = props.stats.watchedEpisodeCount;
  var percentWatched = watchedEpisodeCount / episodeCount;
  return React.createElement("aside", {
    className: "global-stats"
  }, React.createElement("div", {
    className: "stat"
  }, formatNumber(seriesCount), " series"), React.createElement("div", {
    className: "stat"
  }, formatNumber(episodeCount), " episodes", React.createElement("br", null), formatNumber(watchedEpisodeCount), " watched", React.createElement("br", null), "(", (percentWatched * 100).toFixed(0), "%)"));
}

var App =
/*#__PURE__*/
function (_React$Component) {
  _inherits(App, _React$Component);

  function App(props) {
    var _this;

    _classCallCheck(this, App);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(App).call(this, props));
    _this.state = {
      seriesList: [],
      globalStats: {}
    };
    return _this;
  }

  _createClass(App, [{
    key: "componentWillMount",
    value: function componentWillMount() {
      var _this2 = this;

      // Load series data
      fetch("data.json").then(function (response) {
        return response.json();
      }).then(function (data) {
        _this2.setState({
          seriesList: data,
          globalStats: {
            seriesCount: data.length,
            episodeCount: data.reduce(function (total, series) {
              return total + sumSeasonsEpisodes(series.seasons);
            }, 0),
            watchedEpisodeCount: data.reduce(function (total, series) {
              return total + sumWatchedSeasonsEpisodes(series.seasons);
            }, 0)
          }
        });
      });
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement("div", {
        className: "container"
      }, React.createElement(GlobalStats, {
        stats: this.state.globalStats
      }), React.createElement(SeriesList, {
        list: this.state.seriesList
      }));
    }
  }]);

  return App;
}(React.Component); ////////////////////////////////////////////////////////////////////////////////////////////////////


function sumSeasonsEpisodes(seasons) {
  return seasons.reduce(function (total, season) {
    return total + season.episodeCount;
  }, 0);
}

function sumWatchedSeasonsEpisodes(seasons) {
  return seasons.reduce(function (total, season) {
    if (season.watchedEpisodes === "all") return total + season.episodeCount;else return total + (season.watchedEpisodes ? season.watchedEpisodes.length : 0);
  }, 0);
}

function formatNumber(number) {
  if (typeof number === "number") return new Intl.NumberFormat().format(number);
} ////////////////////////////////////////////////////////////////////////////////////////////////////


ReactDOM.render(React.createElement(App, null), document.getElementById("root"));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNlcmllcy5qcyJdLCJuYW1lcyI6WyJFcGlzb2RlIiwicHJvcHMiLCJ0aXRsZSIsInNlYXNvbiIsIm51bWJlciIsImNsYXNzTmFtZSIsIndhdGNoZWQiLCJTZWFzb24iLCJlcGlzb2RlcyIsImVwaXNvZGUiLCJpbmNsdWRlcyIsInB1c2giLCJtYXAiLCJTZXJpZXMiLCJlcGlzb2RlQ291bnQiLCJzdW1TZWFzb25zRXBpc29kZXMiLCJzZWFzb25zIiwid2F0Y2hlZEVwaXNvZGVDb3VudCIsInN1bVdhdGNoZWRTZWFzb25zRXBpc29kZXMiLCJwZXJjZW50V2F0Y2hlZCIsInNlYXNvbk51bWJlciIsIndhdGNoZWRFcGlzb2RlcyIsImZvcm1hdE51bWJlciIsInRvRml4ZWQiLCJTZXJpZXNMaXN0IiwibGlzdCIsInNlcmllcyIsInNlcmllc1RpdGxlIiwiR2xvYmFsU3RhdHMiLCJzZXJpZXNDb3VudCIsInN0YXRzIiwiQXBwIiwic3RhdGUiLCJzZXJpZXNMaXN0IiwiZ2xvYmFsU3RhdHMiLCJmZXRjaCIsInRoZW4iLCJyZXNwb25zZSIsImpzb24iLCJkYXRhIiwic2V0U3RhdGUiLCJsZW5ndGgiLCJyZWR1Y2UiLCJ0b3RhbCIsIlJlYWN0IiwiQ29tcG9uZW50IiwiSW50bCIsIk51bWJlckZvcm1hdCIsImZvcm1hdCIsIlJlYWN0RE9NIiwicmVuZGVyIiwiZG9jdW1lbnQiLCJnZXRFbGVtZW50QnlJZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxTQUFBQSxPQUFBLENBQUFDLEtBQUEsRUFBQTtBQUNBLE1BQUFDLEtBQUEsb0JBQUFELEtBQUEsQ0FBQUUsTUFBQSx1QkFBQUYsS0FBQSxDQUFBRyxNQUFBLENBQUE7QUFFQSxNQUFBQyxTQUFBLEdBQUEsU0FBQTs7QUFDQSxNQUFBSixLQUFBLENBQUFLLE9BQUEsRUFBQTtBQUNBRCxJQUFBQSxTQUFBLElBQUEsVUFBQTtBQUNBOztBQUVBLFNBQ0E7QUFBQSxJQUFBLFNBQUEsRUFBQUEsU0FB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QSxDQUhBLENBQUE7QUFJQTs7QUFFQSxTQUFBbkIsWUFBQSxDQUFBbEIsTUFBQSxFQUFBO0FBQ0EsTUFBQSxPQUFBQSxNQUFBLEtBQUEsUUFBQSxFQUFBLE9BQUEsSUFBQTBDLElBQUEsQ0FBQUMsWUFBQSxHQUFBQyxNQUFBLENBQUE1QyxNQUFBLENBQUE7QUFDQSxDLENBRUE7OztBQUVBNkMsUUFBQSxDQUFBQyxNQUFBLENBQ0Esb0JBQUEsR0FBQSxPQURBLEVBRUFDLFFBQUEsQ0FBQUMsY0FBQSxDQUFBLE1BQUEsQ0FGQSIsImZpbGUiOiJzZXJpZXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJmdW5jdGlvbiBFcGlzb2RlKHByb3BzKSB7XHJcblx0Y29uc3QgdGl0bGUgPSBgU2Vhc29uICR7cHJvcHMuc2Vhc29ufSwgRXBpc29kZSAke3Byb3BzLm51bWJlcn1gO1xyXG5cclxuXHRsZXQgY2xhc3NOYW1lID0gXCJlcGlzb2RlXCI7XHJcblx0aWYgKHByb3BzLndhdGNoZWQpIHtcclxuXHRcdGNsYXNzTmFtZSArPSBcIiB3YXRjaGVkXCI7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gKFxyXG5cdFx0PHNwYW4gY2xhc3NOYW1lPXtjbGFzc05hbWV9IHRpdGxlPXt0aXRsZX0+PC9zcGFuPlxyXG5cdCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIFNlYXNvbihwcm9wcykge1xyXG5cdGNvbnN0IGVwaXNvZGVzID0gWyBdO1xyXG5cdGZvciAobGV0IGVwaXNvZGUgPSAxOyBlcGlzb2RlIDw9IHByb3BzLmVwaXNvZGVzOyBlcGlzb2RlKyspIHtcclxuXHRcdGNvbnN0IHdhdGNoZWQgPSBwcm9wcy53YXRjaGVkID09PSBcImFsbFwiIHx8ICh0eXBlb2YgcHJvcHMud2F0Y2hlZCA9PT0gXCJvYmplY3RcIiAmJiBwcm9wcy53YXRjaGVkLmluY2x1ZGVzKGVwaXNvZGUpKTtcclxuXHJcblx0XHRlcGlzb2Rlcy5wdXNoKHtcclxuXHRcdFx0bnVtYmVyOiBlcGlzb2RlLFxyXG5cdFx0XHR3YXRjaGVkOiB3YXRjaGVkLFxyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gKFxyXG5cdFx0PGRpdiBjbGFzc05hbWU9XCJzZWFzb25cIj5cclxuXHRcdFx0PHNwYW4gY2xhc3NOYW1lPVwic2Vhc29uLW51bWJlclwiPntwcm9wcy5udW1iZXJ9PC9zcGFuPlxyXG5cdFx0XHR7ZXBpc29kZXMubWFwKGVwaXNvZGUgPT5cclxuXHRcdFx0XHQ8RXBpc29kZVxyXG5cdFx0XHRcdFx0c2Vhc29uPXtwcm9wcy5udW1iZXJ9XHJcblx0XHRcdFx0XHRudW1iZXI9e2VwaXNvZGUubnVtYmVyfVxyXG5cdFx0XHRcdFx0d2F0Y2hlZD17ZXBpc29kZS53YXRjaGVkfVxyXG5cdFx0XHRcdC8+XHJcblx0XHRcdCl9XHJcblx0XHQ8L2Rpdj5cclxuXHQpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBTZXJpZXMocHJvcHMpIHtcclxuXHRjb25zdCBlcGlzb2RlQ291bnQgPSBzdW1TZWFzb25zRXBpc29kZXMocHJvcHMuc2Vhc29ucyk7XHJcblx0Y29uc3Qgd2F0Y2hlZEVwaXNvZGVDb3VudCA9IHN1bVdhdGNoZWRTZWFzb25zRXBpc29kZXMocHJvcHMuc2Vhc29ucyk7XHJcblx0Y29uc3QgcGVyY2VudFdhdGNoZWQgPSB3YXRjaGVkRXBpc29kZUNvdW50IC8gZXBpc29kZUNvdW50O1xyXG5cclxuXHRjb25zdCBzZWFzb25zID0gcHJvcHMuc2Vhc29ucy5tYXAoc2Vhc29uID0+XHJcblx0XHQ8U2Vhc29uXHJcblx0XHRcdG51bWJlcj17c2Vhc29uLnNlYXNvbk51bWJlcn1cclxuXHRcdFx0ZXBpc29kZXM9e3NlYXNvbi5lcGlzb2RlQ291bnR9XHJcblx0XHRcdHdhdGNoZWQ9e3NlYXNvbi53YXRjaGVkRXBpc29kZXN9XHJcblx0XHQvPlxyXG5cdCk7XHJcblxyXG5cdHJldHVybiAoXHJcblx0XHQ8c2VjdGlvbiBjbGFzc05hbWU9XCJzZXJpZXNcIj5cclxuXHRcdFx0PGgxIGNsYXNzTmFtZT1cInNlcmllcy10aXRsZVwiPntwcm9wcy50aXRsZX08L2gxPlxyXG5cdFx0XHQ8ZGl2IGNsYXNzTmFtZT1cInNlcmllcy1zdGF0c1wiPlxyXG5cdFx0XHRcdHtmb3JtYXROdW1iZXIoZXBpc29kZUNvdW50KX0gZXBpc29kZXNcclxuXHRcdFx0XHR7XCIsIFwiICsgZm9ybWF0TnVtYmVyKHdhdGNoZWRFcGlzb2RlQ291bnQpfSB3YXRjaGVkJiMzMjtcclxuXHRcdFx0XHQoeyhwZXJjZW50V2F0Y2hlZCAqIDEwMCkudG9GaXhlZCgwKX0lKVxyXG5cdFx0XHQ8L2Rpdj5cclxuXHRcdFx0PGRpdiBjbGFzc05hbWU9XCJlcGlzb2RlLWdyaWRcIj57c2Vhc29uc308L2Rpdj5cclxuXHRcdDwvc2VjdGlvbj5cclxuXHQpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBTZXJpZXNMaXN0KHByb3BzKSB7XHJcblx0Y29uc3QgbGlzdCA9IHByb3BzLmxpc3QubWFwKHNlcmllcyA9PiA8U2VyaWVzIHRpdGxlPXtzZXJpZXMuc2VyaWVzVGl0bGV9IHNlYXNvbnM9e3Nlcmllcy5zZWFzb25zfSAvPik7XHJcblxyXG5cdHJldHVybiAoXHJcblx0XHQ8bWFpbiBjbGFzc05hbWU9XCJzZXJpZXMtbGlzdFwiPntsaXN0fTwvbWFpbj5cclxuXHQpXHJcbn1cclxuXHJcbmZ1bmN0aW9uIEdsb2JhbFN0YXRzKHByb3BzKSB7XHJcblx0Y29uc3Qgc2VyaWVzQ291bnQgPSBwcm9wcy5zdGF0cy5zZXJpZXNDb3VudDtcclxuXHRjb25zdCBlcGlzb2RlQ291bnQgPSBwcm9wcy5zdGF0cy5lcGlzb2RlQ291bnQ7XHJcblx0Y29uc3Qgd2F0Y2hlZEVwaXNvZGVDb3VudCA9IHByb3BzLnN0YXRzLndhdGNoZWRFcGlzb2RlQ291bnQ7XHJcblx0Y29uc3QgcGVyY2VudFdhdGNoZWQgPSB3YXRjaGVkRXBpc29kZUNvdW50IC8gZXBpc29kZUNvdW50O1xyXG5cclxuXHRyZXR1cm4gKFxyXG5cdFx0PGFzaWRlIGNsYXNzTmFtZT1cImdsb2JhbC1zdGF0c1wiPlxyXG5cdFx0XHQ8ZGl2IGNsYXNzTmFtZT1cInN0YXRcIj57Zm9ybWF0TnVtYmVyKHNlcmllc0NvdW50KX0gc2VyaWVzPC9kaXY+XHJcblx0XHRcdDxkaXYgY2xhc3NOYW1lPVwic3RhdFwiPlxyXG5cdFx0XHRcdHtmb3JtYXROdW1iZXIoZXBpc29kZUNvdW50KX0gZXBpc29kZXM8YnIgLz5cclxuXHRcdFx0XHR7Zm9ybWF0TnVtYmVyKHdhdGNoZWRFcGlzb2RlQ291bnQpfSB3YXRjaGVkPGJyIC8+XHJcblx0XHRcdFx0KHsocGVyY2VudFdhdGNoZWQgKiAxMDApLnRvRml4ZWQoMCl9JSlcclxuXHRcdFx0PC9kaXY+XHJcblx0XHQ8L2FzaWRlPlxyXG5cdCk7XHJcbn1cclxuXHJcbmNsYXNzIEFwcCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcblx0Y29uc3RydWN0b3IocHJvcHMpIHtcclxuXHRcdHN1cGVyKHByb3BzKTtcclxuXHJcblx0XHR0aGlzLnN0YXRlID0ge1xyXG5cdFx0XHRzZXJpZXNMaXN0OiBbIF0sXHJcblx0XHRcdGdsb2JhbFN0YXRzOiB7IH0sXHJcblx0XHR9O1xyXG5cdH1cclxuXHJcblx0Y29tcG9uZW50V2lsbE1vdW50KCkge1xyXG5cdFx0Ly8gTG9hZCBzZXJpZXMgZGF0YVxyXG5cdFx0ZmV0Y2goXCJkYXRhLmpzb25cIikudGhlbihyZXNwb25zZSA9PiB7XHJcblx0XHRcdHJldHVybiByZXNwb25zZS5qc29uKCk7XHJcblx0XHR9KS50aGVuKGRhdGEgPT4ge1xyXG5cdFx0XHR0aGlzLnNldFN0YXRlKHtcclxuXHRcdFx0XHRzZXJpZXNMaXN0OiBkYXRhLFxyXG5cdFx0XHRcdGdsb2JhbFN0YXRzOiB7XHJcblx0XHRcdFx0XHRzZXJpZXNDb3VudDogZGF0YS5sZW5ndGgsXHJcblx0XHRcdFx0XHRlcGlzb2RlQ291bnQ6IGRhdGEucmVkdWNlKCh0b3RhbCwgc2VyaWVzKSA9PiB0b3RhbCArIHN1bVNlYXNvbnNFcGlzb2RlcyhzZXJpZXMuc2Vhc29ucyksIDApLFxyXG5cdFx0XHRcdFx0d2F0Y2hlZEVwaXNvZGVDb3VudDogZGF0YS5yZWR1Y2UoKHRvdGFsLCBzZXJpZXMpID0+IHRvdGFsICsgc3VtV2F0Y2hlZFNlYXNvbnNFcGlzb2RlcyhzZXJpZXMuc2Vhc29ucyksIDApLFxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdH0pO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRyZW5kZXIoKSB7XHJcblx0XHRyZXR1cm4gKFxyXG5cdFx0XHQ8ZGl2IGNsYXNzTmFtZT1cImNvbnRhaW5lclwiPlxyXG5cdFx0XHRcdDxHbG9iYWxTdGF0cyBzdGF0cz17dGhpcy5zdGF0ZS5nbG9iYWxTdGF0c30gLz5cclxuXHRcdFx0XHQ8U2VyaWVzTGlzdCBsaXN0PXt0aGlzLnN0YXRlLnNlcmllc0xpc3R9IC8+XHJcblx0XHRcdDwvZGl2PlxyXG5cdFx0KTtcclxuXHR9XHJcbn1cclxuXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbmZ1bmN0aW9uIHN1bVNlYXNvbnNFcGlzb2RlcyhzZWFzb25zKSB7XHJcblx0cmV0dXJuIHNlYXNvbnMucmVkdWNlKCh0b3RhbCwgc2Vhc29uKSA9PiB0b3RhbCArIHNlYXNvbi5lcGlzb2RlQ291bnQsIDApO1xyXG59XHJcblxyXG5mdW5jdGlvbiBzdW1XYXRjaGVkU2Vhc29uc0VwaXNvZGVzKHNlYXNvbnMpIHtcclxuXHRyZXR1cm4gc2Vhc29ucy5yZWR1Y2UoKHRvdGFsLCBzZWFzb24pID0+IHtcclxuXHRcdGlmIChzZWFzb24ud2F0Y2hlZEVwaXNvZGVzID09PSBcImFsbFwiKSByZXR1cm4gdG90YWwgKyBzZWFzb24uZXBpc29kZUNvdW50O1xyXG5cdFx0ZWxzZSByZXR1cm4gdG90YWwgKyAoc2Vhc29uLndhdGNoZWRFcGlzb2RlcyA/IHNlYXNvbi53YXRjaGVkRXBpc29kZXMubGVuZ3RoIDogMCk7XHJcblx0fSwgMCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGZvcm1hdE51bWJlcihudW1iZXIpIHtcclxuXHRpZiAodHlwZW9mIG51bWJlciA9PT0gXCJudW1iZXJcIilcdHJldHVybiBuZXcgSW50bC5OdW1iZXJGb3JtYXQoKS5mb3JtYXQobnVtYmVyKTtcclxufVxyXG5cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuUmVhY3RET00ucmVuZGVyKFxyXG5cdDxBcHAgLz4sXHJcblx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyb290XCIpXHJcbik7XHJcbiJdfQ==