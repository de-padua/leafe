
Basic .env structure file for backend/docker-compose 

```
#URI
DATABASE_URL="postgresql://docker:docker@docker-service-name:5432/db-name?schema=public"

#credentials
POSTGRES_USER=docker
POSTGRES_PASSWORD=docker
POSTGRES_DB=db-name

PORT=5000

JWT_SECRET=YOUR-JWT-SECRET

JWT_SECRET_REFRESH=YOUR-JWT-SECRET


JWT_ADM_SECRET=YOUR-JWT-SECRET



JWT_VERIFY_CODE=YOUR-JWT-SECRET
``` 
