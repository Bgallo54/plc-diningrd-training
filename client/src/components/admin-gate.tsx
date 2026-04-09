import { useState, createContext, useContext } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, LogIn, AlertCircle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import plcLogo from "@assets/plc-logo.jpg";

interface AdminSession {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface AdminContextValue {
  admin: AdminSession;
  logout: () => void;
}

const AdminContext = createContext<AdminContextValue | null>(null);

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used within AdminGate");
  return ctx;
}

export function AdminGate({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<AdminSession | null>(null);
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const resp = await apiRequest("POST", "/api/admin/login", {
        email: email.trim(),
        pin: pin.trim(),
      });
      if (!resp.ok) {
        const data = await resp.json();
        setError(data.error || "Invalid credentials");
        return;
      }
      const data = await resp.json();
      setAdmin(data);
    } catch {
      setError("Unable to connect. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    setAdmin(null);
    setEmail("");
    setPin("");
    setError("");
  }

  if (!admin) {
    return (
      <div className="p-6 lg:p-8 max-w-md mx-auto flex flex-col items-center justify-center min-h-[60vh]">
        <img src={plcLogo} alt="PLC" className="w-14 h-14 rounded-xl mb-4" />
        <div className="flex items-center gap-2 mb-1">
          <Shield className="w-5 h-5 text-primary" />
          <h1 className="text-lg font-bold">Manager Dashboard</h1>
        </div>
        <p className="text-sm text-muted-foreground mb-6 text-center">
          Authorized access only. Enter your admin credentials to continue.
        </p>

        <Card className="w-full">
          <CardContent className="p-5">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="admin-email" className="text-sm font-medium mb-1.5 block">Email</Label>
                <Input
                  id="admin-email"
                  type="email"
                  placeholder="you@prioritylc.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  data-testid="input-admin-email"
                />
              </div>
              <div>
                <Label htmlFor="admin-pin" className="text-sm font-medium mb-1.5 block">PIN</Label>
                <Input
                  id="admin-pin"
                  type="password"
                  placeholder="Enter your PIN"
                  value={pin}
                  onChange={e => setPin(e.target.value)}
                  required
                  data-testid="input-admin-pin"
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 dark:bg-red-950/30 rounded-lg p-3">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={loading || !email || !pin} data-testid="button-admin-login">
                <LogIn className="w-4 h-4 mr-2" />
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <AdminContext.Provider value={{ admin, logout }}>
      {children}
    </AdminContext.Provider>
  );
}
