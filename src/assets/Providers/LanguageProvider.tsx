"use client";

import React from "react";
import i18next from "../../i18n";
export default function LanguageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div >{children}</div>;
}
