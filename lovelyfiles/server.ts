const pgPromise = require('pg-promise');
const R = require('ramda');
const request = require('request-promise');

// Limit the amount of debugging of SQL expressions
const trimLogsSize: number = 200;

// print process.argv
// var github_user = process.argv.slice(2);
// https://github.com/75lb/command-line-args
const optionDefinitions = [
  { name: 'user', alias: 'u', type: String },
  { name: 'list', alias: 'l', type: String },
  { name: 'stats', alias: 's', type: Boolean },
  { name: 'trunc', alias: 't', type: Boolean }
]
const commandLineArgs = require('command-line-args')
const cmdOptions = commandLineArgs(optionDefinitions)
var github_user = cmdOptions.user;

// Database interface
interface DBOptions {
    host: string
    , database: string
  , user?: string
  , password?: string
  , port?: number
};

// Actual database options
const options: DBOptions = {
  user: 'lovelystay_test',
  password: 'lovelystay',
  host: 'database',
  database: 'lovelystay_test',
};

console.info('Connecting to the database:',
  `${options.user}@${options.host}:${options.port}/${options.database}`);

const pgpDefaultConfig = {
  promiseLib: require('bluebird'),
  // Log all querys
  query(query) {
    console.log('[SQL   ]', R.take(trimLogsSize, query.query));
  },
  // On error, please show me the SQL
  error(err, e) {
    if (e.query) {
      console.error('[SQL   ]', R.take(trimLogsSize, e.query), err);
    }
  }
};

interface GithubUsers {
    id: number,
  gitid: number,
  login: string,
  name: string,
  company: string,
  location: string,
  followers: number,
};

const pgp = pgPromise(pgpDefaultConfig);
const db = pgp(options);

db.none(`CREATE TABLE if not exists github_users (
  id BIGSERIAL,
  gitid BIGINT PRIMARY KEY,
  login TEXT,
  name TEXT,
  company TEXT,
  location TEXT,
  followers BIGINT
  )`
)
  .then(() => {getArg()});

//Split functions for add user, get stats and lis users by location

function getArg() {
  for (var k in cmdOptions) {
    switch (k) {
      case 'user':
        request({
          uri: `https://api.github.com/users/${github_user}`,
          headers: {
            'User-Agent': 'Request-Promise'
          },
          json: true
        }).then((data: GithubUsers) => db.one(
          `INSERT INTO github_users 
            ( 
              gitid,
              login,
              name,
              company,
              location,
              followers
              ) VALUES (
                $[id],
                $[login],
                $[name],
                $[company],
                $[location],
                $[followers]
                ) RETURNING id`, data)
        ).then(({ id }) => console.log(id))
          .catch((error) => console.log(error.detail))
          .then(() => process.exit(0));
        break;
      case 'list':
        db.any(`Select name from github_users where location ~* 'lisbon'`)
        .then(data => data.forEach(element => {
          console.log(element.name);
        }))
        .then(() => process.exit(0));
        break;
      case 'stats':
        db.any(`select location, count(*) t from github_users group by location;`)
        .then(data => data.forEach(element => {
          console.log(element.location, element.t);
        }))
        .then(() => process.exit(0));
        break;
      case 'trunc':
        db.none('truncate table github_users').then(() => process.exit(0));
        break;
      default:
        break;
    }
  }
}