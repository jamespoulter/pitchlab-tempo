"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";

interface AddTestimonialModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSave?: (testimonial: any) => void;
}

export function AddTestimonialModal({
  open,
  onOpenChange,
  onSave,
}: AddTestimonialModalProps) {
  const [clientName, setClientName] = useState("");
  const [clientTitle, setClientTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [quote, setQuote] = useState("");
  const [rating, setRating] = useState(5);
  const [projectType, setProjectType] = useState("");
  const [avatar, setAvatar] = useState("");
  const [featured, setFeatured] = useState(false);

  const handleSave = () => {
    const date = new Date().toISOString().split("T")[0];
    const newTestimonial = {
      clientName,
      clientTitle,
      companyName,
      quote,
      rating,
      date,
      projectType,
      avatar:
        avatar ||
        `https://api.dicebear.com/7.x/avataaars/svg?seed=${clientName}`,
      featured,
    };

    if (onSave) {
      onSave(newTestimonial);
    }

    // Reset form
    setClientName("");
    setClientTitle("");
    setCompanyName("");
    setQuote("");
    setRating(5);
    setProjectType("");
    setAvatar("");
    setFeatured(false);

    if (onOpenChange) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Testimonial</DialogTitle>
          <DialogDescription>
            Add a new client testimonial to showcase in your proposals.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="clientName">Client Name</Label>
              <Input
                id="clientName"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="John Smith"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientTitle">Client Title</Label>
              <Input
                id="clientTitle"
                value={clientTitle}
                onChange={(e) => setClientTitle(e.target.value)}
                placeholder="CEO"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Acme Inc."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="projectType">Project Type</Label>
              <Input
                id="projectType"
                value={projectType}
                onChange={(e) => setProjectType(e.target.value)}
                placeholder="Website Redesign"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="quote">Testimonial Quote</Label>
            <Textarea
              id="quote"
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              placeholder="What the client said about your work..."
              rows={4}
            />
          </div>
          <div className="space-y-2">
            <Label>Rating</Label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`h-6 w-6 ${star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                  />
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="avatar">Client Avatar URL (optional)</Label>
            <Input
              id="avatar"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              placeholder="https://example.com/avatar.jpg"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Leave blank to generate an avatar automatically
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="featured"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <Label htmlFor="featured" className="text-sm font-medium">
              Feature this testimonial
            </Label>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange && onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Testimonial</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
