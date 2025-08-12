const knowledgeBase = require('../data/knowledgeBase');
const deepseekService = require('./deepseekService');
const professionalKnowledgeBase = require('../data/professionalKnowledgeBase');

class BloodSugarService {
  constructor() {
    this.conversationHistory = new Map();
    this.userStates = new Map(); // 用户对话状态管理
  }

  async generateResponse(message, userId) {
    const userMessage = message.toLowerCase();
    
    let responseTemplate = this.identifyQueryType(userMessage);
    
    if (!responseTemplate) {
      responseTemplate = knowledgeBase.general;
    }

    const personalizedResponse = this.personalizeResponse(responseTemplate, message);
    
    this.saveConversation(userId, message, personalizedResponse);
    
    return personalizedResponse;
  }

  identifyQueryType(message) {
    const queryTypes = {
      highBloodSugar: ['血糖高', '血糖升高', '血糖飙升', '血糖突然高', '血糖过高'],
      bloodSugarSpike: ['血糖突然', '为什么升高', '血糖飙升', '突然升高'],
      worry: ['担心', '紧张', '害怕', '焦虑', '恐慌'],
      whatToDo: ['怎么办', '该怎么做', '如何处理', '怎么降血糖'],
      symptoms: ['症状', '感觉', '不舒服', '头晕', '口渴']
    };

    for (const [type, keywords] of Object.entries(queryTypes)) {
      if (keywords.some(keyword => message.includes(keyword))) {
        return knowledgeBase[type];
      }
    }

    return null;
  }

  personalizeResponse(template, originalMessage) {
    const response = {
      emotional: template.emotional,
      knowledge: template.knowledge,
      advice: template.advice,
      followUp: template.followUp
    };

    const timeOfDay = new Date().getHours();
    let timeGreeting = '';
    if (timeOfDay < 12) timeGreeting = '上午好！';
    else if (timeOfDay < 18) timeGreeting = '下午好！';
    else timeGreeting = '晚上好！';

    response.emotional = timeGreeting + response.emotional;

    return response;
  }

  async generateStreamResponse(message, userId, callback, assistantType = 'personalized') {
    const userMessage = message.toLowerCase();
    
    // 获取用户当前状态
    let userState = this.getUserState(userId);
    
    // 获取对话历史
    const history = this.conversationHistory.get(userId) || [];
    
    try {
      // 使用专业知识库进行分析
      const userInfo = this.extractUserInfo(message, userState);
      const knowledgeContext = this.buildKnowledgeContext(userInfo);
      
      // 使用 DeepSeek API 生成回复
      const messages = this.buildMessagesWithKnowledge(message, userState, history, assistantType, knowledgeContext);
      
      let fullResponse = '';
      await deepseekService.streamChat(messages, (content) => {
        callback(content);
        fullResponse += content;
      });
      
      // 根据回复更新用户状态
      this.updateUserStateFromResponse(userId, message, fullResponse, userState);
      
      this.saveConversation(userId, message, fullResponse);
      
    } catch (error) {
      console.error('DeepSeek API 调用失败:', error);
      // 降级到本地回复
      const fallbackResponse = this.generateFallbackResponse(userMessage, userState, userId);
      const chunks = this.chunkText(fallbackResponse);
      
      for (const chunk of chunks) {
        callback(chunk);
        await this.delay(80 + Math.random() * 150);
      }
      
      this.saveConversation(userId, message, fallbackResponse);
    }
  }

  getUserState(userId) {
    if (!this.userStates.has(userId)) {
      this.userStates.set(userId, {
        stage: 'initial', // initial, comforting, gathering, analyzing, advising
        collectedInfo: {
          bloodSugarValue: null,
          timeOfMeasurement: null,
          lastMeal: null,
          recentActivity: null,
          symptoms: null
        },
        analysisResult: null
      });
    }
    return this.userStates.get(userId);
  }

  updateUserState(userId, updates) {
    const state = this.getUserState(userId);
    Object.assign(state, updates);
    this.userStates.set(userId, state);
  }

  generateContextualResponse(userMessage, userState, userId) {
    const timeOfDay = new Date().getHours();
    let timeGreeting = '';
    if (timeOfDay < 12) timeGreeting = '上午好！';
    else if (timeOfDay < 18) timeGreeting = '下午好！';
    else timeGreeting = '晚上好！';

    // 检测是否是血糖问题的开始
    if (this.isBloodSugarIssue(userMessage) && userState.stage === 'initial') {
      this.updateUserState(userId, { stage: 'comforting' });
      return this.provideComfort(timeGreeting);
    }

    // 根据当前阶段处理对话
    switch (userState.stage) {
      case 'comforting':
        return this.startGathering(userId);
      case 'gathering':
        return this.gatherInformation(userMessage, userState, userId);
      case 'analyzing':
        return this.analyzeAndExplain(userState, userId);
      case 'advising':
        return this.provideAdvice(userMessage, userState, userId);
      default:
        return this.handleGeneralQuery(userMessage, timeGreeting);
    }
  }

