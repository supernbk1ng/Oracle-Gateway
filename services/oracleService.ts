
import { DivinationResult, DivinationPath } from "../types";

// Prefer using the secure API route in production, or if explicitly configured.
// Fallback to direct client-side call ONLY in dev mode with local env var.
const IS_PROD = import.meta.env.PROD;
const LOCAL_API_KEY = import.meta.env.VITE_ZHIPU_API_KEY || "";
const API_ROUTE = "/api/oracle";
const DIRECT_API_URL = "https://open.bigmodel.cn/api/paas/v4/chat/completions";

export const fetchOracleGuidance = async (
  question: string,
  path: DivinationPath,
  drawInfo: string | string[]
): Promise<DivinationResult> => {
  
  // Determine execution mode
  const useServerless = IS_PROD || !LOCAL_API_KEY;

  if (!useServerless && !LOCAL_API_KEY) {
     console.error("Configuration Error: Missing API Key");
     return {
       title: "密钥缺失",
       interpretation: "未检测到API密钥配置，请检查环境变量。",
       successRate: 0,
       energyAlign: 0
     };
  }

  const interactionContext = Array.isArray(drawInfo) 
    ? `抽取的牌组: ${drawInfo.join(', ')}`
    : `生成的卦象描述: ${drawInfo}`;

  const baseInstruction = `
  1. 系统角色设定 (System Role)
  Role: 你是《万象之镜》背后的灵魂，名为“时空观测官”。你不仅精通东方《易经》的变易之道与西方塔罗的神秘学原型，你更是“用户在 2030 年的投影”。
  
  Background: 你正在一处名为“虚空档案馆”的地方，透过破碎的数字镜像观察 2026 年（当前时空）的用户。你的文字不是冰冷的预测，而是跨越因果的低语。
  
  2. 文学风格指南 (Literary Style)
  语调： 疏离、温柔、深邃、富有禅意。
  
  修辞建议： 
  - 多用“浮生”、“刹那”、“镜像”、“因果”、“频率”、“坍缩”等词汇。
  - 句子结构采用中长句与短句交错，模拟古书的节奏感。
  - 杜绝任何机器人常用语（如“作为AI助手”、“根据结果显示”、“建议你...”）。
  
  禁令： 严禁给出具体的法律、医疗或财务建议，必须将一切转化为人生的智慧隐喻。
  
  3. 多维解析指令 (Multidimensional Logic)
  ${path === 'TAOIST' 
    ? `当接收到 [道家起卦] 数据时：
       - 不要复读卦辞，要拆解卦象中的“势”。例如，若是《乾》卦，谈论“潜龙”与“数字海洋中的潮汐”；若是《坎》卦，谈论“重重困境中的心流”。
       - 必须包含对应的卦名（中英文）以及卦象符号（hexagramSymbol，如 ䷀, ䷁ 等）。
       - 提供该卦六爻的每一爻详细解析（lineInterpretations，共6条，从初爻到上爻）。`
    : `当接收到 [塔罗三张牌] 数据时：
       - 将三张牌视为一出“三幕剧”。过去是“尘埃的堆叠”，现在是“光影的定格”，未来是“概率的坍缩”。分析牌面之间的色彩、符号与张力的流动。
       - 针对这三张牌分别提供在该问题情境下的详细解析（cardInterpretations，共3条，分别对应过去、现在、未来）。`}
  
  4. 输出要求 (Output Requirement)
  - 回复长度应适当增长，展现文学深度，避免简短干瘪。
  - 请全程使用中文回答。
  `;

  const jsonStructure = JSON.stringify({
    title: "占卜结果的主标题（如卦名或核心启示）",
    subtitle: "副标题",
    interpretation: "详细的总体解读内容",
    successRate: "0-100的胜算或成功率 (number)",
    energyAlign: "0-100的能量契合度 (number)",
    hexagramSymbol: "对应的易经卦象符号（仅限道家路径）",
    element: "卦象所属五行 (Metal/Wood/Water/Fire/Earth) (仅限道家路径，根据卦象判断)",
    fateQuote: "最具哲理的一句话，浓缩占卜结果的精髓 (string)",
    cards: ["抽出的塔罗牌名（仅限塔罗路径）"],
    lineInterpretations: ["易经六爻的每一爻详细解析，从初爻到上爻（仅限道家路径，共6项）"],
    cardInterpretations: ["三张塔罗牌分别对应的详细解析（仅限塔罗路径，共3项，顺序为：过去、现在、未来）"]
  }, null, 2);

  const systemInstruction = `${baseInstruction}\n\n请务必严格按照以下JSON格式返回结果，不要包含任何markdown格式标记（如 \`\`\`json ... \`\`\`），只返回纯JSON字符串：\n${jsonStructure}`;

  const payload = {
    model: 'glm-4-flash',
    messages: [
      { role: 'system', content: systemInstruction },
      { role: 'user', content: `用户问题: "${question}"\n${interactionContext}\n请进行占卜并给出指引。` }
    ],
    temperature: 0.7,
    top_p: 0.95,
    max_tokens: 4096,
    stream: false
  };

  try {
    let response;
    
    if (useServerless) {
      // Call Vercel Serverless Function
      response = await fetch(API_ROUTE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } else {
      // Direct call (Dev mode only)
      response = await fetch(DIRECT_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${LOCAL_API_KEY}`
        },
        body: JSON.stringify(payload)
      });
    }

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`API request failed: ${response.status} ${errText}`);
    }

    const data = await response.json();
    let content = data.choices?.[0]?.message?.content || "{}";
    
    // Clean up potential markdown code blocks
    content = content.replace(/```json\s*/g, "").replace(/```\s*$/g, "").trim();

    const result = JSON.parse(content);

    // Ensure cards are consistent with user draw in Tarot mode
    // This prevents mismatches between drawn cards and AI response
    if (path === 'TAROT' && Array.isArray(drawInfo)) {
      result.cards = drawInfo;
    }

    // Ensure numeric values to prevent UI crashes
    result.successRate = Number(result.successRate) || 0;
    result.energyAlign = Number(result.energyAlign) || 0;

    return result;
  } catch (error) {
    console.error("Oracle Service Error:", error);
    return {
      title: "天机蒙蔽",
      interpretation: "星象紊乱，因果纠缠。请检查网络连接或API配置后重试。",
      successRate: 0,
      energyAlign: 0,
      element: undefined,
      cards: [],
      lineInterpretations: [],
      cardInterpretations: []
    };
  }
};
