workers = 4
worker_class = 'uvicorn.workers.UvicornWorker'
timeout = 120
bind = '0.0.0.0:10000'  # Render will use PORT environment variable
