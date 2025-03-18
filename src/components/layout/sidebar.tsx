"use client";

import React, { useState, useEffect, useRef } from 'react';
import { cn } from "@/lib/utils";
import { useDocumentStore } from "@/store/document-store";
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd';
import { motion } from "framer-motion";
import { useTheme } from "@/components/theme-provider";

import { AddItemModal } from '../sidebar/AddItemModal';
import { SidebarHeader } from '../sidebar/SidebarHeader';
import { SearchBar } from '../sidebar/SearchBar';
import { QuickActions } from '../sidebar/QuickActions';
import { TabNavigation } from '../sidebar/TabNavigation';
import { SidebarFooter } from '../sidebar/SidebarFooter';
import { CollapsedSidebar } from '../sidebar/CollapsedSidebar';
import { DocumentList } from '../sidebar/DocumentList';

import { ViewMode } from '../sidebar/types';

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export function Sidebar({ isCollapsed, onToggleCollapse }: SidebarProps) {
  const { documents, activeDocumentId, deleteDocument, setActiveDocumentId, updateDocumentsOrder, createDocument, renameDocument, exportMarkdown } = useDocumentStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [collapsed, setCollapsed] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedTab, setSelectedTab] = useState(0);
  const [sidebarWidth, setSidebarWidth] = useState(280);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  
  const resizeRef = useRef<HTMLDivElement>(null);
  const [isResizing, setIsResizing] = useState(false);
  
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  useEffect(() => {
    const checkMobileView = () => {
      setIsMobileView(window.innerWidth < 1024);
    };

    checkMobileView();
    window.addEventListener('resize', checkMobileView);
    return () => window.removeEventListener('resize', checkMobileView);
  }, []);

  useEffect(() => {
    const savedFavorites = localStorage.getItem('md-preview-favorites');
    const savedCollapsed = localStorage.getItem('md-preview-sidebar-collapsed');
    const savedWidth = localStorage.getItem('md-preview-sidebar-width');
    const savedViewMode = localStorage.getItem('md-preview-view-mode');
    
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
    if (savedCollapsed) {
      setCollapsed(JSON.parse(savedCollapsed));
    }
    if (savedWidth) {
      setSidebarWidth(JSON.parse(savedWidth));
    }
    if (savedViewMode) {
      setViewMode(savedViewMode as ViewMode);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('md-preview-favorites', JSON.stringify(favorites));
  }, [favorites]);
  
  useEffect(() => {
    localStorage.setItem('md-preview-sidebar-collapsed', JSON.stringify(collapsed));
  }, [collapsed]);
  
  useEffect(() => {
    localStorage.setItem('md-preview-sidebar-width', JSON.stringify(sidebarWidth));
  }, [sidebarWidth]);
  
  useEffect(() => {
    localStorage.setItem('md-preview-view-mode', viewMode);
  }, [viewMode]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const newWidth = e.clientX;
      if (newWidth >= 280 && newWidth <= 400) {
        setSidebarWidth(newWidth);
      }
    };
    
    const handleMouseUp = () => {
      setIsResizing(false);
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  const handleResizeStart = (e: React.MouseEvent) => {
    setIsResizing(true);
    document.body.style.cursor = 'ew-resize';
    document.body.style.userSelect = 'none';
    e.preventDefault();
  };

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(favId => favId !== id) 
        : [...prev, id]
    );
  };

  const filteredDocuments = documents.filter(doc => 
    doc.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const recentDocuments = [...documents]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 3);

  const favoriteDocuments = documents.filter(doc => favorites.includes(doc.id));

  const formatDate = (date: Date) => {
    const now = new Date();
    const docDate = new Date(date);
    
    if (docDate.toDateString() === now.toDateString()) {
      return `Today at ${docDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
    }
    
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    if (docDate.toDateString() === yesterday.toDateString()) {
      return `Yesterday at ${docDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
    }
    
    return docDate.toLocaleDateString([], {month: 'short', day: 'numeric'});
  };
  
  const getTabContent = () => {
    switch (selectedTab) {
      case 0:
        return filteredDocuments;
      case 1:
        return favoriteDocuments;
      case 2:
        return recentDocuments;
      default:
        return filteredDocuments;
    }
  };

  const handleAddItem = () => {
    setIsModalOpen(false);
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination } = result;
    
    if (destination.droppableId === source.droppableId) {
        const newDocs = Array.from(documents);
        const [removed] = newDocs.splice(source.index, 1);
        newDocs.splice(destination.index, 0, removed);
        updateDocumentsOrder(newDocs);
    }
  };

  if (collapsed) {
    return (
      <CollapsedSidebar
        setCollapsed={setCollapsed}
        createDocument={createDocument}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
      />
    );
  }

  return (
    <>
      <motion.div 
        className={cn(
          "h-full border-r transition-all duration-300",
          "fixed lg:relative inset-y-0 left-0 z-50",
          "w-[280px] lg:w-auto",
          isDarkMode ? "border-gray-800 bg-gray-900" : "border-gray-200 bg-white",
          isCollapsed ? "-translate-x-full lg:translate-x-0" : "translate-x-0"
        )}
        style={{ width: !isMobileView ? sidebarWidth : undefined }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <SidebarHeader
          documentsCount={documents.length}
          viewMode={viewMode}
          setViewMode={setViewMode}
          setCollapsed={setCollapsed}
          createDocument={createDocument}
        />

        <DragDropContext
          onDragStart={(start) => {
            document.body.style.cursor = 'grabbing';
            const draggedElement = document.querySelector(`[data-rbd-draggable-id="${start.draggableId}"]`);
            if (draggedElement) {
              draggedElement.classList.add('dragging');
            }
          }}
          onDragEnd={(result) => {
            document.body.style.cursor = 'default';
            const draggedElement = document.querySelector(`[data-rbd-draggable-id="${result.draggableId}"]`);
            if (draggedElement) {
              draggedElement.classList.remove('dragging');
            }
            handleDragEnd(result);
          }}
        >
          <div className="flex-1 overflow-y-auto">
            <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            <QuickActions createDocument={createDocument} />
            <TabNavigation selectedTab={selectedTab} setSelectedTab={setSelectedTab} />

            <Droppable droppableId="main">
              {(dropProvided, dropSnapshot) => (
                <div 
                  ref={dropProvided.innerRef}
                  {...dropProvided.droppableProps}
                  className={cn(
                    "min-h-[100px] rounded-lg transition-colors p-2",
                    dropSnapshot.isDraggingOver && (isDarkMode ? 'bg-blue-900/20 border border-blue-500/20' : 'bg-blue-50/80 border border-blue-200/20')
                  )}
                >
                  <DocumentList
                    documents={getTabContent()}
                    viewMode={viewMode}
                    activeDocumentId={activeDocumentId}
                    favorites={favorites}
                    isDraggingOver={dropSnapshot.isDraggingOver}
                    isDarkMode={isDarkMode}
                    formatDate={formatDate}
                    toggleFavorite={toggleFavorite}
                    setActiveDocumentId={setActiveDocumentId}
                    deleteDocument={deleteDocument}
                    renameDocument={renameDocument}
                    exportMarkdown={exportMarkdown}
                  />
                  {dropProvided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        </DragDropContext>

        <SidebarFooter />

        <div 
          ref={resizeRef}
          className={`absolute right-0 top-0 bottom-0 w-1 cursor-ew-resize ${
            isDarkMode ? 'hover:bg-blue-500/50' : 'hover:bg-blue-500/30'
          }`}
          onMouseDown={handleResizeStart}
        />
      </motion.div>

      {isModalOpen && (
        <AddItemModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          type="folder"
          onAdd={handleAddItem}
        />
      )}

      {/* Mobile overlay */}
      {isMobileView && !isCollapsed && (
        <motion.div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onToggleCollapse}
        />
      )}
    </>
  );
}