  isBloodSugarIssue(message) {
    const keywords = ['血糖高', '血糖升高', '血糖飙升', '血糖突然', '血糖过高', '血糖不正常'];
    return keywords.some(keyword => message.includes(keyword));
  }

  provideComfort(timeGreeting) {
    return `${timeGreeting}我理解您对血糖升高的担心，这确实让人感到不安。请先放松一下，深呼吸几次。

血糖波动在日常生活中是比较常见的，大多数情况下都是可以找到原因并有效处理的。现在最重要的是不要过于紧张，因为焦虑本身也可能影响血糖。

为了更好地帮助您分析具体原因，我需要了解一些详细情况。您愿意告诉我吗？`;
  }

  startGathering(userId) {
    this.updateUserState(userId, { stage: 'gathering' });
    return `首先，请告诉我您的血糖数值是多少？这是什么时候测量的？`;
  }

  gatherInformation(userMessage, userState, userId) {
    const info = userState.collectedInfo;
    
    // 收集血糖数值
    if (!info.bloodSugarValue) {
      const numberMatch = userMessage.match(/(\d+\.?\d*)/);
      if (numberMatch) {
        info.bloodSugarValue = parseFloat(numberMatch[1]);
        this.updateUserState(userId, { collectedInfo: info });
        return "好的，我记录了您的血糖数值。请问这是什么时候测量的？是饭前、饭后，还是其他时间？";
      } else {
        return "请告诉我具体的血糖数值，这样我能更准确地为您分析。";
      }
    }

    // 收集测量时间
    if (!info.timeOfMeasurement) {
      let timeInfo = '';
      if (userMessage.includes('饭前') || userMessage.includes('空腹')) {
        timeInfo = '饭前';
      } else if (userMessage.includes('饭后')) {
        timeInfo = '饭后';
      } else if (userMessage.includes('早上') || userMessage.includes('晨起')) {
        timeInfo = '晨起';
      } else {
        timeInfo = userMessage;
      }
      
      info.timeOfMeasurement = timeInfo;
      this.updateUserState(userId, { collectedInfo: info });
      return "明白了。那么请告诉我，您最后一次吃东西是什么时候？吃了些什么？";
    }

    // 收集饮食信息
    if (!info.lastMeal) {
      info.lastMeal = userMessage;
      this.updateUserState(userId, { collectedInfo: info });
      return "好的。最后一个问题，今天有什么特殊情况吗？比如工作压力大、没怎么运动、睡眠不好，或者身体有什么不舒服的地方？";
    }

    // 收集其他因素
    if (!info.recentActivity) {
      info.recentActivity = userMessage;
      this.updateUserState(userId, { 
        collectedInfo: info, 
        stage: 'analyzing' 
      });
      return this.analyzeAndExplain(this.getUserState(userId), userId);
    }

    return "请提供更多信息，这样我能给您更准确的分析。";
  }

  analyzeAndExplain(userState, userId) {
    const info = userState.collectedInfo;
    const analysis = this.performAnalysis(info);
    
    this.updateUserState(userId, { 
      stage: 'advising',
      analysisResult: analysis
    });

    return `根据您提供的信息，我来为您分析一下：

${analysis.explanation}

这种情况${analysis.severity}。${analysis.advice}

您对这个分析还有什么疑问吗？或者需要我详细解释某个方面？`;
  }

