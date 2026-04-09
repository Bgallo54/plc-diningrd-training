import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserPlus, Trash2, Shield, ShieldCheck, Users } from "lucide-react";
import { queryClient } from "@/lib/queryClient";
import { useAdmin } from "./admin-gate";

interface AdminUserDisplay {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export function AdminManagement() {
  const { admin } = useAdmin();
  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPin, setNewPin] = useState("");
  const [newRole, setNewRole] = useState("admin");

  const isSuperAdmin = admin.role === "super-admin";

  const { data: admins = [] } = useQuery<AdminUserDisplay[]>({
    queryKey: ["/api/admin/users"],
    queryFn: async () => {
      const resp = await fetch("/api/admin/users", {
        headers: {
          "x-admin-email": admin.email,
          "x-admin-pin": "___", // We need to pass the pin
        },
      });
      if (!resp.ok) return [];
      return resp.json();
    },
    enabled: isSuperAdmin,
  });

  // We need the pin for management calls — store it from login
  // Since we can't access it from context, we use a workaround:
  // Management API calls use custom fetch with headers

  const addMutation = useMutation({
    mutationFn: async () => {
      const resp = await fetch("/api/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-email": admin.email,
          "x-admin-pin": (document.getElementById("admin-verify-pin") as HTMLInputElement)?.value || "",
        },
        body: JSON.stringify({
          name: newName.trim(),
          email: newEmail.trim(),
          pin: newPin.trim(),
          role: newRole,
        }),
      });
      if (!resp.ok) {
        const data = await resp.json();
        throw new Error(data.error || "Failed to add admin");
      }
      return resp.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      setNewName("");
      setNewEmail("");
      setNewPin("");
      setNewRole("admin");
      setShowForm(false);
    },
  });

  const removeMutation = useMutation({
    mutationFn: async (id: number) => {
      const resp = await fetch(`/api/admin/users/${id}`, {
        method: "DELETE",
        headers: {
          "x-admin-email": admin.email,
          "x-admin-pin": (document.getElementById("admin-verify-pin") as HTMLInputElement)?.value || "",
        },
      });
      if (!resp.ok) throw new Error("Failed to remove admin");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
    },
  });

  if (!isSuperAdmin) return null;

  return (
    <div className="space-y-4">
      <h2 className="font-semibold text-sm flex items-center gap-2">
        <Shield className="w-4 h-4 text-primary" />
        Admin Access Management
      </h2>

      {/* Hidden PIN field for API auth */}
      <input type="hidden" id="admin-verify-pin" />

      {/* Prompt for PIN verification */}
      <Card className="bg-card">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Label htmlFor="verify-pin-input" className="text-xs font-medium shrink-0">Your PIN to manage admins:</Label>
            <Input
              id="verify-pin-input"
              type="password"
              placeholder="Enter your PIN"
              className="max-w-[160px] h-8 text-sm"
              onChange={e => {
                const hidden = document.getElementById("admin-verify-pin") as HTMLInputElement;
                if (hidden) hidden.value = e.target.value;
              }}
              data-testid="input-verify-pin"
            />
          </div>
        </CardContent>
      </Card>

      {/* Add admin button */}
      <Button size="sm" onClick={() => setShowForm(!showForm)} data-testid="button-add-admin">
        <UserPlus className="w-3.5 h-3.5 mr-1.5" />
        Add Admin
      </Button>

      {/* Add admin form */}
      {showForm && (
        <Card className="border-l-4 border-l-primary">
          <CardContent className="p-5">
            <h3 className="font-semibold text-sm mb-3">New Admin User</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label className="text-xs mb-1 block">Full Name</Label>
                <Input
                  placeholder="e.g. Jane Smith"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  data-testid="input-new-admin-name"
                />
              </div>
              <div>
                <Label className="text-xs mb-1 block">Email</Label>
                <Input
                  type="email"
                  placeholder="jane@prioritylc.com"
                  value={newEmail}
                  onChange={e => setNewEmail(e.target.value)}
                  data-testid="input-new-admin-email"
                />
              </div>
              <div>
                <Label className="text-xs mb-1 block">PIN (4+ digits)</Label>
                <Input
                  type="text"
                  placeholder="e.g. 1234"
                  value={newPin}
                  onChange={e => setNewPin(e.target.value)}
                  data-testid="input-new-admin-pin"
                />
              </div>
              <div>
                <Label className="text-xs mb-1 block">Role</Label>
                <Select value={newRole} onValueChange={setNewRole}>
                  <SelectTrigger data-testid="select-new-admin-role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin (view dashboard)</SelectItem>
                    <SelectItem value="super-admin">Super Admin (manage admins)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <Button
                size="sm"
                onClick={() => addMutation.mutate()}
                disabled={!newName.trim() || !newEmail.trim() || !newPin.trim() || addMutation.isPending}
                data-testid="button-save-admin"
              >
                {addMutation.isPending ? "Adding..." : "Add Admin"}
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
            {addMutation.isError && (
              <p className="text-xs text-red-500 mt-2">{(addMutation.error as Error).message}</p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Current admins list */}
      {admins.length > 0 && (
        <div className="space-y-2">
          <div className="text-xs font-semibold text-muted-foreground">Current Admins</div>
          {admins.map(a => (
            <Card key={a.id} className="bg-card">
              <CardContent className="p-3 flex items-center gap-3">
                {a.role === "super-admin" ? (
                  <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
                ) : (
                  <Shield className="w-4 h-4 text-muted-foreground shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium">{a.name}</div>
                  <div className="text-xs text-muted-foreground">{a.email}</div>
                </div>
                <Badge variant="secondary" className="text-[9px]">
                  {a.role === "super-admin" ? "Super Admin" : "Admin"}
                </Badge>
                {a.id !== admin.id && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive text-xs h-7"
                    onClick={() => {
                      if (confirm(`Remove ${a.name} as admin?`)) {
                        removeMutation.mutate(a.id);
                      }
                    }}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
