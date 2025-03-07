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
import { Plus, X, GripVertical, ArrowUp, ArrowDown } from "lucide-react";

interface SectionEditorModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSave?: (section: any) => void;
  initialData?: any;
}

export function SectionEditorModal({
  open,
  onOpenChange,
  onSave,
  initialData,
}: SectionEditorModalProps) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [contentBlocks, setContentBlocks] = useState<any[]>(
    initialData?.contentBlocks || [{ type: "text", value: "" }],
  );

  const addContentBlock = (type: string) => {
    let newBlock;
    switch (type) {
      case "text":
        newBlock = { type: "text", value: "" };
        break;
      case "image":
        newBlock = { type: "image", url: "", caption: "" };
        break;
      case "list":
        newBlock = { type: "list", items: [""] };
        break;
      case "stats":
        newBlock = { type: "stats", items: [{ label: "", value: "" }] };
        break;
      default:
        newBlock = { type: "text", value: "" };
    }
    setContentBlocks([...contentBlocks, newBlock]);
  };

  const removeContentBlock = (index: number) => {
    setContentBlocks(contentBlocks.filter((_, i) => i !== index));
  };

  const moveContentBlock = (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === contentBlocks.length - 1)
    ) {
      return;
    }

    const newBlocks = [...contentBlocks];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    [newBlocks[index], newBlocks[targetIndex]] = [
      newBlocks[targetIndex],
      newBlocks[index],
    ];
    setContentBlocks(newBlocks);
  };

  const updateContentBlock = (index: number, data: any) => {
    const newBlocks = [...contentBlocks];
    newBlocks[index] = { ...newBlocks[index], ...data };
    setContentBlocks(newBlocks);
  };

  const addListItem = (blockIndex: number) => {
    const newBlocks = [...contentBlocks];
    newBlocks[blockIndex].items.push("");
    setContentBlocks(newBlocks);
  };

  const updateListItem = (
    blockIndex: number,
    itemIndex: number,
    value: string,
  ) => {
    const newBlocks = [...contentBlocks];
    newBlocks[blockIndex].items[itemIndex] = value;
    setContentBlocks(newBlocks);
  };

  const removeListItem = (blockIndex: number, itemIndex: number) => {
    const newBlocks = [...contentBlocks];
    newBlocks[blockIndex].items = newBlocks[blockIndex].items.filter(
      (_, i) => i !== itemIndex,
    );
    setContentBlocks(newBlocks);
  };

  const addStatItem = (blockIndex: number) => {
    const newBlocks = [...contentBlocks];
    newBlocks[blockIndex].items.push({ label: "", value: "" });
    setContentBlocks(newBlocks);
  };

  const updateStatItem = (
    blockIndex: number,
    itemIndex: number,
    field: string,
    value: string,
  ) => {
    const newBlocks = [...contentBlocks];
    newBlocks[blockIndex].items[itemIndex][field] = value;
    setContentBlocks(newBlocks);
  };

  const removeStatItem = (blockIndex: number, itemIndex: number) => {
    const newBlocks = [...contentBlocks];
    newBlocks[blockIndex].items = newBlocks[blockIndex].items.filter(
      (_, i) => i !== itemIndex,
    );
    setContentBlocks(newBlocks);
  };

  const handleSave = () => {
    const section = {
      title,
      contentBlocks,
    };

    if (onSave) {
      onSave(section);
    }

    if (onOpenChange) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Proposal Section</DialogTitle>
          <DialogDescription>
            Customize this section of your proposal.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Section Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Introduction, Services, Timeline, etc."
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Content Blocks</Label>
              <div className="flex items-center gap-2">
                <div className="text-xs text-muted-foreground">Add:</div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addContentBlock("text")}
                >
                  Text
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addContentBlock("image")}
                >
                  Image
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addContentBlock("list")}
                >
                  List
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addContentBlock("stats")}
                >
                  Stats
                </Button>
              </div>
            </div>

            {contentBlocks.map((block, blockIndex) => (
              <div
                key={blockIndex}
                className="border rounded-md p-4 space-y-3 relative"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <GripVertical className="h-5 w-5 text-muted-foreground cursor-move" />
                    <span className="font-medium capitalize">
                      {block.type} Block
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => moveContentBlock(blockIndex, "up")}
                      disabled={blockIndex === 0}
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => moveContentBlock(blockIndex, "down")}
                      disabled={blockIndex === contentBlocks.length - 1}
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => removeContentBlock(blockIndex)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {block.type === "text" && (
                  <div className="space-y-2">
                    <Label htmlFor={`text-${blockIndex}`}>Text Content</Label>
                    <Textarea
                      id={`text-${blockIndex}`}
                      value={block.value}
                      onChange={(e) =>
                        updateContentBlock(blockIndex, {
                          value: e.target.value,
                        })
                      }
                      placeholder="Enter text content here..."
                      rows={4}
                    />
                  </div>
                )}

                {block.type === "image" && (
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor={`image-url-${blockIndex}`}>
                        Image URL
                      </Label>
                      <Input
                        id={`image-url-${blockIndex}`}
                        value={block.url}
                        onChange={(e) =>
                          updateContentBlock(blockIndex, {
                            url: e.target.value,
                          })
                        }
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`image-caption-${blockIndex}`}>
                        Caption (optional)
                      </Label>
                      <Input
                        id={`image-caption-${blockIndex}`}
                        value={block.caption}
                        onChange={(e) =>
                          updateContentBlock(blockIndex, {
                            caption: e.target.value,
                          })
                        }
                        placeholder="Image caption"
                      />
                    </div>
                  </div>
                )}

                {block.type === "list" && (
                  <div className="space-y-3">
                    <Label>List Items</Label>
                    {block.items.map((item: string, itemIndex: number) => (
                      <div key={itemIndex} className="flex items-center gap-2">
                        <Input
                          value={item}
                          onChange={(e) =>
                            updateListItem(
                              blockIndex,
                              itemIndex,
                              e.target.value,
                            )
                          }
                          placeholder={`List item ${itemIndex + 1}`}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                          onClick={() => removeListItem(blockIndex, itemIndex)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() => addListItem(blockIndex)}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Item
                    </Button>
                  </div>
                )}

                {block.type === "stats" && (
                  <div className="space-y-3">
                    <Label>Statistics</Label>
                    {block.items.map((item: any, itemIndex: number) => (
                      <div key={itemIndex} className="grid grid-cols-2 gap-2">
                        <Input
                          value={item.label}
                          onChange={(e) =>
                            updateStatItem(
                              blockIndex,
                              itemIndex,
                              "label",
                              e.target.value,
                            )
                          }
                          placeholder="Stat label (e.g., 'Projects Completed')"
                        />
                        <div className="flex items-center gap-2">
                          <Input
                            value={item.value}
                            onChange={(e) =>
                              updateStatItem(
                                blockIndex,
                                itemIndex,
                                "value",
                                e.target.value,
                              )
                            }
                            placeholder="Stat value (e.g., '250+')"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                            onClick={() =>
                              removeStatItem(blockIndex, itemIndex)
                            }
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() => addStatItem(blockIndex)}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Statistic
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange && onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Section</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
