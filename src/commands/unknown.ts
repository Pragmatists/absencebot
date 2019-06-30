export const unknownCommand = (res, intent) => {
  res.status(200).json({
    text: 'Huh... I have no idea what you mean. Check help.',
    response_type: 'ephemeral',
    mrkdwn: true
  });
};
