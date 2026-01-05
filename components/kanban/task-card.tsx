"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Edit, GripVertical } from "lucide-react";
import { Task } from "@/lib/types";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  dragHandleProps?: any;
}

export function TaskCard({
  task,
  onEdit,
  onDelete,
  dragHandleProps,
}: TaskCardProps) {
  return (
    <Card className="group hover:shadow-md transition-shadow cursor-move">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-2 flex-1">
            <div
              {...dragHandleProps}
              className="cursor-grab active:cursor-grabbing pt-1"
            >
              <GripVertical className="h-4 w-4 text-muted-foreground" />
            </div>
            <CardTitle className="text-base font-semibold leading-tight flex-1">
              {task.title}
            </CardTitle>
          </div>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => onEdit(task)}
            >
              <Edit className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-destructive hover:text-destructive"
              onClick={() => onDelete(task.id)}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </CardHeader>
      {task.description && (
        <CardContent className="pb-4">
          <CardDescription className="text-sm whitespace-pre-wrap">
            {task.description}
          </CardDescription>
        </CardContent>
      )}
    </Card>
  );
}
