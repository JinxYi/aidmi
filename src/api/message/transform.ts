import { Consultation, Message, Patient } from "@/domain";
import { AIMessageDto } from "../ai/dto";

export const transformMessageDto = (
    consult: Consultation,
    patient: Patient,
    withMetaData: boolean,
): [AIMessageDto, number?] | null => {

    const messages: Message[] = consult.messages;
    if (!withMetaData) {
        const newChat = messages.map((message) => ({
            role: message.role,
            content: message.content,
        }));
        return [{
            user_data: patient,
            messages: newChat as Message[],
        }, consult?.id];
    }
    return [{
        user_data: patient,
        messages: messages as Message[],
    }, consult?.id];
};
