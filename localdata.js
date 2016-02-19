var db = {
    "goals": [
        {
            "id": 1,
            "days": { "2015-06-08": true, "2015-06-09": true, "2015-06-07": true }, 
            "name": "Do push-ups every day"
        }
    ]
};

window.localData= {};

window.localData.get = function() {
    return db;
};

window.localData.setDay = function(data) {
    var g = _.find(db.goals, function(goal) {
        return goal.id === data.goalId;
    });
    
    if (!g) {
        return;
    }
    
    g.days[data.date] = data.win;
};