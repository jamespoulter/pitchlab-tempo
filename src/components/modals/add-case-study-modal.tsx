"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X } from "lucide-react";

interface AddCaseStudyModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSave?: (caseStudy: any) => void;
}

export function AddCaseStudyModal({
  open,
  onOpenChange,
  onSave,
}: AddCaseStudyModalProps) {
  const [title, setTitle] = useState("");
  const [client, setClient] = useState("");
  const [industry, setIndustry] = useState("");
  const [date, setDate] = useState("");
  const [image, setImage] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [challenge, setChallenge] = useState("");
  const [solution, setSolution] = useState("");
  const [results, setResults] = useState("");

  const addTag = () => {
    if (newTag.trim()) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    const newCaseStudy = {
      title,
      client,
      industry,
      date: date || new Date().toISOString().split("T")[0],
      image:
        image ||
        "https://images.unsplash.com/photo-1523381294911-8d3cead13475?w=800&q=80",
      tags,
      challenge,
      solution,
      results,
    };
    
    if (onSave) {
      onSave(newCaseStudy);
    }
    
    if (onOpenChange) {
      onOpenChange(false);
    }
  };

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-[600px] max-h-[90vh] overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Add Case Study</h2>
          <button 
            onClick={() => onOpenChange && onOpenChange(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <p className="text-sm text-gray-500 mb-4">
          Add a new case study to showcase your agency's successful client projects.
        </p>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Case Study Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="E-commerce Redesign Boosts Conversion by 45%"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="client">Client</Label>
              <Input
                id="client"
                value={client}
                onChange={(e) => setClient(e.target.value)}
                placeholder="Fashion Retailer"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Input
                id="industry"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                placeholder="E-commerce"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Completion Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Featured Image URL</Label>
              <Input
                id="image"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag, index) => (
                <div
                  key={index}
                  className="flex items-center bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-sm"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(index)}
                    className="ml-1 text-blue-500 hover:text-blue-700"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add tag (e.g., Web Design)"
                className="flex-1"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTag();
                  }
                }}
              />
              <Button
                type="button"
                onClick={addTag}
                size="sm"
                className="flex items-center"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="challenge">Challenge</Label>
            <Textarea
              id="challenge"
              value={challenge}
              onChange={(e) => setChallenge(e.target.value)}
              placeholder="Describe the client's challenge or problem..."
              className="min-h-[80px]"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="solution">Solution</Label>
            <Textarea
              id="solution"
              value={solution}
              onChange={(e) => setSolution(e.target.value)}
              placeholder="Explain your approach and solution..."
              className="min-h-[80px]"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="results">Results</Label>
            <Textarea
              id="results"
              value={results}
              onChange={(e) => setResults(e.target.value)}
              placeholder="Describe the measurable outcomes and results..."
              className="min-h-[80px]"
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange && onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Case Study</Button>
        </div>
      </div>
    </div>
  );
}
