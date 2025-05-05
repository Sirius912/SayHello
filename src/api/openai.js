import OpenAI from "openai";
import { OPENAI_API_KEY } from '@env';

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

const promptMap = {
  '재해': '지진 이후 할아버지와 할머니께 보내는 따뜻한 안부 메시지를 작성해 주세요.',
  '날씨 보고': '오늘의 날씨를 반영한 할머니, 할아버지께 보내는 안부 메시지를 작성해 주세요.',
  '미세먼지': '미세먼지가 나쁨인 날 할아버지, 할머니께 보내는 건강 걱정 안부 메시지를 작성해 주세요.',
  '없음': '특별한 소식 없이 할아버지, 할머니께 보내는 일반적인 안부 메시지를 작성해 주세요.'
};

export async function fetchOpenAIMessage(category) {
  const prompt = promptMap[category] || "따뜻한 안부 메시지를 작성해 주세요.";

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      { role: "system", content: "당신은 따뜻하고 친절한 할머니, 할아버지께 보내는 안부 메시지 작성자입니다." },
      { role: "user", content: prompt }
    ],
    max_tokens: 150,
    temperature: 0.7
  });

  if (completion.choices && completion.choices.length > 0) {
    return completion.choices[0].message.content.trim();
  } else {
    throw new Error('OpenAI 응답이 없습니다.');
  }
}
