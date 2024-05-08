import { personalities, colors, animals } from "@/constants"
import { useEffect, useState } from "react";

function randomPick(array: any) {
  const randomIndex = Math.floor(Math.random() * 10);
  return array[randomIndex]
};

export default function useRandomNameGenerator() {
  const [nickname, setNickname] = useState("");
  
  useEffect(() => {
    const personality = randomPick(personalities);
    const color = randomPick(colors);
    const animal = randomPick(animals);
    setNickname(`${personality} ${color} ${animal}`)
  }, []);

  return nickname
};
