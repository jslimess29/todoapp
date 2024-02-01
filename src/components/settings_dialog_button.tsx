import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose
  } from "@/components/ui/dialog"

import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

import { Button } from "./ui/button"

import {
    Settings
  } from "lucide-react"

const SettingsDialogButton = () => {
    return (
        <Dialog>
      <DialogTrigger asChild>
        <Button variant='ghost'><Settings className="h-5 w-5" /></Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[725px] w-10/12">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <div className="flex items-center space-x-2 mt-5 mb-5">
      <Switch id="airplane-mode" className="mr-2"/>
      <Label htmlFor="airplane-mode">This setting does nothing</Label>
      </div>
        <DialogFooter>
        <DialogClose asChild>
          <Button type="submit">Save changes</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    )
}

export default SettingsDialogButton;