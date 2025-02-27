'use client';

// context/ProjectContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { ProjectListResponseInterface } from './../definitions';

// Define the shape of the context
interface ProjectContextType {
  projects: ProjectListResponseInterface[];
  setProjects: React.Dispatch<
    React.SetStateAction<ProjectListResponseInterface[]>
  >;
  itemSelectedRows: string[];
  setItemSelectedRows: React.Dispatch<React.SetStateAction<string[]>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  resetRowsState: () => void;
}

// Create the context
const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

// Custom hook to use the ProjectContext
export const useProjectContext = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error(
      'useProjectContext must be used within a ProjectContext Provider'
    );
  }
  return context;
};

// Provider component
export const ProjectProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [projects, setProjects] = useState<ProjectListResponseInterface[]>([]);
  const [itemSelectedRows, setItemSelectedRows] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const resetRowsState = () => {
    setItemSelectedRows([]);
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        setProjects,
        loading,
        setLoading,
        itemSelectedRows,
        setItemSelectedRows,
        resetRowsState,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};
