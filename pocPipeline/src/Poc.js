var MILLIS_PER_DAY = 24 * 60 * 60 * 1000;
var STAGE_ORDER = ['IDEA', 'PROTOTYPE', 'SHOWN', 'ADOPTED'];

function stageVelocity() {
  var totals = {};
  _stageEntriesByPoc().forEach((entries) => {
    for (var i = 0; i < entries.length - 1; i++) {
      var total = totals[entries[i].stage] || { pocCount: 0, days: 0 };
      total.pocCount += 1;
      total.days += _daysBetween(entries[i].enteredOn, entries[i + 1].enteredOn);
      totals[entries[i].stage] = total;
    }
  });
  return STAGE_ORDER.filter((stage) => totals[stage]).map((stage) =>
    Poc.StageVelocity.make({
      stage: stage,
      pocCount: totals[stage].pocCount,
      avgDays: totals[stage].days / totals[stage].pocCount,
    })
  );
}

function currentStages() {
  var now = DateTime.now();
  return _stageEntriesByPoc().map((entries) => {
    var latest = entries[entries.length - 1];
    return Poc.CurrentStage.make({
      poc: latest.poc,
      stage: latest.stage,
      since: latest.enteredOn,
      daysInStage: _daysBetween(latest.enteredOn, now),
    });
  });
}

/**
 * Each POC's stages with the date it entered them, oldest first. If a stage was recorded more than once,
 * the first entry counts.
 */
function _stageEntriesByPoc() {
  var byPoc = {};
  StatusChange.evaluate({
    projection: 'poc.id, poc.title, poc.customer, poc.owner, stage, min(changedOn)',
    group: 'poc.id, poc.title, poc.customer, poc.owner, stage',
    limit: -1,
  }).tuples.forEach((tuple) => {
    var pocId = tuple.str(0);
    byPoc[pocId] = byPoc[pocId] || [];
    byPoc[pocId].push({
      poc: Poc.make({ id: pocId, title: tuple.str(1), customer: tuple.str(2), owner: tuple.str(3) }),
      stage: tuple.str(4),
      enteredOn: tuple.date(5),
    });
  });
  return Object.keys(byPoc).map((pocId) => byPoc[pocId].sort((a, b) => a.enteredOn.millis - b.enteredOn.millis));
}

function _daysBetween(start, end) {
  return (end.millis - start.millis) / MILLIS_PER_DAY;
}
