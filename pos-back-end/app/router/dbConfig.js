const Client = require("mysql-pro");
const client = new Client({     
    mysql: {
          user: 'root',
          password: '123456',
          database: 'pos',
          host: '101.132.184.238',
    }
}); 

module.exports = client;