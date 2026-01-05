
import { GoogleGenAI, Modality } from "@google/genai";

/**
 * Service to handle Gemini AI calls.
 * Note: Video generation (Veo) requires a specific flow for API key selection in this environment.
 */
export class GeminiService {
  private static ai: any = null;

  private static getAI() {
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  static async generateGrowthVideo(imageB64: string, onProgress: (msg: string) => void): Promise<{ videoUrl: string, audioUrl?: string }> {
    const ai = this.getAI();

    onProgress("Analyzing crop type...");
    // 1. Identify crop and get description for video prompt
    const analysisResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        {
          parts: [
            { inlineData: { data: imageB64.split(',')[1], mimeType: 'image/jpeg' } },
            { text: "Identify this crop and write a detailed prompt for a growth lifecycle video (seed to harvest) for this specific plant. Return ONLY the prompt text." }
          ]
        }
      ]
    });

    const videoPrompt = analysisResponse.text || "A timelapse video showing the growth lifecycle of a plant from seed to harvest in a vibrant farm setting.";
    
    onProgress("Generating lifecycle video...");
    // 2. Generate Video using Veo
    // In a real scenario, this would poll until 'done'
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: videoPrompt,
      image: {
        imageBytes: imageB64.split(',')[1],
        mimeType: 'image/jpeg'
      },
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: '16:9'
      }
    });

    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 5000));
      operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    const videoUrl = `${downloadLink}&key=${process.env.API_KEY}`;

    onProgress("Synthesizing audio narration...");
    // 3. Optional: Generate Narration (simplified for the demo)
    return { videoUrl };
  }

  static async hasKey() {
    try {
      // @ts-ignore
      return await window.aistudio.hasSelectedApiKey();
    } catch (e) {
      return false;
    }
  }

  static async requestKey() {
    try {
      // @ts-ignore
      await window.aistudio.openSelectKey();
    } catch (e) {
      console.error("Failed to open key selector", e);
    }
  }
}
