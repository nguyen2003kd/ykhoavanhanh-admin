import { redirect } from "next/navigation";

export default function NewDoctorRedirectPage() {
  redirect("/doctors");
}
