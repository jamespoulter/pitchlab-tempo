"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { X, Plus, Upload, Camera } from "lucide-react";

interface AddTeamMemberModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSave?: (teamMember: any) => void;
}

export function AddTeamMemberModal({
  open,
  onOpenChange,
  onSave,
}: AddTeamMemberModalProps) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [avatar, setAvatar] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // Handle avatar file selection
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
        // Set the avatar state to the preview URL
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addSkill = () => {
    if (newSkill.trim()) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const teamMember = {
      name,
      role,
      email,
      phone,
      bio,
      skills,
      avatar: avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
    };
    
    onSave?.(teamMember);
    
    // Reset form
    setName("");
    setRole("");
    setEmail("");
    setPhone("");
    setBio("");
    setSkills([]);
    setNewSkill("");
    setAvatar("");
    setAvatarFile(null);
    setAvatarPreview(null);
    
    // Close modal
    onOpenChange?.(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">Add Team Member</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange?.(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 rounded-full overflow-hidden mb-4 relative group">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Avatar preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <Camera className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <label htmlFor="modal-avatar-upload" className="cursor-pointer flex flex-col items-center">
                      <Camera className="h-8 w-8 text-white mb-1" />
                      <span className="text-white text-xs">Upload Photo</span>
                    </label>
                    <input
                      id="modal-avatar-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChange}
                    />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground text-center max-w-[200px]">
                  Upload a professional headshot
                </p>
              </div>
            </div>
            
            <div className="md:col-span-2 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Sarah Johnson"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Input
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="Creative Director"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="sarah@example.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bio">Professional Bio</Label>
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Brief professional biography..."
                  rows={4}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Skills & Expertise</Label>
                <div className="flex gap-2">
                  <Input
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Add a skill (e.g., Brand Strategy)"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addSkill();
                      }
                    }}
                  />
                  <Button type="button" onClick={addSkill}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-2">
                  {skills.map((skill, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm"
                    >
                      <span>{skill}</span>
                      <button
                        type="button"
                        onClick={() => removeSkill(index)}
                        className="text-blue-700 hover:text-blue-900 focus:outline-none"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange?.(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!name || !role}>
              Add Team Member
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
