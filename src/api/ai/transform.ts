import { Message } from "@/domain";
import { AIResponseDto } from "./dto";

export const chatResponseDtoToMessage = (data: AIResponseDto): Message => {
    return data.response as Message;
};
