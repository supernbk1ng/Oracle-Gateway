
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

  const baseInstruction = path === 'TAOIST' 
    ? "你是一位精通《易经》的古代道家圣贤。请针对用户的问题及起卦生成的卦象提供深刻的精神指导。必须包含对应的卦名（中英文）以及卦象符号（hexagramSymbol，如 ䷀, ䷁ 等）。特别地，请提供该卦六爻的每一爻详细解析（lineInterpretations，共6条，从初爻到上爻）。请全程使用中文回答。"
    : "你是一位神秘的塔罗牌占卜师。请针对用户的问题及抽取的牌组（按过去-现在-未来的顺序），提供洞察。特别地，请针对这三张牌分别提供在该问题情境下的详细解析（cardInterpretations，共3条，分别对应过去、现在、未来）。请全程使用中文回答。";

  const jsonStructure = JSON.stringify({
    title: "占卜结果的主标题（如卦名或核心启示）",
    subtitle: "副标题",
    interpretation: "详细的总体解读内容",
    successRate: "0-100的胜算或成功率 (number)",
    energyAlign: "0-100的能量契合度 (number)",
    hexagramSymbol: "对应的易经卦象符号（仅限道家路径）",
    element: "卦象所属五行 (Metal/Wood/Water/Fire/Earth) (仅限道家路径，根据卦象判断)",
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
      energyAlign: 0
    };
  }
};
