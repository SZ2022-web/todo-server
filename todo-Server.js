const http = require('http');
const url = require('url');

let list = [];

// Extract the port number from the command line arguments
const port = parseInt(process.argv[2], 10);

// Port validation
if (!port) {
  console.log("❌ Missing Server Port Number");
  console.log("Usage: node todoServer2.js [port number]");
  process.exit(1);
}

if (port < 3000) {
  console.log("❌ Port number must be greater or equal to 3000");
  process.exit(1);
}

// Request handler function
const reqHandler = (req, res) => {
  switch (req.method) {
    case 'POST':
      let item = '';
      req.setEncoding('utf-8');
      req.on('data', chunk => item += chunk);
      req.on('end', () => {
        list.push(item);
        console.log(list);
        res.end('✅ Item added\n');
      });
      break;

    case 'GET':
      if (list.length === 0) {
        res.end("🎉 Your To-Do list is empty. Well done!\n");
      } else {
        const toDoList = list.map((x, i) => `${i + 1}) ${x}`).join('\n');
        res.end(toDoList + '\n');
      }
      break;

    case 'DELETE':
      const deleteIndex = parseInt(url.parse(req.url).pathname.slice(1), 10) - 1;
      if (isNaN(deleteIndex) || deleteIndex < 0 || deleteIndex >= list.length) {
        res.end('❌ Invalid index for deletion\n');
      } else {
        list.splice(deleteIndex, 1);
        res.end('✅ Item deleted\n');
      }
      break;

    case 'PUT':
      const path = url.parse(req.url).pathname;
      const updateIndex = parseInt(path.slice(1), 10) - 1;
      if (isNaN(updateIndex) || updateIndex < 0 || updateIndex >= list.length) {
        res.end('❌ Invalid index for update\n');
      } else {
        let updatedItem = '';
        req.setEncoding('utf-8');
        req.on('data', chunk => updatedItem += chunk);
        req.on('end', () => {
          list[updateIndex] = updatedItem;
          console.log(list);
          res.end('✅ Item updated\n');
        });
      }
      break;

    default:
      res.end('❌ Invalid HTTP method\n');
      break;
  }
};

// Create and start server
const server = http.createServer(reqHandler);
server.listen(port, () => {
  console.log(`🚀 Server listening on port ${port}`);
});


