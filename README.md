# DevFinder


# Deployment

    - Signup on AWS 
    - Launch instance
    - chmod 400 <secret>.pem
    - ssh -i "dev******-******.pem" ubuntu@*******************************amazonaws.com
    - Install Node version 16.17.0
    - Git clone
    - Frontend    
        - npm install  -> dependencies install
        - npm run build
        - sudo apt update
        - sudo apt install nginx
        - sudo systemctl start nginx
        - sudo systemctl enable nginx
        - Copy code from dist(build files) to /var/www/html/
        - sudo scp -r dist/* /var/www/html/
        - Enable port :80 of your instance
    - Backend
        - updated DB password
        - allowed ec2 instance public IP on mongodb server
        - npm intsall pm2 -g
        - pm2 start npm --name "devTinder-backend" -- start
        - pm2 logs
        - pm2 list, pm2 flush <name> , pm2 stop <name>, pm2 delete <name>
        - config nginx - /etc/nginx/sites-available/default
        - restart nginx - sudo systemctl restart nginx
        - Modify the BASEURL in frontend project to "/api"


# Ngxinx config: 

        Frontend = http://Public IP in your EC2/
        Backend = http://Public IP in your EC2:3000/
    
        Domain name = devtinder.com => Public IP in your EC2

        Frontend = devfinder.com
        Backend = devfinder.com:3000 => devfinder.com/api

        nginx config : 

        server_name [Public IP in your EC2];

        location /api/ {
            proxy_pass http://localhost:3000/;  # Pass the request to the Node.js app
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }
