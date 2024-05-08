import { personalities, colors, animals } from "@/constants"

function randomPick(array: any) {
  const randomIndex = Math.floor(Math.random() * 10);
  return array[randomIndex]
};

export default function useRandomNameGenerator() {
    const personality = randomPick(personalities);
    const color = randomPick(colors);
    const animal = randomPick(animals);

  return `${personality} ${color} ${animal}`
};
