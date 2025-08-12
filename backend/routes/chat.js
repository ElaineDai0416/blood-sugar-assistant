const express = require('express');
const router = express.Router();
const bloodSugarService = require('../services/bloodSugarService');

router.post('/stream', async (req, res) => {
  try {
    const { message, userId, assistantType = 'personalized' } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: '请提供消息内容' });
    }

    // 设置 Server-Sent Events 头部
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type'
    });

    // 发送连接确认
    res.write('data: {"type": "connected"}\n\n');

    let fullResponse = '';
    
    // 生成流式响应（支持个性化和标准化两种模式）
    await bloodSugarService.generateStreamResponse(message, userId, (chunk) => {
      res.write(`data: ${JSON.stringify({type: 'message', content: chunk})}\n\n`);
      fullResponse += chunk;
    }, assistantType);

    // 检查是否需要添加交互按钮
    if (fullResponse.includes('您是否需要具体的行动建议？') || 
        fullResponse.includes('是否需要更多建议') ||
        fullResponse.includes('需要我详细说明吗')) {
      const buttons = [
        { text: '需要', action: '需要具体建议', type: '' },
        { text: '不需要', action: '不需要更多建议', type: 'secondary' }
      ];
      res.write(`data: ${JSON.stringify({type: 'buttons', buttons: buttons})}\n\n`);
    }

    // 发送结束标记
    res.write('data: {"type": "done"}\n\n');
    res.end();

  } catch (error) {
    console.error('处理流式聊天请求时出错:', error);
    res.write(`data: ${JSON.stringify({type: 'error', content: '抱歉，我现在无法回复您的消息，请稍后再试。'})}\n\n`);
    res.end();
  }
});

router.post('/', async (req, res) => {
  try {
    const { message, userId } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: '请提供消息内容' });
    }

    const response = await bloodSugarService.generateResponse(message, userId);
    
    res.json({
      success: true,
      response: response,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('处理聊天请求时出错:', error);
    res.status(500).json({
      success: false,
      error: '抱歉，我现在无法回复您的消息，请稍后再试。'
    });
  }
});

router.get('/history/:userId', (req, res) => {
  res.json({
    success: true,
    history: []
  });
});

module.exports = router;