  performAnalysis(info) {
    const value = info.bloodSugarValue;
    const time = info.timeOfMeasurement?.toLowerCase() || '';
    const meal = info.lastMeal?.toLowerCase() || '';
    const activity = info.recentActivity?.toLowerCase() || '';

    let explanation = '';
    let severity = '';
    let advice = '';

    // 分析血糖值和时间关系
    if (time.includes('饭后') && value > 10) {
      if (meal.includes('米饭') || meal.includes('面条') || meal.includes('馒头')) {
        explanation = '您的血糖升高主要是因为刚进食了含有较多碳水化合物的主食。米饭、面条这类食物会在消化后快速转化为葡萄糖，导致餐后1-2小时血糖达到峰值。';
        severity = '属于餐后正常的生理反应';
        advice = '建议监测2小时后血糖是否回落，平时可以考虑减少主食分量，增加蔬菜和蛋白质。';
      } else if (meal.includes('甜') || meal.includes('糖') || meal.includes('水果')) {
        explanation = '血糖升高是因为摄入了含糖量较高的食物。这些食物中的糖分会被快速吸收，直接导致血糖上升。';
        severity = '需要注意控制糖分摄入';
        advice = '建议以后尽量避免空腹或餐后立即食用高糖食物，可以选择在运动前适量摄入。';
      }
    } else if (time.includes('饭前') || time.includes('空腹')) {
      if (activity.includes('压力') || activity.includes('紧张') || activity.includes('忙')) {
        explanation = '您的空腹血糖升高很可能与最近的压力有关。压力会促使身体分泌皮质醇等激素，这些激素会刺激肝脏释放更多葡萄糖到血液中。';
        severity = '属于应激反应导致的血糖波动';
        advice = '建议通过放松技巧缓解压力，如深呼吸、轻松散步等，压力缓解后血糖通常会逐渐恢复。';
      } else if (activity.includes('没运动') || activity.includes('久坐')) {
        explanation = '缺乏运动可能是血糖升高的重要因素。规律的身体活动能提高肌肉对胰岛素的敏感性，帮助更好地控制血糖。';
        severity = '与生活方式相关';
        advice = '建议每天安排30分钟的轻度运动，即使是简单的走路也很有帮助。';
      }
    }

    // 默认分析
    if (!explanation) {
      explanation = '从您的情况看，血糖升高可能与多个因素有关，包括饮食、作息、压力等综合影响。';
      severity = '需要持续观察';
      advice = '建议记录详细的血糖日记，观察规律，必要时咨询医生。';
    }

    return { explanation, severity, advice };
  }

  provideAdvice(userMessage, userState, userId) {
    if (userMessage.includes('没有') || userMessage.includes('明白了') || userMessage.includes('谢谢')) {
      // 重置用户状态
      this.updateUserState(userId, { stage: 'initial' });
      return "很高兴能帮到您！记住，规律监测、健康饮食和适度运动是血糖管理的三大要素。如果以后还有血糖方面的问题，随时可以来咨询我。祝您身体健康！";
    }
    
    return "请告诉我您还有什么具体的疑问，我会详细为您解答。";
  }

  handleGeneralQuery(userMessage, timeGreeting) {
    if (userMessage.includes('担心') || userMessage.includes('紧张')) {
      return `${timeGreeting}我理解您的担心。血糖管理确实需要关注，但不必过度焦虑。如果您现在遇到了具体的血糖问题，请详细告诉我，我会帮您分析原因并提供建议。`;
    }
    
    return `${timeGreeting}我是您的血糖管理助手。如果您有血糖相关的问题，比如血糖升高、症状不适等，请详细告诉我具体情况，我会为您提供个性化的分析和建议。`;
  }

