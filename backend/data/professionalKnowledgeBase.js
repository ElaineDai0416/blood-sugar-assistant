// 专业血糖管理知识库
const professionalKnowledgeBase = {
  // 血糖阈值标准 (mmol/L)
  bloodSugarThresholds: {
    fasting: {
      normal: { min: 3.9, max: 6.1 },
      prediabetes: { min: 6.1, max: 7.0 },
      diabetes: { min: 7.0, max: Infinity }
    },
    postMeal2h: {
      normal: { min: 3.9, max: 7.8 },
      prediabetes: { min: 7.8, max: 11.1 },
      diabetes: { min: 11.1, max: Infinity }
    },
    postMeal1h: {
      normal: { min: 3.9, max: 10.0 },
      elevated: { min: 10.0, max: 13.9 },
      high: { min: 13.9, max: Infinity }
    }
  },

  // 专业血糖模式库
  glucoseProfiles: {
    "GP01": {
      pattern: "早餐双峰",
      description: "早餐后30–60分钟出现首峰并短暂回落后再次上冲",
      causes: ["精制主食搭配含糖饮品或水果过早进食", "蛋白纤维不足", "进餐过快"],
      advice: "采用餐序:蔬菜蛋白→主食,主食减量20%,用全谷替代1/3,餐后10–20分钟步行20–30分钟",
      severity: "中",
      triggers: ["双峰", "首峰", "再次上冲", "早餐后波动"]
    },
    "GP02": {
      pattern: "高平台不回落", 
      description: "餐后血糖快速升至8–10并维持2–3小时缓慢下降",
      causes: ["高脂高碳混合餐", "油炸奶茶搭配", "久坐不动"],
      advice: "减少油脂和含糖饮品,分段活动3×10分钟(餐后15,45,90分钟),晚餐提早30–60分钟",
      severity: "中",
      triggers: ["平台", "不回落", "维持", "缓慢下降"]
    },
    "GP03": {
      pattern: "夜间上扬",
      description: "入睡后2–4小时血糖缓慢上行至清晨偏高", 
      causes: ["晚餐过晚或夜宵为精制碳水", "饮酒", "睡眠不足"],
      advice: "晚餐提早并减量,夜宵改高蛋白低GI(酸奶鸡蛋坚果少量),晚间轻度散步15–20分钟",
      severity: "中",
      triggers: ["夜间", "清晨偏高", "睡后", "上扬"]
    },
    "GP04": {
      pattern: "运动后反跳",
      description: "中高强度运动后短暂降低随后反弹超过基础水平",
      causes: ["空腹高强度", "碳水储备不足", "应激激素上升"],
      advice: "调整为中等强度,运动前后各补低GI碳水15–20g+蛋白,改在餐后30–60分钟运动",
      severity: "中", 
      triggers: ["运动后", "反跳", "反弹", "高强度"]
    },
    "GP05": {
      pattern: "低波动高峰",
      description: "整体波动平稳但峰值偏高(>9)",
      causes: ["份量偏大或主食过精", "进餐过快"],
      advice: "保持组合不变,主食分量减少10–20%,细嚼慢咽>15分钟,添加非淀粉蔬菜≥150g",
      severity: "低",
      triggers: ["峰值偏高", "波动平稳", "超过9"]
    },
    "GP06": {
      pattern: "早餐滞后峰",
      description: "达峰时间延后至90–120分钟且持续偏高",
      causes: ["高脂早餐(油条煎炸)", "蛋白质多但纤维不足"],
      advice: "改为低脂高纤早餐,用全谷燕麦/杂豆粥,餐后步行20–30分钟",
      severity: "中",
      triggers: ["滞后", "延后", "持续偏高", "90分钟"]
    },
    "GP07": {
      pattern: "晚餐高平台",
      description: "晚餐后>3小时维持在8以上",
      causes: ["晚餐能量过高", "甜饮或酒精", "久坐追剧"],
      advice: "减少油脂和液体糖,分段活动(餐后30/60/90分钟各10分钟),限制酒精",
      severity: "中",
      triggers: ["晚餐", "3小时", "维持8以上", "高平台"]
    },
    "GP08": {
      pattern: "黎明现象样上扬", 
      description: "清晨4–8时血糖缓慢上升",
      causes: ["睡眠不足", "压力", "夜间进食", "节律紊乱"],
      advice: "改善睡眠规律,避免夜宵,晚间轻运动,放松训练与规律作息",
      severity: "低",
      triggers: ["黎明", "清晨", "4-8时", "缓慢上升"]
    },
    "GP09": {
      pattern: "碳水敏感型",
      description: "同等份量碳水引起异常高峰值",
      causes: ["高GI主食", "缺少蛋白脂肪缓冲", "个体胰岛素敏感性差"],
      advice: "选择低GI替代(全谷杂豆薯类混合),主食前先吃蔬菜蛋白,峰值监测复盘",
      severity: "中",
      triggers: ["碳水敏感", "异常高峰", "主食", "高GI"]
    },
    "GP10": {
      pattern: "压力相关波动",
      description: "情绪/压力期波动加大且峰值不稳定", 
      causes: ["睡眠欠佳", "心理压力", "咖啡因摄入偏高"],
      advice: "优先干预睡眠与压力管理,咖啡因限量,保持规律轻中强度运动",
      severity: "低",
      triggers: ["压力", "情绪", "波动加大", "不稳定"]
    }
  },

  // 食物GI分类
  foodCategories: {
    highGI: {
      foods: ["白米饭", "白面包", "馒头", "面条", "土豆", "西瓜", "葡萄", "精制主食"],
      impact: "快速升高",
      peakTime: "30-60分钟"
    },
    sugar: {
      foods: ["糖果", "甜饮料", "蛋糕", "巧克力", "冰淇淋", "奶茶", "含糖饮品"],
      impact: "快速大幅升高", 
      peakTime: "15-30分钟"
    },
    lowGI: {
      foods: ["全谷燕麦", "杂豆", "蔬菜", "瘦肉", "鱼类", "坚果", "酸奶", "鸡蛋"],
      impact: "缓慢温和",
      peakTime: "90-120分钟"
    }
  },

  // 智能分析引擎
  analyzeBloodSugar: (userInfo) => {
    const { value, timeType, mealInfo, activityInfo, timeAfterMeal } = userInfo;
    const results = [];

    // 1. 基础阈值判断
    if (timeType === '餐后' && timeAfterMeal <= 2) {
      if (value <= 7.8) {
        results.push({
          type: 'normal',
          confidence: 0.9,
          message: `餐后${timeAfterMeal}小时血糖${value}mmol/L属于正常范围`,
          advice: '血糖控制良好，可以进行适量运动促进血糖回落'
        });
      } else if (value <= 10.0) {
        results.push({
          type: 'slightly_elevated', 
          confidence: 0.8,
          message: `餐后${timeAfterMeal}小时血糖${value}mmol/L略有升高`,
          advice: '建议轻度运动如散步15-20分钟，避免立即进食'
        });
      } else {
        results.push({
          type: 'elevated',
          confidence: 0.9, 
          message: `餐后${timeAfterMeal}小时血糖${value}mmol/L明显升高`,
          advice: '需要轻度运动，多喝水，观察2小时后血糖变化'
        });
      }
    }

    // 2. 模式识别
    const patterns = professionalKnowledgeBase.identifyPatterns(userInfo);
    results.push(...patterns);

    // 3. 食物影响分析
    if (mealInfo) {
      const foodAnalysis = professionalKnowledgeBase.analyzeFoodImpact(mealInfo, value);
      results.push(...foodAnalysis);
    }

    return results.sort((a, b) => b.confidence - a.confidence);
  },

  // 模式识别函数
  identifyPatterns: (userInfo) => {
    const { value, timeType, mealInfo, activityInfo, symptoms } = userInfo;
    const patterns = [];

    // 检查各种模式
    for (const [id, profile] of Object.entries(professionalKnowledgeBase.glucoseProfiles)) {
      let matchScore = 0;
      
      // 检查触发词匹配
      const userText = `${timeType} ${mealInfo} ${activityInfo} ${symptoms}`.toLowerCase();
      const matchedTriggers = profile.triggers.filter(trigger => 
        userText.includes(trigger.toLowerCase())
      );
      
      if (matchedTriggers.length > 0) {
        matchScore = matchedTriggers.length / profile.triggers.length;
        
        if (matchScore > 0.3) {
          patterns.push({
            type: 'pattern_match',
            pattern: profile.pattern,
            confidence: matchScore,
            message: `根据描述，您的情况符合"${profile.pattern}"模式：${profile.description}`,
            advice: profile.advice,
            causes: profile.causes
          });
        }
      }
    }

    return patterns;
  },

  // 食物影响分析
  analyzeFoodImpact: (mealInfo, value) => {
    const results = [];
    const meal = mealInfo.toLowerCase();

    // 检查高GI食物
    const highGIFoods = professionalKnowledgeBase.foodCategories.highGI.foods;
    const matchedHighGI = highGIFoods.filter(food => meal.includes(food));
    
    if (matchedHighGI.length > 0) {
      results.push({
        type: 'food_impact',
        confidence: 0.8,
        message: `摄入${matchedHighGI.join('、')}等高GI食物导致血糖升高至${value}mmol/L`,
        advice: '建议用全谷物替代精制主食，餐前先吃蔬菜和蛋白质'
      });
    }

    // 检查含糖食物
    const sugarFoods = professionalKnowledgeBase.foodCategories.sugar.foods;
    const matchedSugar = sugarFoods.filter(food => meal.includes(food));
    
    if (matchedSugar.length > 0) {
      results.push({
        type: 'sugar_impact',
        confidence: 0.9,
        message: `摄入${matchedSugar.join('、')}等含糖食物导致血糖快速升高至${value}mmol/L`,
        advice: '以后避免空腹或餐后立即食用高糖食物，可选择在运动前适量摄入'
      });
    }

    return results;
  },

  // 个性化规则库
  personalizedRules: {
    "PR01": {
      condition: "餐后峰值>9.0且摄入白米/白面",
      recommendation: "将主食1/3替换为全谷杂豆,餐序蔬菜蛋白→主食,餐后步行20–30分钟",
      evidence: "峰值下降约1–2 mmol/L,达峰延后10–20分钟",
      triggers: ["白米", "白面", "主食", "峰值"]
    },
    "PR02": {
      condition: "早餐后血糖8-9持续>30分钟",
      recommendation: "早餐主食减量20%,添加≥150g非淀粉蔬菜与1份蛋白,避免含糖饮品",
      evidence: "TAR减少10–20分钟",
      triggers: ["早餐", "持续", "超过8", "时间长"]
    },
    "PR03": {
      condition: "晚餐后2小时>8.0",
      recommendation: "分段活动3×10分钟于餐后30/60/90分钟,减少油脂与液体糖,晚餐提前30–60分钟",
      evidence: "餐后面积AUC下降",
      triggers: ["晚餐", "2小时", "超过8", "晚上"]
    },
    "PR04": {
      condition: "高平台不回落≥3小时",
      recommendation: "控制混合餐油脂,奶茶甜饮替换为无糖,步行或家务分段30分钟",
      evidence: "平台缩短30–60分钟",
      triggers: ["高平台", "不回落", "3小时", "维持"]
    },
    "PR05": {
      condition: "夜间上扬且有夜宵",
      recommendation: "夜宵改高蛋白低GI小份(酸奶鸡蛋坚果少量),晚间散步15–20分钟",
      evidence: "夜间上扬幅度下降0.5–1.0 mmol/L",
      triggers: ["夜间", "上扬", "夜宵", "清晨"]
    },
    "PR06": {
      condition: "运动后反跳且高强度",
      recommendation: "将强度调至中等(RPE12–13),运动前后各补低GI碳水15–20g+蛋白",
      evidence: "反跳幅度减少",
      triggers: ["运动", "反跳", "高强度", "反弹"]
    },
    "PR07": {
      condition: "高GI主食且主食优先进食",
      recommendation: "改为蔬菜蛋白→主食顺序,主食细嚼慢咽>15分钟",
      evidence: "峰值下降约0.5–1.5 mmol/L",
      triggers: ["高GI", "主食优先", "精制", "顺序"]
    },
    "PR09": {
      condition: "稀粥类早餐且峰值>9.0",
      recommendation: "以燕麦杂豆粥替换白米粥,增加蛋白质配菜,餐后散步20–30分钟",
      evidence: "峰值降低1–2 mmol/L",
      triggers: ["稀粥", "白米粥", "早餐", "峰值高"]
    }
  },

  // 生活方式实验库
  lifestyleExperiments: {
    "EX01": {
      title: "早餐主食替换:白米粥vs燕麦杂豆粥",
      duration: "6天",
      steps: "第一阶段3天白米粥200ml,第二阶段3天燕麦杂豆粥200ml,两阶段均餐后步行20–30分钟",
      metrics: "记录30,60,120分钟血糖、峰值与达峰时间",
      tip: "若差异≥1.0 mmol/L优先低峰方案"
    },
    "EX02": {
      title: "进餐顺序对比:主食优先vs蔬菜蛋白优先", 
      duration: "2天",
      steps: "Day1主食优先，Day2蔬菜蛋白→主食",
      metrics: "30,60,120分钟血糖、主观饱腹感评分",
      tip: "若蔬菜蛋白优先方案峰值下降≥1.0 mmol/L则固定该顺序"
    },
    "EX03": {
      title: "餐后活动时机:饭后立即vs30分钟后",
      duration: "2天", 
      steps: "Day1饭后立即步行20分钟，Day2饭后30分钟开始步行20分钟",
      metrics: "30,60,120分钟血糖、步行感受与RPE",
      tip: "选择TAR更少且主观可持续性更好的时机"
    }
  },

  // 智能匹配个性化规则
  matchPersonalizedRules: (userInfo) => {
    const { value, timeType, mealInfo, timeAfterMeal, activityInfo } = userInfo;
    const matchedRules = [];
    
    const userText = `${timeType} ${mealInfo} ${activityInfo}`.toLowerCase();

    for (const [ruleId, rule] of Object.entries(professionalKnowledgeBase.personalizedRules)) {
      let matchScore = 0;
      
      // 检查触发词匹配
      const matchedTriggers = rule.triggers.filter(trigger => 
        userText.includes(trigger.toLowerCase())
      );
      
      if (matchedTriggers.length > 0) {
        matchScore = matchedTriggers.length / rule.triggers.length;
        
        // 数值条件检查
        let valueMatch = false;
        const safeTimeType = timeType || '';
        if (ruleId === 'PR01' && value > 9.0) valueMatch = true;
        if (ruleId === 'PR02' && safeTimeType.includes('早餐') && value > 8.0) valueMatch = true;
        if (ruleId === 'PR03' && safeTimeType.includes('晚餐') && timeAfterMeal >= 2 && value > 8.0) valueMatch = true;
        if (ruleId === 'PR09' && value > 9.0) valueMatch = true;
        
        if (valueMatch || matchScore > 0.4) {
          matchedRules.push({
            ruleId,
            confidence: valueMatch ? Math.max(matchScore, 0.8) : matchScore,
            recommendation: rule.recommendation,
            evidence: rule.evidence,
            condition: rule.condition
          });
        }
      }
    }

    return matchedRules.sort((a, b) => b.confidence - a.confidence);
  },

  // 生成精准个性化建议
  generatePersonalizedAdvice: (analysisResults, personalizedRules) => {
    let response = "";
    
    // 优先使用个性化规则
    if (personalizedRules && personalizedRules.length > 0) {
      const topRule = personalizedRules[0];
      response = `根据您的具体情况（${topRule.condition}），建议：${topRule.recommendation}`;
      
      if (topRule.evidence) {
        response += `\n\n预期效果：${topRule.evidence}`;
      }
      
      return response;
    }
    
    // 降级到通用分析
    if (!analysisResults || analysisResults.length === 0) {
      return "请提供更多具体信息，以便进行准确分析。";
    }

    const topResult = analysisResults[0];
    response = topResult.message;
    
    if (topResult.advice) {
      response += `\n\n建议：${topResult.advice}`;
    }

    if (topResult.causes && topResult.causes.length > 0) {
      response += `\n\n可能原因：${topResult.causes.join('、')}`;
    }

    return response;
  },

  // 建议生活方式实验
  suggestExperiment: (userInfo) => {
    const { mealInfo, pattern } = userInfo;
    const meal = mealInfo?.toLowerCase() || '';
    
    if (meal.includes('粥') || meal.includes('早餐')) {
      return professionalKnowledgeBase.lifestyleExperiments['EX01'];
    }
    
    if (meal.includes('主食') || pattern?.includes('高峰')) {
      return professionalKnowledgeBase.lifestyleExperiments['EX02'];
    }
    
    if (pattern?.includes('平台') || meal.includes('晚餐')) {
      return professionalKnowledgeBase.lifestyleExperiments['EX03'];
    }
    
    return null;
  }
};

module.exports = professionalKnowledgeBase;