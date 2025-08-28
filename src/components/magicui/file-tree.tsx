"use client";

import { FileIcon, FolderIcon } from "lucide-react";
import React from "react";

// Simple file tree placeholder - focusing on SSR
interface FileTreeProps {
  children: React.ReactNode;
}

export const Tree = ({ children }: FileTreeProps) => (
  <div className="space-y-1">{children}</div>
);

export const Folder = ({ 
  children, 
  element, 
  value 
}: { 
  children: React.ReactNode; 
  element: string;
  value?: string;
}) => (
  <div className="space-y-1">
    <div className="flex items-center space-x-2 p-1">
      <FolderIcon className="h-4 w-4" />
      <span>{element}</span>
    </div>
    <div className="ml-4">{children}</div>
  </div>
);

export const File = ({ 
  children 
}: { 
  children: React.ReactNode; 
}) => (
  <div className="flex items-center space-x-2 p-1 ml-4">
    <FileIcon className="h-4 w-4" />
    {children}
  </div>
);
