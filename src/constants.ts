import { MessageMetaData } from "./domain";

export const initialAIMessage: string = `Hello, and welcome! I'm AidMi, an AI assistant designed to listen to your story and help gather important information. I want to assure you that everything you share here is confidential and will be reviewed by a human mental health professional for further assessment and guidance. My main purpose is to extract relevant details from your story to provide to the mental health professional, ensuring they have a comprehensive understanding of your situation before your consultation. This helps make the most of your time together.

Before we begin, I want to emphasize that this is a safe space. You can share as much or as little as you're comfortable with, and there's no rush. Your privacy is our priority.

To start, I'd like to know a bit more about how you've been feeling lately. Are there any specific concerns or symptoms that have been on your mind? How are you feeling today?`;


export const initialMessageMetaData: MessageMetaData = {
    current_stage: "MAIN_COMPLAINT",
    fulfilled_requirements: [],
    unfulfilled_requirements: [
      "physical_symptoms",
      "mood_changes",
      "thought_disturbances",
      "behavioral_changes",
      "cognitive_issues",
    ],
    move_next_stage: false,
    stage_attempts: 1,
  };