// Number of weeks to show prior to the current week.
var HISTORICAL_WEEKS = 4;

// Number of weeks to show after the current week.
var FUTURE_WEEKS = 1;

// Adds a `calendar` property to the goal data.
/*
"calendar": {
	"weeks": [
		{
			"days": [
				{
					"date": "2015-06-08",
					"win": true,
					"today": false
				}
			]
		}
	]
}
*/
var buildCalendarData = function(goal) {
	// {"id": 1, "days": {"2015-06-08": true, "2015-06-09": true, "2015-06-07": true}, "name": "Do push-ups every day"}

	var today = moment().startOf('day');

	// sunday of current week
	var sunday = moment(today);
	if (sunday.weekday() !== 0) {
		sunday.subtract(sunday.weekday(), 'd');
	}

	// back up to the sunday
	// of the first week we want to show
	sunday.subtract(HISTORICAL_WEEKS, 'w');

	// sum up the total number of weeks to show
	totalWeeksToShow = HISTORICAL_WEEKS + FUTURE_WEEKS + 1 /* current week */

	var i, j, day, week, isWin, isToday;
	var weeks = [];
	for (i=0; i<totalWeeksToShow; i++) {
		week = {
			"days": []
		};

		for (j=0; j<7; j++) {
			isWin = goal.days[sunday.format('YYYY-MM-DD')] === true;
			isToday = sunday.unix() === today.unix();

			day = {
				"goalID": goal.id,
				"date": moment(sunday),
				"win": isWin,
				"today": isToday
			};

			week.days.push(day);

			// increment to the next day
			sunday.add(1, 'd');
		}

		weeks.push(week);
	}

	goal.calendar = {"weeks": weeks};
};

var GoalList = React.createClass({
	loadGoalsFromServer: function() {
		var self = this;
		// fetch the data
		// {"goals": [{"id": 1, "days": {"2015-06-08": true, "2015-06-09": true, "2015-06-07": true}, "name": "Do push-ups every day"}]}
        self.setState(window.localData.get());
		//ajaxGetJSON(this.props.url, function(data) {
		//	self.setState(data);
		//}, function(req) {
		//	alert('error fetching goals');
		//});
	},
	getInitialState: function() {
		return {goals: []};
	},
	componentDidMount: function() {
		this.loadGoalsFromServer();
		//setInterval(this.loadGoalsFromServer, this.props.pollInterval);
	},
	render: function() {
		var goalNodes = this.state.goals.map(function(goal) {
			return (
				<Goal data={goal} key={goal.id} />
			);
		});
		return (
			<div className="goalList">
				{goalNodes}
			</div>
		);
	}
});

var Goal = React.createClass({
	componentDidMount: function() {
		
	},
	render: function() {
		var goal = this.props.data;
		buildCalendarData(goal);
		return (
			<div className="goal">
				<h1>{goal.name}</h1>
				<Calendar data={goal.calendar} key={goal.id} />
			</div>
		);
	}
});

var Calendar = React.createClass({
	// {"id": 1, "days": {"2015-06-08": true, "2015-06-09": true, "2015-06-07": true}, "name": "Do push-ups every day"}
	render: function() {
		var cal = this.props.data;
		var weekNodes = cal.weeks.map(function(week) {
			return (
				<CalendarWeek data={week} key={week.days[0].date.unix()} />
			);
		});
		return (
			<table className='calendar' border="0" cellSpacing="0" cellPadding="0">
				<thead>
					<th>Sun</th>
					<th>Mon</th>
					<th>Tue</th>
					<th>Wed</th>
					<th>Thu</th>
					<th>Fri</th>
					<th>Sat</th>
				</thead>
				<tbody>{weekNodes}</tbody>
			</table>
		);
	}
});

var CalendarWeek = React.createClass({
	render: function() {
		var week = this.props.data;
		var dayNodes = week.days.map(function(day) {
			return (
				<CalendarDay data={day} key={day.date.unix()} />
			);
		});
		return (
			<tr className='week'>{dayNodes}</tr>
		);
	}
});

var CalendarDay = React.createClass({
	handleClick: function(event) {
		// TODO: do nothing if a request is already in flight (prevent double tap)

		var day = this.state;
		day.win = !day.win;
		this.setState(day);

		//console.log('saving the day', postData);
        window.localData.setDay({
            goalId: day.goalID,
            date: day.date.format('YYYY-MM-DD'),
            win: day.win
        });
        
        //var postData = "goal_id=" + day.goalID + "&date=" + day.date.format('YYYY-MM-DD') + "&win=" + day.win;
		//ajaxPost('/goals/api/day', postData,
		//	function onSuccess() {},
		//	function onError(req) {
		//		alert('failed to save the day');
		//		// TODO: revert to previous win value and setState()
		//	}
		//);
	},
	componentWillMount: function() {
		this.setState(this.props.data);
	},
	render: function() {
		var day = this.state;
		if (!day) {
			return null;
		}
		
		var dateText;
		if (day.date.date() === 1) {
			dateText = day.date.format('MMM D');
		} else {
			dateText = day.date.date();
		}

		var dateClass = "";
		if (day.today === true) {
			dateClass += "today";
		}

		var streakClass = "streak";
		if (day.win === true) {
			streakClass += " win";
		}

		return (
			<td className="day" onClick={this.handleClick}>
				<span className={dateClass}>{dateText}</span>
				<div className={streakClass}></div>
			</td>
		);
	}
});