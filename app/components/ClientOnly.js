"use client";
/**
 * Hack to work around next.js hydration
 * @see https://github.com/uidotdev/usehooks/issues/218
 */
import React from 'react';
import { useIsClient } from "@uidotdev/usehooks"


export const ClientOnly = ({ children }) => {
  const isClient = useIsClient();

  return isClient ? <>{children}</> : null;
};