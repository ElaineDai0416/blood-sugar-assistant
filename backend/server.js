const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const chatRoutes = require('./routes/chat');
const bloodSugarService = require('./services/bloodSugarService');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('../frontend'));

app.use('/api/chat', chatRoutes);

app.get('/', (req, res) => {
  res.sendFile('index.html', { root: '../frontend' });
});

app.listen(PORT, () => {
  console.log(`血糖管理助手服务器运行在端口 ${PORT}`);
});