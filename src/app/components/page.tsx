"use client";

import * as React from "react";
import { Plus, Search, Settings, Trash2 } from "lucide-react";
import {
  Button,
  Badge,
  Input,
  Label,
  Textarea,
  Select,
  FormField,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Dialog,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeaderCell,
  TableCell,
  Tabs,
  Avatar,
  Checkbox,
  Radio,
  Switch,
  Skeleton,
  Spinner,
  EmptyState,
  ToastProvider,
  useToast,
} from "@/components/ui";

const records = [
  { name: "Northbridge Holdings", owner: "A. Reyes", status: "good" as const, value: "£84,200" },
  { name: "Aldergate Properties", owner: "M. Okafor", status: "warn" as const, value: "£12,050" },
  { name: "Fenwick & Co", owner: "S. Patel", status: "bad" as const, value: "£3,400" },
  { name: "Thistle Group", owner: "A. Reyes", status: "idle" as const, value: "£0" },
];

function ToastDemo() {
  const { toast } = useToast();
  return (
    <Button
      variant="secondary"
      onClick={() =>
        toast({
          status: "good",
          title: "Record saved",
          description: "Northbridge Holdings was updated successfully.",
        })
      }
    >
      Trigger toast
    </Button>
  );
}

function Section({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-b border-slate-200 py-10 first:pt-0 last:border-b-0">
      <div className="mb-5 flex items-baseline gap-3 border-l-2 border-pine-700 pl-3">
        <span className="font-mono text-[11px] uppercase tracking-wide3 text-slate-500">
          {eyebrow}
        </span>
        <h2 className="font-mono text-[13px] uppercase tracking-wide2 text-ink">{title}</h2>
      </div>
      {children}
    </section>
  );
}

