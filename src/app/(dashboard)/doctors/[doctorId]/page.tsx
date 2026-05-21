import { redirect } from "next/navigation";

export default function DoctorDetailRedirectPage() {
  redirect("/doctors");
}
