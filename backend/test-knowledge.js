const professionalKnowledgeBase = require('./data/professionalKnowledgeBase');

// 测试个性化分析功能
console.log('=== 测试个性化血糖分析 ===\n');

// 测试场景1：餐后血糖9.5，吃了白米饭
const testCase1 = {
  value: 9.5,
  timeType: '餐后',
  timeAfterMeal: 1,
  mealInfo: '白米饭和青菜',
  activityInfo: '饭后没有运动'
};

console.log('测试场景1：餐后1小时血糖9.5，吃了白米饭');
console.log('用户输入:', JSON.stringify(testCase1, null, 2));

const analysis1 = professionalKnowledgeBase.analyzeBloodSugar(testCase1);
const rules1 = professionalKnowledgeBase.matchPersonalizedRules(testCase1);
const patterns1 = professionalKnowledgeBase.identifyPatterns(testCase1);

console.log('\n📊 基础分析结果:');
analysis1.forEach(result => console.log(`- ${result.message}`));

console.log('\n🎯 匹配的个性化规则:');
rules1.forEach(rule => console.log(`- ${rule.condition}: ${rule.recommendation}`));

console.log('\n📈 识别的血糖模式:');
patterns1.forEach(pattern => console.log(`- ${pattern.pattern}: ${pattern.message}`));

const advice1 = professionalKnowledgeBase.generatePersonalizedAdvice(analysis1, rules1);
console.log('\n💡 个性化建议:');
console.log(advice1);

console.log('\n' + '='.repeat(50) + '\n');

// 测试场景2：晚餐后3小时血糖还在8.5
const testCase2 = {
  value: 8.5,
  timeType: '餐后',
  timeAfterMeal: 3,
  mealInfo: '晚餐：红烧肉、米饭、奶茶',
  activityInfo: '吃完饭就看电视了'
};

console.log('测试场景2：晚餐后3小时血糖8.5，高脂混合餐');
console.log('用户输入:', JSON.stringify(testCase2, null, 2));

const analysis2 = professionalKnowledgeBase.analyzeBloodSugar(testCase2);
const rules2 = professionalKnowledgeBase.matchPersonalizedRules(testCase2);
const patterns2 = professionalKnowledgeBase.identifyPatterns(testCase2);

console.log('\n📊 基础分析结果:');
analysis2.forEach(result => console.log(`- ${result.message}`));

console.log('\n🎯 匹配的个性化规则:');
rules2.forEach(rule => console.log(`- ${rule.condition}: ${rule.recommendation}`));

console.log('\n📈 识别的血糖模式:');
patterns2.forEach(pattern => console.log(`- ${pattern.pattern}: ${pattern.message}`));

const advice2 = professionalKnowledgeBase.generatePersonalizedAdvice(analysis2, rules2);
console.log('\n💡 个性化建议:');
console.log(advice2);

console.log('\n' + '='.repeat(50) + '\n');

// 测试场景3：空腹血糖6.8
const testCase3 = {
  value: 6.8,
  timeType: '空腹',
  timeAfterMeal: null,
  mealInfo: '昨晚10点吃了夜宵',
  activityInfo: '最近工作压力比较大，睡眠不太好'
};

console.log('测试场景3：空腹血糖6.8，有压力因素');
console.log('用户输入:', JSON.stringify(testCase3, null, 2));

const analysis3 = professionalKnowledgeBase.analyzeBloodSugar(testCase3);
const rules3 = professionalKnowledgeBase.matchPersonalizedRules(testCase3);

console.log('\n📊 基础分析结果:');
analysis3.forEach(result => console.log(`- ${result.message}`));

console.log('\n🎯 匹配的个性化规则:');
rules3.forEach(rule => console.log(`- ${rule.condition}: ${rule.recommendation}`));

const advice3 = professionalKnowledgeBase.generatePersonalizedAdvice(analysis3, rules3);
console.log('\n💡 个性化建议:');
console.log(advice3);

console.log('\n✅ 知识库测试完成!');