import { ToastProvider } from "@/components/ui/ToastProvider";
import { LoginFormView } from "./components/LoginFormView";

export default function LoginPage() {
  return (
    <ToastProvider>
      <LoginFormView />
    </ToastProvider>
  );
}