  chunkText(text) {
    const chunks = [];
    const sentences = text.split(/([。！？\n])/);
    
    for (let i = 0; i < sentences.length; i += 2) {
      const sentence = sentences[i] + (sentences[i + 1] || '');
      if (sentence.trim()) {
        chunks.push(sentence);
      }
    }
    
    return chunks;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // 新增：提取用户信息
  extractUserInfo(message, userState) {
    const info = {
      value: null,
      timeType: null,
      timeAfterMeal: null,
      mealInfo: null,
      activityInfo: null,
      symptoms: null
    };
    
    // 从用户状态中获取已收集信息
    const collected = userState.collectedInfo;
    if (collected) {
      info.value = collected.bloodSugarValue;
      info.timeType = collected.timeOfMeasurement;
      info.mealInfo = collected.lastMeal;
      info.activityInfo = collected.recentActivity;
    }
    
    // 从当前消息中提取血糖数值
    const numberMatch = message.match(/(\d+\.?\d*)/);  
    if (numberMatch) {
      info.value = parseFloat(numberMatch[1]);
    }
    
    // 更强的时间信息提取
    if (message.includes('早餐') || message.includes('上午')) {
      info.timeType = '早餐后';
      if (message.includes('吃了')) {
        info.timeAfterMeal = 1; // 默认餐后1小时
      }
    } else if (message.includes('午餐') || message.includes('中午')) {
      info.timeType = '午餐后';
    } else if (message.includes('晚餐') || message.includes('晚上')) {
      info.timeType = '晚餐后';
    } else if (message.includes('餐后')) {
      const timeMatch = message.match(/(\d+).*[小时]/);  
      if (timeMatch) {
        info.timeAfterMeal = parseInt(timeMatch[1]);
        info.timeType = '餐后';
      } else {
        info.timeType = '餐后';
        info.timeAfterMeal = 1; // 默认1小时
      }
    } else if (message.includes('餐前') || message.includes('空腹')) {
      info.timeType = '空腹';
    }
    
    // 提取饮食信息
    if (message.includes('吃了') || message.includes('面条') || message.includes('米饭') || message.includes('包子')) {
      info.mealInfo = message;
    }
    
    return info;
  }

  // 新增：构建知识库上下文
  buildKnowledgeContext(userInfo) {
    let context = '';
    
    // 执行专业分析
    const analysisResults = professionalKnowledgeBase.analyzeBloodSugar(userInfo);
    const personalizedRules = professionalKnowledgeBase.matchPersonalizedRules(userInfo);
    const patterns = professionalKnowledgeBase.identifyPatterns(userInfo);
    
    if (personalizedRules.length > 0) {
      context += `\n## 匹配的个性化规则:\n`;
      personalizedRules.slice(0, 2).forEach(rule => {
        context += `- ${rule.condition}: ${rule.recommendation} (预期效果: ${rule.evidence})\n`;
      });
    }
    
    if (patterns.length > 0) {
      context += `\n## 识别的血糖模式:\n`;
      patterns.slice(0, 2).forEach(pattern => {
        context += `- ${pattern.pattern}: ${pattern.message}\n`;
      });
    }
    
    if (analysisResults.length > 0) {
      context += `\n## 基础分析结果:\n`;
      analysisResults.slice(0, 2).forEach(result => {
        context += `- ${result.message}\n`;
      });
    }
    
    // 建议实验
    const experiment = professionalKnowledgeBase.suggestExperiment(userInfo);
    if (experiment) {
      context += `\n## 建议的生活方式实验:\n${experiment.title} (${experiment.duration})\n`;
    }
    
    return context;
  }

  // 新增：构建消息（支持知识库上下文）
  buildMessagesWithKnowledge(userMessage, userState, history, assistantType, knowledgeContext = '') {
    const messages = [];
    
    // 添加系统提示词
    const systemPrompt = assistantType === 'standardized' 
      ? deepseekService.createStandardizedSystemPrompt()
      : deepseekService.createPersonalizedSystemPrompt(knowledgeContext);
    
    messages.push({
      role: 'system',
      content: systemPrompt
    });
    
    // 添加用户状态上下文
    if (userState.stage !== 'initial') {
      const contextInfo = this.buildContextInfo(userState);
      messages.push({
        role: 'system',
        content: `当前对话状态: ${contextInfo}`
      });
    }
    
    // 添加最近的对话历史
    if (history.length > 0) {
      const recentHistory = history.slice(-3);
      for (const item of recentHistory) {
        messages.push({
          role: 'user',
          content: item.userMessage
        });
        messages.push({
          role: 'assistant', 
          content: item.botResponse
        });
      }
    }
    
    // 添加当前用户消息
    messages.push({
      role: 'user',
      content: userMessage
    });
    
    return messages;
  }

  // 更新用户状态（简化版）
  updateUserStateFromResponse(userId, userMessage, response, currentState) {
    // 简单的状态推进逻辑
    this.extractInfoFromMessage(userId, userMessage);
  }

  // 从消息中提取信息
  extractInfoFromMessage(userId, message) {
    const state = this.getUserState(userId);
    const info = state.collectedInfo;
    
    // 提取数值
    const numberMatch = message.match(/(\d+\.?\d*)/);
    if (numberMatch && !info.bloodSugarValue) {
      info.bloodSugarValue = parseFloat(numberMatch[1]);
    }
    
    // 提取时间信息
    if ((message.includes('餐前') || message.includes('空腹')) && !info.timeOfMeasurement) {
      info.timeOfMeasurement = '餐前';
    } else if (message.includes('餐后') && !info.timeOfMeasurement) {
      info.timeOfMeasurement = '餐后';
    }
    
    this.updateUserState(userId, { collectedInfo: info });
  }

  // 降级响应
  generateFallbackResponse(userMessage, userState, userId) {
    return this.generateContextualResponse(userMessage, userState, userId);
  }

  saveConversation(userId, userMessage, botResponse) {
    if (!this.conversationHistory.has(userId)) {
      this.conversationHistory.set(userId, []);
    }
    
    this.conversationHistory.get(userId).push({
      timestamp: new Date(),
      userMessage,
      botResponse
    });
  }
}

module.exports = new BloodSugarService();