import { redirect } from "next/navigation";

export default function NewAppointmentRedirectPage() {
  redirect("/appointments");
}
