const helpCommand = (res, intent) => {
  res.status(200).json({
    text: unknownCommandMessage(),
    response_type: 'ephemeral',
    mrkdwn: true
  });
};

const unknownCommandMessage = () => {
  return 'Huh... I have no idea what you mean. Check help.';
};

module.exports = helpCommand;