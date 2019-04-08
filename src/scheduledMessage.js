const schedule = require('node-schedule');
const axios = require('axios');
const absenceResponse = require('./absenceResponse');

const rule = new schedule.RecurrenceRule();
rule.dayOfWeek = [1, 2, 3, 4, 5];
rule.hour = 6;
rule.minute = 0;

postAbsencesMessage = () => {
  console.log(new Date(), 'posting daily message');
  absenceResponse((text) => {
    axios.post(process.env.SLACK_HOOK, {
      text: text,
      mrkdwn: true
    })
        .then((res) => console.log(new Date(), 'posted daily message, res: ', res.data))
        .catch((res) => console.log(new Date(), 'failed to post daily message, res: ', res.data))
  });
};

console.log(new Date(), 'scheduled post daily message');

schedule.scheduleJob(rule, () => {
  postAbsencesMessage();
});
