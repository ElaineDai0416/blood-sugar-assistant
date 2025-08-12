const bloodSugarService = require('./services/bloodSugarService');

async function testPersonalizedAssistant() {
  console.log('=== 测试个性化血糖助手 ===\n');
  
  const userId = 'test_user_' + Date.now();
  
  try {
    console.log('测试消息: "餐后1小时血糖9.5，刚吃了白米饭和青菜"');
    console.log('正在调用DeepSeek API...\n');
    
    let fullResponse = '';
    await bloodSugarService.generateStreamResponse(
      '餐后1小时血糖9.5，刚吃了白米饭和青菜', 
      userId, 
      (chunk) => {
        process.stdout.write(chunk);
        fullResponse += chunk;
      },
      'personalized'
    );
    
    console.log('\n\n✅ 个性化助手测试完成');
    console.log('完整回复:', fullResponse);
    
  } catch (error) {
    console.error('❌ 测试失败:', error.message);
  }
}

async function testStandardizedAssistant() {
  console.log('\n\n=== 测试标准化血糖助手 ===\n');
  
  const userId = 'test_user_standard_' + Date.now();
  
  try {
    console.log('测试消息: "餐后1小时血糖9.5，刚吃了白米饭和青菜"');
    console.log('正在调用DeepSeek API...\n');
    
    let fullResponse = '';
    await bloodSugarService.generateStreamResponse(
      '餐后1小时血糖9.5，刚吃了白米饭和青菜', 
      userId, 
      (chunk) => {
        process.stdout.write(chunk);
        fullResponse += chunk;
      },
      'standardized'
    );
    
    console.log('\n\n✅ 标准化助手测试完成');
    console.log('完整回复:', fullResponse);
    
  } catch (error) {
    console.error('❌ 测试失败:', error.message);
  }
}

// 运行测试
async function runTests() {
  await testPersonalizedAssistant();
  await testStandardizedAssistant();
  console.log('\n🎉 所有测试完成!');
}

runTests();