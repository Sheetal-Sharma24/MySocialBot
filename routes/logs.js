router.get('/logs', async (req, res) => {
  const logs = await Log.find().sort({ timestamp: -1 });
  res.render('logs', { logs });
});
