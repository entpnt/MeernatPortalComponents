import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import { Edit2, Trash2, X } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/app/components/ui/tabs';
import { TabMenu } from '@/app/components/ui/tab-menu';

export function OperatorContent() {
  const [activeTab, setActiveTab] = useState('details');

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Operator</h1>
        <p className="text-muted-foreground">
          Manage operator settings and configurations • Orangeburg Fiber
        </p>
      </div>

      {/* Tabs */}
      <TabMenu
        activeTab={activeTab}
        onTabChange={setActiveTab}
        tabs={[
          { id: 'details', label: 'Details' },
          { id: 'api', label: 'API' },
          { id: 'contacts', label: 'Contacts' },
        ]}
        className="mb-8"
      />

      {/* Tab Content */}
      {activeTab === 'details' && <DetailsTab />}
      {activeTab === 'api' && <APITab />}
      {activeTab === 'contacts' && <ContactsTab />}
    </div>
  );
}

function DetailsTab() {
  const [autoApprove, setAutoApprove] = useState('');

  return (
    <div className="max-w-5xl">
      {/* Created/Updated timestamps */}
      <div className="grid grid-cols-2 gap-8 mb-6">
        <div>
          <span className="text-xs text-muted-foreground uppercase">Created: </span>
          <span className="text-sm text-foreground">2025-09-25 23:10:21</span>
        </div>
        <div>
          <span className="text-xs text-muted-foreground uppercase">Updated: </span>
          <span className="text-sm text-foreground">2025-09-25 23:10:21</span>
        </div>
      </div>

      {/* Name and ID */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-2 uppercase">
            Name
          </label>
          <input
            type="text"
            defaultValue="Jamestown BPU Fiber"
            className="w-full px-3 py-2 bg-[var(--popover)] border border-[var(--border)] rounded-lg text-[var(--foreground)] text-sm placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--focus)] focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-2 uppercase">
            ID
          </label>
          <input
            type="text"
            defaultValue="fabe2562-8452-11f0-b49e-4f4c3041584f"
            className="w-full px-3 py-2 bg-[var(--popover)] border border-[var(--border)] rounded-lg text-[var(--foreground)] text-sm placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--focus)] focus:border-transparent"
            readOnly
          />
        </div>
      </div>

      {/* Status, Type, Auto Approve */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-2 uppercase">
            Status
          </label>
          <select
            defaultValue="Active"
            className="w-full px-3 py-2 bg-[var(--popover)] border border-[var(--border)] rounded-lg text-[var(--foreground)] text-sm placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--focus)] focus:border-transparent"
          >
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-2 uppercase">
            Type
          </label>
          <select
            defaultValue="Transport"
            className="w-full px-3 py-2 bg-[var(--popover)] border border-[var(--border)] rounded-lg text-[var(--foreground)] text-sm placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--focus)] focus:border-transparent"
          >
            <option>Transport</option>
            <option>Service Provider</option>
            <option>Other</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-2 uppercase">
            Auto Approve
          </label>
          <div className="relative">
            <select
              value={autoApprove}
              onChange={(e) => setAutoApprove(e.target.value)}
              className="w-full px-3 py-2 bg-[var(--popover)] border border-[var(--border)] rounded-lg text-[var(--muted-foreground)] text-sm placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--focus)] focus:border-transparent appearance-none"
            >
              <option value="">Select Auto Approve Types</option>
              <option value="signup">Sign Up</option>
              <option value="upgrade">Upgrade</option>
            </select>
            {autoApprove && (
              <button
                onClick={() => setAutoApprove('')}
                className="absolute right-8 top-1/2 transform -translate-y-1/2"
              >
                <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="mb-6">
        <label className="block text-xs font-medium text-muted-foreground mb-2 uppercase">
          Description
        </label>
        <textarea
          defaultValue="Jamestown BPU Fiber is an advanced fiber optic network owned and operated by Jamestown BPU as a fiber utility, for the benefit of BPU customers."
          rows={4}
          className="w-full px-3 py-2 bg-[var(--popover)] border border-[var(--border)] rounded-lg text-[var(--foreground)] text-sm placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--focus)] focus:border-transparent resize-none"
        />
      </div>

      {/* Image Upload */}
      <div className="mb-8">
        <label className="block text-xs font-medium text-muted-foreground mb-2 uppercase">
          Image
        </label>
        <div className="flex items-start gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Button className="bg-[var(--popover)] hover:bg-[var(--secondary)] text-foreground border border-[var(--border)]">
                Choose File
              </Button>
              <span className="text-sm text-muted-foreground">No file chosen</span>
            </div>
            <div className="flex gap-2 mb-2">
              <Button className="bg-[var(--popover)] hover:bg-[var(--popover-hover)] text-foreground border border-[var(--border)]">
                Upload
              </Button>
              <Button 
                disabled 
                variant="destructive"
                style={{
                  backgroundColor: 'rgba(230, 0, 0, 0.4)',
                  borderColor: 'rgba(230, 0, 0, 0.4)',
                  color: 'rgba(255, 255, 255, 0.6)',
                  opacity: 1
                }}
                className="cursor-not-allowed"
              >
                Delete Image
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">Image dimensions should be 254 × 114.</p>
          </div>
          <div className="w-32 h-24 bg-[var(--secondary)] border border-[var(--border)] rounded-lg flex items-center justify-center">
            <div className="w-12 h-12 border-2 border-[var(--border)] rounded flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-t-0 border-l-0 border-[var(--border)] rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-start">
        <Button className="bg-[var(--focus)] hover:bg-[var(--focus)]/90 text-white px-8">
          Save
        </Button>
      </div>
    </div>
  );
}

function APITab() {
  const apiKeys = [
    { key: 'QSnEuU4VqOMSjz404V', accessType: 'ALL' },
    { key: 'GBOy1FG3WT7RPphNVa', accessType: 'ALL' },
    { key: 'CTveirjS41WLFwuYKX', accessType: 'ALL' },
    { key: 'XPBX9mTI9YstVlu56N', accessType: 'ALL' },
    { key: 'mME1broxZDwW3doktr', accessType: 'SUBSCRIBER_PORTAL' },
  ];

  return (
    <div>
      {/* Add Button */}
      <div className="flex justify-end mb-6">
        <Button className="bg-[var(--focus)] hover:bg-[var(--focus)]/90 text-white">
          Add
        </Button>
      </div>

      {/* Table */}
      <Card className="bg-card border-border">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-muted-foreground">Key</TableHead>
              <TableHead className="text-muted-foreground">Access Type</TableHead>
              <TableHead className="text-muted-foreground text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {apiKeys.map((item, index) => (
              <TableRow key={index} className="border-border hover:bg-secondary/50">
                <TableCell className="text-foreground font-mono text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[var(--success)] rounded-full"></span>
                    {item.key}
                  </div>
                </TableCell>
                <TableCell className="text-foreground">{item.accessType}</TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-2 justify-end">
                    <button className="p-2 rounded-full bg-[#FFA500] hover:bg-[#FF8C00] transition-colors">
                      <Edit2 className="w-4 h-4 text-white" />
                    </button>
                    <button className="p-2 rounded-full bg-[#E60000] hover:bg-[#CC0000] transition-colors">
                      <Trash2 className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Footer */}
      <div className="mt-4">
        <p className="text-sm text-muted-foreground">Showing 5 of 5 entries</p>
      </div>
    </div>
  );
}

function ContactsTab() {
  return (
    <div>
      {/* Add Button */}
      <div className="flex justify-end mb-6">
        <Button className="bg-[var(--focus)] hover:bg-[var(--focus)]/90 text-white">
          Add
        </Button>
      </div>

      {/* Table */}
      <Card className="bg-card border-border">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-muted-foreground">Name</TableHead>
              <TableHead className="text-muted-foreground">Address</TableHead>
              <TableHead className="text-muted-foreground">Address 2</TableHead>
              <TableHead className="text-muted-foreground">Type</TableHead>
              <TableHead className="text-muted-foreground text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={5} className="text-center py-16 text-muted-foreground">
                No contacts available
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}