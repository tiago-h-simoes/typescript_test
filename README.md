## Typescript Interview Test

1. Install postgres & nodejs
2. Create the test database using the `./createdb.sh` script
3. Install the `npm_modules` for this project running `npm install`
4. Run `npm run test` to get the program running (modify the user and password if needed)
5. Examine the typescript code under `server.ts`

## Docker Interaction

Postgres is running on port 55432, if needed it can be changed in the docker-compose.yml.
Example:

    ```
    ports:
    
            - "<new port>:5432"
    ```

1. docker-compose up -d
2. docker exec lovely-node npm install
3. Examples found in test.sh