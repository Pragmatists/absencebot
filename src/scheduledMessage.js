const schedule = require('node-schedule');
const axios = require('axios');
const absenceResponse = require('./absenceResponse');

const rule = new schedule.RecurrenceRule();
rule.dayOfWeek = [new schedule.Range(1, 4)];
rule.hour = 9;
rule.minute = 0;

postAbsencesMessage = () => {
  absenceResponse((text) => {
    axios.post('https://hooks.slack.com/services/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', {
      text: text,
      mrkdwn: true
    })
  });
};

schedule.scheduleJob(rule, () => {
  postAbsencesMessage();
});
