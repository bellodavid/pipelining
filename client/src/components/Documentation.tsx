import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { School, FileText, Book, PresentationIcon, ClipboardCheck, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function Documentation() {
  const [activeTab, setActiveTab] = useState('conceptual-model');
  const [markdownContent, setMarkdownContent] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({
    'conceptual-model': false,
    'project-report': false,
    'validation-analysis': false,
    'presentation': false
  });
  
  // Map of tab IDs to their metadata
  const tabContent = {
    'conceptual-model': {
      title: 'Conceptual Model',
      icon: <Book className="h-4 w-4 mr-2" />,
      filename: 'conceptual_model.md'
    },
    'project-report': {
      title: 'Project Report',
      icon: <FileText className="h-4 w-4 mr-2" />,
      filename: 'project_report.md'
    },
    'validation-analysis': {
      title: 'Validation Analysis',
      icon: <ClipboardCheck className="h-4 w-4 mr-2" />,
      filename: 'validation_analysis.md'
    },
    'presentation': {
      title: 'Presentation Outline',
      icon: <PresentationIcon className="h-4 w-4 mr-2" />,
      filename: 'presentation_outline.md'
    }
  };
  
  // Fetch markdown content when tab changes
  useEffect(() => {
    async function fetchMarkdown(tabId: string) {
      if (markdownContent[tabId]) return; // Already loaded
      
      setLoading(prev => ({ ...prev, [tabId]: true }));
      try {
        const filename = tabContent[tabId as keyof typeof tabContent].filename;
        const response = await fetch(`/docs/${filename}`);
        const text = await response.text();
        setMarkdownContent(prev => ({ ...prev, [tabId]: text }));
      } catch (error) {
        console.error(`Error loading ${tabId} documentation:`, error);
        setMarkdownContent(prev => ({ 
          ...prev, 
          [tabId]: "Error loading documentation. Please try again later."
        }));
      } finally {
        setLoading(prev => ({ ...prev, [tabId]: false }));
      }
    }
    
    fetchMarkdown(activeTab);
  }, [activeTab, markdownContent]);

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="flex flex-col md:flex-row items-center justify-between mb-6">
        <div className="flex items-center mb-4 md:mb-0">
          <School className="h-8 w-8 text-blue-700 mr-3" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Project Documentation</h1>
            <p className="text-gray-600">Federal University of Technology, Minna - Group 2</p>
          </div>
        </div>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>CPU Pipeline Simulator Documentation</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="conceptual-model" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4 flex flex-wrap">
              {Object.entries(tabContent).map(([id, { title, icon }]) => (
                <TabsTrigger key={id} value={id} className="flex items-center">
                  {icon}
                  {title}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {Object.entries(tabContent).map(([id, { title }]) => (
              <TabsContent key={id} value={id} className="prose max-w-none">
                <div className="markdown-content p-4 bg-white rounded-lg">
                  {loading[id] ? (
                    <div className="flex items-center justify-center py-10">
                      <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                      <span className="ml-2">Loading documentation...</span>
                    </div>
                  ) : (
                    <ReactMarkdown>{markdownContent[id] || 'Loading...'}</ReactMarkdown>
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
