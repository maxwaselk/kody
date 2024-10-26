self.addEventListener('push', (event) => {
    const data = event.data ? event.data.json() : { title: 'Powiadomienie', body: 'Nowa wiadomość!' };
  
    const options = {
      body: data.body,
      icon: 'path/to/icon.png', // Podaj ścieżkę do ikony
      badge: 'path/to/badge.png', // Podaj ścieżkę do badge
    };
  
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  });
  