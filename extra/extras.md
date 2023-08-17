Docker setup for freshRSS

```bash
docker run -d --restart unless-stopped --log-opt max-size=10m \
  -p 3001:80 \
  -e TZ=Europe/Paris \
  -e 'CRON_MIN=1,31' \
  -v freshrss_data:/var/www/FreshRSS/data \
  -v freshrss_extensions:/var/www/FreshRSS/extensions \
  --name freshrss \
  freshrss/freshrss
```

---

Build css

```bash
npx tailwindcss -i ./public/css/style.template.css -o ./public/css/style.css --watch
```