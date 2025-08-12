const axios = require('axios');

async function testDeepSeekAPI() {
  const apiKey = 'sk-13e6b395cb914bbda362f1ece220fa50';
  const baseURL = 'https://api.deepseek.com/v1';
  
  try {
    console.log('正在测试 DeepSeek API...');
    
    const response = await axios.post(
      `${baseURL}/chat/completions`,
      {
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: '你是一个友好的助手。'
          },
          {
            role: 'user', 
            content: '你好，请简单回复一下'
          }
        ],
        temperature: 0.7,
        max_tokens: 100
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('✅ API 测试成功！');
    console.log('响应内容:', response.data.choices[0].message.content);
    console.log('模型:', response.data.model);
    console.log('用量:', response.data.usage);
    
  } catch (error) {
    console.log('❌ API 测试失败');
    console.log('错误信息:', error.response?.data || error.message);
    console.log('状态码:', error.response?.status);
  }
}

testDeepSeekAPI();