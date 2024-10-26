const express = require('express');
const webpush = require('web-push');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const vapidKeys = {
  publicKey: '<BJzZhsjATYsdae6LUe6jDOglGYVfqB3fue4_7RLqcEeG1mVASCXdavlxSEPWmAAkyusPSwvjL5NmNucf0j7ZbVo>',
  privateKey: '<zo3wvUBZ1mna-c5WyahFBChDNOQizsKIYJP4hsdlwH8>'
};

webpush.setVapidDetails(
  'mailto:your-maxwaselk@gmail.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

app.post('/sendNotification', (req, res) => {
  const subscription = req.body.subscription;
  const payload = JSON.stringify({ title: 'Nowa wiadomość', body: 'Masz nowe powiadomienie!' });

  webpush.sendNotification(subscription, payload)
    .then(response => res.status(200).send('Powiadomienie wysłane!'))
    .catch(error => {
      console.error('Błąd podczas wysyłania powiadomienia:', error);
      res.sendStatus(500);
    });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Serwer działa na porcie ${PORT}`);
});
