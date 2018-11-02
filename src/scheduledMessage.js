const schedule = require('node-schedule');
const axios = require('axios');
const absenceResponse = require('./absenceResponse');

const rule = new schedule.RecurrenceRule();
rule.dayOfWeek = [1, 2, 3, 4, 5];
rule.hour = 9;
rule.minute = 0;

postAbsencesMessage = () => {
  absenceResponse((text) => {
    axios.post(process.env.SLACK_HOOK, {
      text: text,
      mrkdwn: true
    })
  });
};

schedule.scheduleJob(rule, () => {
  postAbsencesMessage();
});

postAbsencesMessage();
