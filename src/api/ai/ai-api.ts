import { Message } from "@/domain";
import { client } from "../fetch-client";
import { AIMessageDto, AIResponseDto, ConsultationSummaryInterface } from "./dto";
import { chatResponseDtoToMessage } from "./transform";
export const AIApi = {
  async getAiResponse(
    message: AIMessageDto,
  ): Promise<Message> {
    const controller = new AbortController();
    const timeout = 5 * 60 * 1000; // fetch timeout is 5 min
    const fetchTimeout = setTimeout(() => controller.abort(), timeout);

    message.user_data.username = "testuser";
    try {
      const responseJson = JSON.stringify(message);
      const requestOptions = {
        method: "POST",
        body: responseJson,
        redirect: "follow",
        signal: controller.signal,
      };

      const httpResponse = await client("chat/", {
        ...requestOptions,
      });
      const responseData = await httpResponse.json() as AIResponseDto;
      const response = chatResponseDtoToMessage(responseData);
      if (!response) {
        throw new Error("Could not get response from chat service");
      }
      return response;
    } finally {
      clearTimeout(fetchTimeout);
    }
  },
  async getConsultationSummary(
    response: { consult_id: number },
  ): Promise<ConsultationSummaryInterface> {
    const controller = new AbortController();
    const timeout = 20 * 60 * 1000; // fetch timeout is 20 min
    const fetchTimeout = setTimeout(() => controller.abort(), timeout);

    try {
      const responseJson = JSON.stringify(response);
      const requestOptions = {
        method: "POST",
        body: responseJson,
        signal: controller.signal,
      };
      const httpResponse = await client(
        "chat/summarize/",
        requestOptions,
      );
      const responseData = await httpResponse
        .json() as ConsultationSummaryInterface;
      if (!responseData) {
        throw new Error("Invalid response from AI service");
      }
      return responseData;
    } catch (error) {
      console.error("Error sending response to AI service:", error);
      throw error;
    } finally {
      clearTimeout(fetchTimeout);
    }
  },
};
