import celebrateImage from "../assets/panda-moods/Celebration.png";
import happyImage from "../assets/panda-moods/Happy.png";
import idleImage from "../assets/panda-moods/Idle.png";
import powerUpImage from "../assets/panda-moods/Level_up.png";
import sleepyImage from "../assets/panda-moods/Sleepy.png";

export const fallbackPandaMoodImage = idleImage;

export const pandaMoodImages = {
  idle: idleImage,
  happy: happyImage,
  sleepy: sleepyImage,
  focused: powerUpImage,
  celebrating: celebrateImage,
  levelUp: powerUpImage,
};

export function getPandaMoodImage(mood) {
  return pandaMoodImages[mood] || fallbackPandaMoodImage;
}

export const pandaMoods = {
  idle: {
    label: "Cozy",
    face: "panda",
    image: pandaMoodImages.idle,
    message: "Small steps still count.",
    animation: "animate-panda-idle",
  },
  happy: {
    label: "Happy",
    face: "happy",
    image: pandaMoodImages.happy,
    message: "Your panda is cheering for you.",
    animation: "animate-panda-happy",
  },
  sleepy: {
    label: "Sleepy",
    face: "sleepy",
    image: pandaMoodImages.sleepy,
    message: "Your panda is resting today. Tomorrow is a fresh bamboo day.",
    animation: "animate-panda-sleepy",
  },
  focused: {
    label: "Focused",
    face: "focused",
    image: pandaMoodImages.focused,
    message: "One gentle focus session at a time.",
    animation: "animate-panda-focused",
  },
  celebrating: {
    label: "Celebrating",
    face: "celebrating",
    image: pandaMoodImages.celebrating,
    message: "A cozy win has been added to your day.",
    animation: "animate-panda-celebrating",
  },
  levelUp: {
    label: "Level up",
    face: "level up",
    image: pandaMoodImages.levelUp,
    message: "Your panda grew from your care and consistency.",
    animation: "animate-panda-level",
  },
};
