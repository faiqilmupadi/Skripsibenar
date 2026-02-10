"use client";
import { useState } from "react";
export const useDisclosure = () => { const [open, setOpen] = useState(false); return { open, onOpen: () => setOpen(true), onClose: () => setOpen(false) }; };
