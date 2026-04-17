import { useState } from 'react';
import { Plus, Phone, Mail, AlertCircle, CheckCircle2, Clock, MessageSquare, User, Wrench, Package, Truck, Ban, Pause, XCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import { Textarea } from '@/app/components/ui/textarea';
import { Label } from '@/app/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';

interface Note {
  id: string;
  type: 'Phone Call' | 'Email' | 'Support Ticket' | 'Service Issue' | 'Billing Inquiry' | 'General Note' | 'Equipment Damage' | 'Repair Required' | 'Technician Dispatch' | 'Service Change' | 'Service Move' | 'Service Cancellation' | 'Service Suspension';
  category: 'Support' | 'Billing' | 'Technical' | 'Sales' | 'General' | 'Service Action' | 'Equipment';
  subject: string;
  content: string;
  author: string;
  timestamp: string;
  resolved?: boolean;
  priority?: 'Low' | 'Normal' | 'High' | 'Urgent';
}

// Mock notes data
const mockNotes: Note[] = [
  {
    id: 'NOTE-001',
    type: 'Service Suspension',
    category: 'Service Action',
    subject: 'Service suspended - payment past due',
    content: 'Service suspended due to payment 45 days past due. Account balance $311.88 (2 months). Customer contacted via phone and email on 3/10 and 3/12. Auto-suspension triggered on 3/15. Customer has 30 days before cancellation.',
    author: 'Billing System',
    timestamp: '3/15/2026 12:01 AM',
    resolved: false,
    priority: 'High',
  },
  {
    id: 'NOTE-002',
    type: 'Equipment Damage',
    category: 'Equipment',
    subject: 'ONT damaged by lightning strike',
    content: 'Customer reported ONT not powering on after lightning storm. Visual inspection shows scorch marks on power supply. Replacement ONT (Calix 716GE-I) shipped overnight. Technician scheduled for installation 3/18/2026 at 2 PM. No charge to customer - covered under warranty.',
    author: 'Sarah Johnson',
    timestamp: '3/16/2026 9:30 AM',
    resolved: false,
    priority: 'Urgent',
  },
  {
    id: 'NOTE-003',
    type: 'Service Move',
    category: 'Service Action',
    subject: 'Customer moving to new property',
    content: 'Customer relocating from 123 Main St to 456 Oak Ave on 4/1/2026. New address is serviceable - fiber already installed to building. Move scheduled for 4/1. Will transfer existing service, no installation fee. Customer keeping same 1Gig plan.',
    author: 'Customer Service',
    timestamp: '3/14/2026 11:15 AM',
    resolved: false,
    priority: 'Normal',
  },
  {
    id: 'NOTE-004',
    type: 'Repair Required',
    category: 'Technical',
    subject: 'Fiber drop needs repair at pole',
    content: 'Technician inspection revealed fiber drop sagging at pole connection point. Not affecting service currently but requires repair to prevent future outage. Aerial crew scheduled for 3/20/2026. Customer notified - no service interruption expected.',
    author: 'Field Tech - Mike Wilson',
    timestamp: '3/12/2026 3:45 PM',
    resolved: false,
    priority: 'Normal',
  },
  {
    id: 'NOTE-005',
    type: 'Phone Call',
    category: 'Technical',
    subject: 'Slow internet speeds reported',
    content: 'Customer called regarding slow internet speeds during evening hours. Ran diagnostics remotely - ONU signal strength is good (-18 dBm). Advised customer to reboot router and check for background downloads. Will monitor for 24 hours.',
    author: 'Tech Support - Sarah Johnson',
    timestamp: '3/10/2026 2:45 PM',
    resolved: true,
    priority: 'Normal',
  },
  {
    id: 'NOTE-006',
    type: 'Email',
    category: 'Billing',
    subject: 'Question about promotional discount',
    content: 'Customer inquired via email about when their promotional discount expires. Confirmed discount is active for 11 more months (expires 12/15/2026). Customer satisfied with response.',
    author: 'Billing - Mike Chen',
    timestamp: '3/8/2026 10:30 AM',
    resolved: true,
    priority: 'Low',
  },
];

export function CustomerNotesTab() {
  const [notes, setNotes] = useState<Note[]>(mockNotes);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [newNote, setNewNote] = useState({
    type: 'General Note' as Note['type'],
    category: 'General' as Note['category'],
    subject: '',
    content: '',
    priority: 'Normal' as Note['priority'],
  });

  const handleAddNote = () => {
    if (!newNote.subject.trim() || !newNote.content.trim()) return;

    const note: Note = {
      id: `NOTE-${String(notes.length + 1).padStart(3, '0')}`,
      type: newNote.type,
      category: newNote.category,
      subject: newNote.subject,
      content: newNote.content,
      author: 'Current User',
      timestamp: new Date().toLocaleString('en-US', {
        month: '1/2-digit',
        day: '1/2-digit',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }),
      resolved: false,
      priority: newNote.priority,
    };

    setNotes([note, ...notes]);
    setNewNote({
      type: 'General Note',
      category: 'General',
      subject: '',
      content: '',
      priority: 'Normal',
    });
    setIsAddingNote(false);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Phone Call':
        return <Phone className="w-4 h-4" />;
      case 'Email':
        return <Mail className="w-4 h-4" />;
      case 'Service Issue':
        return <AlertCircle className="w-4 h-4" />;
      case 'Equipment Damage':
        return <Package className="w-4 h-4 text-destructive" />;
      case 'Repair Required':
        return <Wrench className="w-4 h-4 text-[var(--warning)]" />;
      case 'Technician Dispatch':
        return <Truck className="w-4 h-4 text-[var(--info)]" />;
      case 'Service Move':
        return <Truck className="w-4 h-4" />;
      case 'Service Cancellation':
        return <Ban className="w-4 h-4 text-destructive" />;
      case 'Service Suspension':
        return <Pause className="w-4 h-4 text-[var(--warning)]" />;
      case 'Service Change':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <MessageSquare className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Technical':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/30';
      case 'Billing':
        return 'bg-green-500/10 text-green-500 border-green-500/30';
      case 'Support':
        return 'bg-purple-500/10 text-purple-500 border-purple-500/30';
      case 'Sales':
        return 'bg-orange-500/10 text-orange-500 border-orange-500/30';
      case 'Service Action':
        return 'bg-indigo-500/10 text-indigo-500 border-indigo-500/30';
      case 'Equipment':
        return 'bg-red-500/10 text-red-500 border-red-500/30';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/30';
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'Urgent':
        return 'bg-red-500/10 text-red-500 border-red-500/30';
      case 'High':
        return 'bg-orange-500/10 text-orange-500 border-orange-500/30';
      case 'Normal':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/30';
      case 'Low':
        return 'bg-gray-500/10 text-gray-500 border-gray-500/30';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/30';
    }
  };

  return (
    <div className="space-y-4">
      {/* Header with Add Note Button */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-[var(--foreground)]">Customer Notes & Activity Log</h3>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">
            Track all customer interactions, support calls, and important account notes
          </p>
        </div>
        <Button
          onClick={() => setIsAddingNote(!isAddingNote)}
          className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Note
        </Button>
      </div>

      {/* Add Note Form */}
      {isAddingNote && (
        <Card className="bg-[var(--secondary)] border-[var(--border)] p-4">
          <h4 className="text-sm font-semibold text-[var(--foreground)] mb-4">New Note</h4>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="note-type">Note Type *</Label>
                <Select
                  value={newNote.type}
                  onValueChange={(value) => setNewNote({ ...newNote, type: value as Note['type'] })}
                >
                  <SelectTrigger className="bg-[var(--background)] border-[var(--border)]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[var(--popover)] border-[var(--border)]">
                    <SelectItem value="Phone Call">Phone Call</SelectItem>
                    <SelectItem value="Email">Email</SelectItem>
                    <SelectItem value="Support Ticket">Support Ticket</SelectItem>
                    <SelectItem value="Service Issue">Service Issue</SelectItem>
                    <SelectItem value="Billing Inquiry">Billing Inquiry</SelectItem>
                    <SelectItem value="Equipment Damage">Equipment Damage</SelectItem>
                    <SelectItem value="Repair Required">Repair Required</SelectItem>
                    <SelectItem value="Technician Dispatch">Technician Dispatch</SelectItem>
                    <SelectItem value="Service Change">Service Change</SelectItem>
                    <SelectItem value="Service Move">Service Move</SelectItem>
                    <SelectItem value="Service Suspension">Service Suspension</SelectItem>
                    <SelectItem value="Service Cancellation">Service Cancellation</SelectItem>
                    <SelectItem value="General Note">General Note</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="note-category">Category *</Label>
                <Select
                  value={newNote.category}
                  onValueChange={(value) => setNewNote({ ...newNote, category: value as Note['category'] })}
                >
                  <SelectTrigger className="bg-[var(--background)] border-[var(--border)]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[var(--popover)] border-[var(--border)]">
                    <SelectItem value="Technical">Technical</SelectItem>
                    <SelectItem value="Billing">Billing</SelectItem>
                    <SelectItem value="Support">Support</SelectItem>
                    <SelectItem value="Sales">Sales</SelectItem>
                    <SelectItem value="Service Action">Service Action</SelectItem>
                    <SelectItem value="Equipment">Equipment</SelectItem>
                    <SelectItem value="General">General</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="note-priority">Priority *</Label>
                <Select
                  value={newNote.priority}
                  onValueChange={(value) => setNewNote({ ...newNote, priority: value as Note['priority'] })}
                >
                  <SelectTrigger className="bg-[var(--background)] border-[var(--border)]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[var(--popover)] border-[var(--border)]">
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Normal">Normal</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="note-subject">Subject *</Label>
              <input
                id="note-subject"
                type="text"
                placeholder="Brief subject line..."
                value={newNote.subject}
                onChange={(e) => setNewNote({ ...newNote, subject: e.target.value })}
                className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-md text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="note-content">Note Content *</Label>
              <Textarea
                id="note-content"
                placeholder="Describe the interaction, issue, or note details..."
                value={newNote.content}
                onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                rows={4}
                className="bg-[var(--background)] border-[var(--border)] resize-none"
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddingNote(false);
                  setNewNote({
                    type: 'General Note',
                    category: 'General',
                    subject: '',
                    content: '',
                    priority: 'Normal',
                  });
                }}
                className="bg-transparent border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--muted)]"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddNote}
                disabled={!newNote.subject.trim() || !newNote.content.trim()}
                className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white disabled:opacity-50"
              >
                Save Note
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Notes Timeline */}
      <div className="space-y-3">
        {notes.length === 0 && (
          <Card className="bg-[var(--secondary)] border-[var(--border)] p-8">
            <div className="text-center">
              <MessageSquare className="w-12 h-12 text-[var(--muted-foreground)] mx-auto mb-3" />
              <p className="text-sm text-[var(--muted-foreground)]">No notes or activity yet</p>
              <p className="text-xs text-[var(--muted-foreground)] mt-1">
                Add your first note to start tracking customer interactions
              </p>
            </div>
          </Card>
        )}

        {notes.map((note, index) => (
          <Card 
            key={note.id} 
            className={`bg-[var(--secondary)] border-[var(--border)] p-4 ${
              note.resolved ? 'opacity-75' : ''
            }`}
          >
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className="mt-1 p-2 bg-[var(--background)] rounded-lg flex-shrink-0">
                {getTypeIcon(note.type)}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-semibold text-[var(--foreground)]">
                        {note.subject}
                      </h4>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium border ${getCategoryColor(note.category)}`}>
                        {note.category}
                      </span>
                      {note.priority && note.priority !== 'Normal' && (
                        <span className={`px-2 py-0.5 rounded text-xs font-medium border ${getPriorityColor(note.priority)}`}>
                          {note.priority}
                        </span>
                      )}
                      {note.resolved && (
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-green-500/10 text-green-500 border border-green-500/30">
                          <CheckCircle2 className="w-3 h-3" />
                          Resolved
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-[var(--muted-foreground)]">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {note.author}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {note.timestamp}
                      </span>
                      <span className="px-2 py-0.5 bg-[var(--background)] rounded">
                        {note.type}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-[var(--foreground)] leading-relaxed mt-2">
                  {note.content}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Activity Summary */}
      <Card className="bg-[var(--secondary)] border-[var(--border)] p-4 mt-6">
        <h4 className="text-sm font-semibold text-[var(--foreground)] mb-3">Activity Summary</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-[var(--foreground)]">{notes.length}</p>
            <p className="text-xs text-[var(--muted-foreground)] mt-1">Total Notes</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-500">
              {notes.filter(n => n.resolved).length}
            </p>
            <p className="text-xs text-[var(--muted-foreground)] mt-1">Resolved</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-500">
              {notes.filter(n => !n.resolved).length}
            </p>
            <p className="text-xs text-[var(--muted-foreground)] mt-1">Open</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-500">
              {notes.filter(n => n.type === 'Phone Call').length}
            </p>
            <p className="text-xs text-[var(--muted-foreground)] mt-1">Phone Calls</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
