"use client"

import { useEffect, useState, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Loader2, Plus, Pencil, Trash2, Check, X } from "lucide-react"

interface Court {
  id: string
  name: string
  isActive: boolean
}

export function CourtsManager() {
  const [courts, setCourts] = useState<Court[]>([])
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  const [newName, setNewName] = useState("")
  const [savingNew, setSavingNew] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState("")
  const [savingEdit, setSavingEdit] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const editInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetch("/api/my-club/courts")
      .then((res) => res.json())
      .then((data) => setCourts(data.courts ?? []))
      .catch(() => toast.error("Error al cargar canchas"))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (adding) inputRef.current?.focus()
  }, [adding])

  useEffect(() => {
    if (editingId) editInputRef.current?.focus()
  }, [editingId])

  const handleAdd = async () => {
    if (!newName.trim()) return
    setSavingNew(true)
    try {
      const res = await fetch("/api/my-club/courts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName.trim() }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Error")
      }
      const data = await res.json()
      setCourts((prev) => [...prev, data.court])
      setNewName("")
      setAdding(false)
      toast.success("Cancha agregada")
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Error al agregar cancha")
    } finally {
      setSavingNew(false)
    }
  }

  const handleEdit = async (court: Court) => {
    if (!editName.trim() || editName.trim() === court.name) {
      setEditingId(null)
      return
    }
    setSavingEdit(true)
    try {
      const res = await fetch("/api/my-club/courts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: court.id, name: editName.trim() }),
      })
      if (!res.ok) throw new Error()
      const data = await res.json()
      setCourts((prev) => prev.map((c) => (c.id === court.id ? data.court : c)))
      setEditingId(null)
      toast.success("Cancha actualizada")
    } catch {
      toast.error("Error al actualizar cancha")
    } finally {
      setSavingEdit(false)
    }
  }

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    try {
      const res = await fetch("/api/my-club/courts", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })
      if (!res.ok) throw new Error()
      setCourts((prev) => prev.filter((c) => c.id !== id))
      toast.success("Cancha eliminada")
    } catch {
      toast.error("Error al eliminar cancha")
    } finally {
      setDeletingId(null)
    }
  }

  const toggleActive = async (court: Court) => {
    try {
      const res = await fetch("/api/my-club/courts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: court.id, isActive: !court.isActive }),
      })
      if (!res.ok) throw new Error()
      const data = await res.json()
      setCourts((prev) => prev.map((c) => (c.id === court.id ? data.court : c)))
    } catch {
      toast.error("Error al actualizar estado")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {courts.length === 0 && !adding && (
        <p className="text-sm text-muted-foreground text-center py-6">
          No tienes canchas registradas
        </p>
      )}

      <ul className="space-y-2">
        {courts.map((court) => (
          <li
            key={court.id}
            className="flex items-center gap-2 rounded-lg border px-3 py-2 transition-colors hover:bg-muted/50"
          >
            {editingId === court.id ? (
              <>
                <Input
                  ref={editInputRef}
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleEdit(court)
                    if (e.key === "Escape") setEditingId(null)
                  }}
                  className="h-8 flex-1"
                  disabled={savingEdit}
                />
                <Button
                  size="icon"
                  variant="ghost"
                  className="size-8"
                  onClick={() => handleEdit(court)}
                  disabled={savingEdit}
                >
                  {savingEdit ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Check className="size-4" />
                  )}
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="size-8"
                  onClick={() => setEditingId(null)}
                  disabled={savingEdit}
                >
                  <X className="size-4" />
                </Button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => toggleActive(court)}
                  className={`size-2.5 rounded-full shrink-0 transition-colors ${court.isActive ? "bg-green-500" : "bg-muted-foreground/40"}`}
                  title={court.isActive ? "Activa" : "Inactiva"}
                />
                <span
                  className={`flex-1 text-sm ${!court.isActive ? "text-muted-foreground line-through" : ""}`}
                >
                  {court.name}
                </span>
                <Button
                  size="icon"
                  variant="ghost"
                  className="size-8"
                  onClick={() => {
                    setEditingId(court.id)
                    setEditName(court.name)
                  }}
                >
                  <Pencil className="size-3.5" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="size-8 text-destructive hover:text-destructive"
                  onClick={() => handleDelete(court.id)}
                  disabled={deletingId === court.id}
                >
                  {deletingId === court.id ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="size-3.5" />
                  )}
                </Button>
              </>
            )}
          </li>
        ))}
      </ul>

      {adding ? (
        <div className="flex items-center gap-2">
          <Input
            ref={inputRef}
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAdd()
              if (e.key === "Escape") {
                setAdding(false)
                setNewName("")
              }
            }}
            placeholder="Nombre de la cancha"
            className="h-8 flex-1"
            disabled={savingNew}
          />
          <Button
            size="icon"
            variant="ghost"
            className="size-8"
            onClick={handleAdd}
            disabled={savingNew || !newName.trim()}
          >
            {savingNew ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Check className="size-4" />
            )}
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="size-8"
            onClick={() => {
              setAdding(false)
              setNewName("")
            }}
            disabled={savingNew}
          >
            <X className="size-4" />
          </Button>
        </div>
      ) : (
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => setAdding(true)}
        >
          <Plus className="size-4 mr-1.5" />
          Agregar cancha
        </Button>
      )}
    </div>
  )
}