export default function ComponentShowcasePage() {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [tab, setTab] = React.useState("overview");
  const [switchOn, setSwitchOn] = React.useState(true);

  return (
    <ToastProvider>
      <div className="min-h-screen bg-paper">
        <header className="border-b border-slate-200 bg-white px-6 py-5">
          <p className="font-mono text-[11px] uppercase tracking-wide3 text-slate-500">
            Enterprise CRM — Phase 1
          </p>
          <h1 className="mt-1 font-mono text-[18px] uppercase tracking-wide2 text-ink">
            UI Foundation
          </h1>
          <p className="mt-1 max-w-xl text-[13px] text-slate-500">
            Core reusable components for the platform — buttons, forms, data display,
            feedback, and overlays. Built in TypeScript with Tailwind, ready for use
            across every future module.
          </p>
        </header>

        <main className="mx-auto max-w-4xl px-6 py-6">
          <Section eyebrow="01" title="Buttons">
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="danger">
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </Button>
              <Button variant="link">Link action</Button>
              <Button variant="primary" isLoading>
                Saving
              </Button>
              <Button variant="secondary" size="icon" aria-label="Settings">
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="primary" disabled>
                Disabled
              </Button>
            </div>
          </Section>

          <Section eyebrow="02" title="Status badges">
            <div className="flex flex-wrap items-center gap-2">
              <Badge status="good">Active</Badge>
              <Badge status="warn">Pending</Badge>
              <Badge status="bad">Overdue</Badge>
              <Badge status="idle">Archived</Badge>
              <Badge status="info" dot={false}>
                42 records
              </Badge>
            </div>
          </Section>

          <Section eyebrow="03" title="Form elements">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Company name" htmlFor="company">
                <Input id="company" placeholder="Northbridge Holdings" />
              </FormField>
              <FormField label="Account owner" htmlFor="owner" hint="Assign from your team">
                <Select id="owner" defaultValue="">
                  <option value="" disabled>
                    Select owner
                  </option>
                  <option value="reyes">A. Reyes</option>
                  <option value="okafor">M. Okafor</option>
                </Select>
              </FormField>
              <FormField label="Search" htmlFor="search">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
                  <Input id="search" placeholder="Search records…" className="pl-8" />
                </div>
              </FormField>
              <FormField label="Email" htmlFor="email" error="Enter a valid email address">
                <Input id="email" type="email" defaultValue="not-an-email" error />
              </FormField>
              <FormField label="Notes" htmlFor="notes" className="sm:col-span-2">
                <Textarea id="notes" placeholder="Add context for the team…" />
              </FormField>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-6">
              <label className="flex items-center gap-2 text-[13px] text-ink">
                <Checkbox defaultChecked /> Email notifications
              </label>
              <label className="flex items-center gap-2 text-[13px] text-ink">
                <Radio name="plan" defaultChecked /> Standard plan
              </label>
              <label className="flex items-center gap-2 text-[13px] text-ink">
                <Radio name="plan" /> Enterprise plan
              </label>
              <label className="flex items-center gap-2 text-[13px] text-ink">
                <Switch checked={switchOn} onChange={setSwitchOn} label="Auto-assign leads" />
                Auto-assign leads
              </label>
            </div>
          </Section>

          <Section eyebrow="04" title="Cards">
            <div className="grid gap-4 sm:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Pipeline value</CardTitle>
                  <Badge status="good">Live</Badge>
                </CardHeader>
                <CardContent>
                  <p className="font-mono text-2xl text-ink">£212,400</p>
                  <CardDescription className="mt-1">Across 18 open accounts</CardDescription>
                </CardContent>
                <CardFooter>
                  <Button variant="link" size="sm">
                    View pipeline →
                  </Button>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>New account</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center gap-3">
                  <Avatar name="Amara Reyes" />
                  <div>
                    <p className="text-[13px] text-ink">Amara Reyes</p>
                    <p className="text-[12px] text-slate-500">Account owner</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </Section>

          <Section eyebrow="05" title="Tabs">
            <Tabs
              items={[
                { value: "overview", label: "Overview" },
                { value: "activity", label: "Activity" },
                { value: "files", label: "Files" },
                { value: "locked", label: "Billing", disabled: true },
              ]}
              value={tab}
              onChange={setTab}
            />
            <p className="mt-4 text-[13px] text-slate-500">
              Showing content for <span className="font-mono text-ink">{tab}</span>
            </p>
          </Section>

          <Section eyebrow="06" title="Data table">
            <Table>
              <TableHead>
                <tr>
                  <TableHeaderCell>Account</TableHeaderCell>
                  <TableHeaderCell>Owner</TableHeaderCell>
                  <TableHeaderCell>Status</TableHeaderCell>
                  <TableHeaderCell className="text-right">Value</TableHeaderCell>
                </tr>
              </TableHead>
              <TableBody>
                {records.map((r) => (
                  <TableRow key={r.name} active={r.status === "good"}>
                    <TableCell className="font-medium">{r.name}</TableCell>
                    <TableCell>{r.owner}</TableCell>
                    <TableCell>
                      <Badge status={r.status}>
                        {r.status === "good"
                          ? "Active"
                          : r.status === "warn"
                          ? "Pending"
                          : r.status === "bad"
                          ? "Overdue"
                          : "Archived"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono">{r.value}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Section>

          <Section eyebrow="07" title="Feedback &amp; states">
            <div className="grid gap-4 sm:grid-cols-2">
              <Card>
                <CardContent className="space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex items-center gap-3">
                  <Spinner />
                  <span className="text-[13px] text-slate-500">Loading account data…</span>
                </CardContent>
              </Card>
            </div>
            <Card className="mt-4">
              <EmptyState
                title="No records yet"
                description="Add your first account to start tracking activity."
                action={
                  <Button size="sm">
                    <Plus className="h-3.5 w-3.5" /> New account
                  </Button>
                }
              />
            </Card>
          </Section>

          <Section eyebrow="08" title="Overlays">
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="secondary" onClick={() => setDialogOpen(true)}>
                Open dialog
              </Button>
              <ToastDemo />
            </div>
            <Dialog
              open={dialogOpen}
              onClose={() => setDialogOpen(false)}
              title="Archive account"
              description="This moves the account out of active pipelines."
              footer={
                <>
                  <Button variant="ghost" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button variant="danger" onClick={() => setDialogOpen(false)}>
                    Archive
                  </Button>
                </>
              }
            >
              <p className="text-[13px] text-slate-600">
                Northbridge Holdings will be archived. You can restore it later from the
                archive view.
              </p>
            </Dialog>
          </Section>
        </main>
      </div>
    </ToastProvider>
  );
}
