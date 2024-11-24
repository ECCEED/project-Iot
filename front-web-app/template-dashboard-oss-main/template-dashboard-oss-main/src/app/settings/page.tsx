
"use client"
import {Calendar} from "@/components/Calendar"
import { Badge } from "@/components/Badge"
import { DatePicker } from "@/components/DatePicker"
import { Input } from "@/components/Input"

export default function Settings() {
  return (
    <>
      <div className="mt-4 sm:mt-6 lg:mt-10">
        <Calendar/>
        <Badge/>
        <DatePicker/>
        <Input/>
      </div>
    </>
  )
}
