pm2 start ./bin/service_worker.js
pm2 scale ./bin/service_worker.js +2
pm2 logs