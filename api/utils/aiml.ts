import { OpenAI } from "openai";

import { AIML_API_BASE_URL, AIML_API_KEY } from "./../constants/app";

const aiMlApi = new OpenAI({
  apiKey: AIML_API_KEY,
  baseURL: AIML_API_BASE_URL,
});

export default aiMlApi;
