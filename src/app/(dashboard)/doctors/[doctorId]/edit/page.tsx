import { redirect } from "next/navigation";

export default function EditDoctorRedirectPage() {
  redirect("/doctors");
}
