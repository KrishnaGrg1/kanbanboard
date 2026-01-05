"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TaskCard } from "./task-card";
import { AddTaskDialog } from "./add-task-dailog";
import { Task, TaskStatus } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

interface KanbanColumnProps {
  title: string;
  status: TaskStatus;
  tasks: Task[];
  onAddTask: (title: string, description: string) => Promise<void>;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onDragStart: (e: React.DragEvent, task: Task) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, status: TaskStatus) => void;
}

export function KanbanColumn({
  title,
  status,
  tasks,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onDragStart,
  onDragOver,
  onDrop,
}: KanbanColumnProps) {
  const getColumnColor = () => {
    switch (status) {
      case "todo":
        return "bg-slate-50 border-slate-200 dark:bg-slate-900 dark:border-slate-800";
      case "in-progress":
        return "bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-900";
      case "done":
        return "bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-900";
    }
  };

  const getBadgeVariant = () => {
    switch (status) {
      case "todo":
        return "secondary";
      case "in-progress":
        return "default";
      case "done":
        return "default";
    }
  };

  return (
    <Card
      className={`flex flex-col h-full ${getColumnColor()}`}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, status)}
    >
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          <Badge variant={getBadgeVariant()}>{tasks.length}</Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1 space-y-3 overflow-y-auto">
        {tasks.map((task) => (
          <div
            key={task.id}
            draggable
            onDragStart={(e) => onDragStart(e, task)}
          >
            <TaskCard task={task} onEdit={onEditTask} onDelete={onDeleteTask} />
          </div>
        ))}
        <AddTaskDialog status={status} onAdd={onAddTask} />
      </CardContent>
    </Card>
  );
}
