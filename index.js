const PORT = process.env.PORT || 3000;
const express = require('express');
const app = express();
app.listen(PORT, () => console.log('listening at port 3000...'));
app.use(express.static('public'));
