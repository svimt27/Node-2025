// Nodemon -: nodemon is a tool that helps develop node.js based applications by  automatically
//  restarting the node application when file changes on the directory detected.
const http = require('http');
http.createServer((req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.write(`
        <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sample HTML Page</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 40px;
      background-color: #f5f5f5;
      color: #333;
    }
    h1 {
      color: #007bff;
    }
    img {
      width: 200px;
      border-radius: 10px;
    }
    button {
      background-color: #007bff;
      color: white;
      border: none;
      padding: 10px 20px;
      margin-top: 10px;
      cursor: pointer;
      border-radius: 5px;
    }
    button:hover {
      background-color: #0056b3;
    }
  </style>
</head>
<body>

  <h1>Welcome to My Sample HTML Page</h1>
  <p>This is a simple example of an HTML document. It includes text, an image, and a button.</p>

  <img src="https://via.placeholder.com/200" alt="Sample Image">

  <p>Visit <a href="https://www.example.com" target="_blank">Example.com</a> for more information.</p>

  <button onclick="alert('Button clicked!')">Click Me</button>

</body>
</html>

        `);
    res.end();
}).listen(3000);