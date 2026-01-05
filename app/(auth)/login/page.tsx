// import { LoginForm } from "@/components/auth/login-form";
import { LoginForm } from "@/components/auth/LoginForm";
import { KanbanSquare } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4">
      <LoginForm />
    </div>
  );
}
