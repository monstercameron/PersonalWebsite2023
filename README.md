## README for Personal Website 2023

Welcome to the repository for my personal website! This site serves as a reflection of my work, projects, and articles.

### 🚀 Technologies Used

- **Node.js**: The primary runtime enabling server-side functionality.
- **Express**: A minimalist web framework for Node.js, allowing for easy route and middleware setup.
- **EJS**: Embedded JavaScript templates. This templating engine helps dynamically generate the HTML for the website.
- **HTMX**: Enables modern AJAX requests, making the website more interactive.
- Other supporting libraries: 
  - `bcrypt` for password hashing and checking.
  - `body-parser` for parsing incoming request bodies.
  - `morgan` for HTTP request logging.
  - `sqlite3` as a lightweight database solution.
  - `dotenv` for managing environment variables.
  - `nodemon` for development, which restarts the server automatically upon file changes.

### 📁 Project Structure

The main entry point of the app is `index.js`. 

- `server.js` is responsible for initiating the server.
- Helper scripts can be found in the `helpers/` directory, which contains utilities like password hashing and demo data scripts.
- All routes and their associated functionalities are in the `routes/` directory.
- EJS templates are stored in respective directories which define how the content is rendered on the webpage.
  
### 🚴 Quick Start

1. Clone the repository:

   ```bash
   git clone https://github.com/monstercameron/PersonalWebsite2023
   ```

2. Navigate to the project directory:

   ```bash
   cd personalwebsite2023
   ```

3. Install the required packages:

   ```bash
   npm install
   ```

4. Build tailwinds Css:

   ```bash
   npm run build:css
   ```

5. Start the development server:

   ```bash
   npm run dev
   ```

   The server will start, and you should be able to access the website at `http://localhost:3000`.

### 📄 Scripts

- `npm start`: Starts the server using nodemon for hot reloading.
- `npm run demo:blog`: Populates the database with demo blog data.
- `npm run demo:projects`: Populates the database with demo project data.


## 🖥 Nginx Server Configuration

If you're looking to set up your website with Nginx and ensure that SSL/TLS is correctly configured using Let's Encrypt, you can follow the configuration provided below:

### Main Server Configuration for `www.earlcameron.com`

This configuration handles HTTPS traffic on port `443` and sets up proxying to your Node application, running on `localhost:3000`.

```nginx
server {
    server_name www.earlcameron.com;
    listen 443 ssl;

    # Define the root for static assets
    root /var/www/PersonalWebsite2023/public;

    # SSL configurations managed by Certbot
    ssl_certificate /etc/letsencrypt/live/www.earlcameron.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/www.earlcameron.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;


    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 60s;
    }

     # Serve images
    location ~ ^/images/ {
        try_files $uri $uri/ =404;
    }

    # Serve CSS
    location ~ ^/css/ {
        try_files $uri $uri/ =404;
    }

    # Serve JavaScript
    location ~ ^/js/ {
        try_files $uri $uri/ =404;
    }
}
```

### Configuration for Subdomain `reader.earlcameron.com`

This configuration sets up a basic proxy for traffic to another application, potentially running on `localhost:3001`.

```nginx
server {
    server_name reader.earlcameron.com;
    listen 80;

    location / {
        proxy_pass http://127.0.0.1:3001/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

### HTTP to HTTPS Redirect Configuration

Forces a redirect from HTTP to HTTPS for `www.earlcameron.com`.

```nginx
server {
    listen 80;
    server_name www.earlcameron.com;

    location / {
        return 301 https://$host$request_uri;
    }
}
```

---

By following the above configurations, you ensure that your personal website and subdomains are appropriately directed and secured using SSL/TLS. Ensure you have installed and set up Let's Encrypt and Certbot before applying these configurations.

---

## 📟 Systemd Service Configuration

For those looking to run the personal website as a service on systems using `systemd`, here's a service file that can be used to automatically start the website on boot and restart it if it fails.

1. **Create a service file**: Create a new file named `personal-website.service` in the `/etc/systemd/system/` directory:

   ```bash
   sudo nano /etc/systemd/system/personal-website.service
   ```

2. **Paste the following configuration**:

   ```ini
   [Unit]
   Description=Personal Website
   Documentation=https://www.earlcameron.com
   After=network.target

   [Service]
   Environment=NODE_ENV=production
   Type=simple
   User=root
   WorkingDirectory=/var/www/PersonalWebsite2023/
   ExecStart=/usr/bin/node /var/www/PersonalWebsite2023/server.js
   Restart=on-failure

   [Install]
   WantedBy=multi-user.target
   ```

3. **Enable and Start the Service**:

   After saving the file, you can enable the service to start on boot and start it immediately with:

   ```bash
   sudo systemctl enable personal-website
   sudo systemctl start personal-website
   ```

4. **Monitor the Service**: To check the status of your service, you can use:

   ```bash
   sudo systemctl status personal-website
   ```

---

Make sure you have the necessary permissions and you're operating in a secure environment, especially when running services as the `root` user. Consider creating a specific user for your service if possible.

### 📜 License

This project is licensed under the ISC License.

---

Thank you for checking out my personal website's repository! Feel free to fork, star, and share. If you have any feedback or questions, please drop me a message.


### Issues to solve:
When accessing a path such as http://localhost:3000/projects
I want to access the projects page and not just return the projects partial