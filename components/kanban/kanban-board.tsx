"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { KanbanColumn } from "./kanaban-column";
import { EditTaskDialog } from "./edit-task-dailog";
import { Task, TaskStatus } from "@/lib/types";
import { supabase } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function KanbanBoard() {
  const queryClient = useQueryClient();
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);

  const { data: session } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      return data.session;
    },
  });

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      if (!session) return [];
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .order("position", { ascending: true });

      if (error) throw error;
      return data as Task[];
    },
    enabled: !!session,
  });

  const createTaskMutation = useMutation({
    mutationFn: async ({
      title,
      description,
      status,
      position,
    }: {
      title: string;
      description: string;
      status: TaskStatus;
      position: number;
    }) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("tasks")
        .insert({
          user_id: user.id,
          title,
          description,
          status,
          position,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<Task>;
    }) => {
      const { data, error } = await supabase
        .from("tasks")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("tasks").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter((task) => task.status === status);
  };

  const handleAddTask = async (
    status: TaskStatus,
    title: string,
    description: string
  ) => {
    const statusTasks = getTasksByStatus(status);
    const maxPosition =
      statusTasks.length > 0
        ? Math.max(...statusTasks.map((t) => t.position))
        : -1;

    await createTaskMutation.mutateAsync({
      title,
      description,
      status,
      position: maxPosition + 1,
    });
  };

  const handleUpdateTask = async (
    id: string,
    title: string,
    description: string
  ) => {
    await updateTaskMutation.mutateAsync({
      id,
      updates: { title, description },
    });
  };

  const handleDeleteTask = (id: string) => {
    setTaskToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteTask = async () => {
    if (taskToDelete) {
      await deleteTaskMutation.mutateAsync(taskToDelete);
      setDeleteDialogOpen(false);
      setTaskToDelete(null);
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setEditDialogOpen(true);
  };

  const handleDragStart = (e: React.DragEvent, task: Task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = async (e: React.DragEvent, newStatus: TaskStatus) => {
    e.preventDefault();

    if (!draggedTask || draggedTask.status === newStatus) {
      setDraggedTask(null);
      return;
    }

    const statusTasks = getTasksByStatus(newStatus);
    const maxPosition =
      statusTasks.length > 0
        ? Math.max(...statusTasks.map((t) => t.position))
        : -1;

    await updateTaskMutation.mutateAsync({
      id: draggedTask.id,
      updates: {
        status: newStatus,
        position: maxPosition + 1,
      },
    });

    setDraggedTask(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
        <KanbanColumn
          title="To Do"
          status="todo"
          tasks={getTasksByStatus("todo")}
          onAddTask={(title, description) =>
            handleAddTask("todo", title, description)
          }
          onEditTask={handleEditTask}
          onDeleteTask={handleDeleteTask}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        />
        <KanbanColumn
          title="In Progress"
          status="in-progress"
          tasks={getTasksByStatus("in-progress")}
          onAddTask={(title, description) =>
            handleAddTask("in-progress", title, description)
          }
          onEditTask={handleEditTask}
          onDeleteTask={handleDeleteTask}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        />
        <KanbanColumn
          title="Done"
          status="done"
          tasks={getTasksByStatus("done")}
          onAddTask={(title, description) =>
            handleAddTask("done", title, description)
          }
          onEditTask={handleEditTask}
          onDeleteTask={handleDeleteTask}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        />
      </div>
      <EditTaskDialog
        task={editingTask}
        open={editDialogOpen}
        onOpenChange={(open) => {
          setEditDialogOpen(open);
          if (!open) setEditingTask(null);
        }}
        onUpdate={handleUpdateTask}
      />
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Task</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this task? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setTaskToDelete(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteTask}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
