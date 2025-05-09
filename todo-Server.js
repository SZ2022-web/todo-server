const http = require('http');
const url = require('url');

var list = [];

//Extract the port number from the command line arguments
const port = process.argv[2];

//port validation
if (process.argv.length < 3) {
  console.log("Missing Server Port Number");
  console.log("Usage: node todoServer2.js [port number]");
  return;
}

 if ( port < 3000) {
   console.log("Port number must be greater or equal to 3000");
   return;
}
 

//request handler function
const reqHandler = (req, res)=>{
switch(req.method){
  case 'POST':
  let item = '';
  req.setEncoding('utf-8');
  req.on('data', (chunk)=>{
    item += chunk;
  });
  
  req.on('end', ()=>{
    list.push(item);
    console.log(list);
    res.end('OK\n');
  });
  break;


  case 'GET':
  if(list.length === 0){
    res.end("Your To-Do list is empty. Well Done!!!\n")
  }else{
    let toDoList = '';
    list.forEach((x,i)=>{
      toDoList += (i + 1) + ') ' + x + '\n' ;
    });
    res.end(toDoList);
  }
  break;

  case 'DELETE':
  let deletePath = url.parse(req.url).pathname;
  let index = parseInt(deletePath.slice(1), 10)-1;
  if (isNaN(index) || index < 0 || index >= list.length) {
    res.end('Missing index for item to be deleted\n');
  }else{
    list.splice(index, 1);
    res.end('OK\n');
  }
  break;
  

  case 'PUT':
  let path = url.parse(req.url).pathname;
  let i= parseInt(path.slice(1), 10);

  if ( path.length <= 1) {
    res.end('Missing index for item to be updated');
}else if (Number.isNaN(i)) {  
    res.end('Invalid index value');
    
}else if (i < 1 || i > list.length) {
    res.end('Item not found');
  }else{

  let updatedItem = '';
  req.setEncoding('utf-8');

  req.on('data', (chunk)=>{
    updatedItem += chunk;
  });

  req.on('end', ()=>{
    if (updatedItem) { 
   list.splice(i-1, 1, updatedItem);
   console.log(list);
    res.end('OK\n');
    }
    });
}
    break;  
  'default'
    res.end('Invalid method\n');
    break;
}
}

//create and start server
const server = http.createServer(reqHandler);
server.listen(port, () => {
  console.log(`The server is listening on port ${port}`);
});



