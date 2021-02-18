The backend should provide API endpoints to retrieve and manage bicycle renting.

- Differentiate between users using sessions

- Create an endpoint to retrieve all bicycles and their necessary information for the frontend application.

- Create an endpoint to rent a bicycle. A user who currently rents a bike should not be able to rent a second bicycle at the same time.

- Create an endpoint to return a bicycle. A user shouldn't be able to return a bicycle that he hasn't rented.

Sample data:
id name latitude longitude rented
0 "Henry" 50.119504 8.638137 false
1 "Hans" 50.119229 8.640020 false

2 "Thomas" 50.120452 8.650507 false

```sh
docker run -d \
    --name mongo-docker-bikes \
    -p 27888:27017 \
    -e MONGO_INITDB_ROOT_USERNAME=mongo_admin \
    -e MONGO_INITDB_ROOT_PASSWORD=mongo_pwd
```
