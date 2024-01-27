import Modal from "@/components/modal/Modal";
import { useState } from "react";

export function useModal() {
  const [isOpen, setIsOpen] = useState(false);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return {
    Modal,
    isOpen,
    openModal,
    closeModal,
  };
} 