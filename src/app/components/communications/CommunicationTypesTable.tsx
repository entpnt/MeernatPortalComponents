import { Edit2, Trash2, Plus, Mail } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Card } from '@/app/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table';

export function CommunicationTypesTable() {
  return (
    <div className="space-y-6">
      {/* Communication Types Section */}
      <Card className="bg-[var(--card)] border-[var(--border)] p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-[#147FFF]" />
            <div>
              <h3 className="text-base font-semibold text-[var(--foreground)]">Communication Types</h3>
              <p className="text-sm text-[var(--muted-foreground)]">
                Manage email communication types and their Postmark templates
              </p>
            </div>
          </div>
          <Button size="sm" className="bg-[#147FFF] hover:bg-[#1068CC]">
            <Plus className="w-4 h-4 mr-2" />
            Add Type
          </Button>
        </div>

        {/* Table */}
        <div className="border border-[var(--border)] rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-[var(--border)] bg-[var(--background)] hover:bg-[var(--background)]">
                <TableHead className="text-[var(--muted-foreground)] font-medium">Name</TableHead>
                <TableHead className="text-[var(--muted-foreground)] font-medium">Customer Email</TableHead>
                <TableHead className="text-[var(--muted-foreground)] font-medium">Team Email</TableHead>
                <TableHead className="text-[var(--muted-foreground)] font-medium text-center">Status</TableHead>
                <TableHead className="text-[var(--muted-foreground)] font-medium text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Address Not Found Inquiry */}
              <TableRow className="border-[var(--border)] hover:bg-[var(--secondary)]">
                <TableCell>
                  <div>
                    <p className="text-[var(--foreground)] font-medium">Address Not Found Inquiry</p>
                    <p className="text-xs text-[var(--muted-foreground)] font-mono">inquiry_address_not_found</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-[#10B981] text-white text-xs">Enabled</Badge>
                    <span className="text-[var(--muted-foreground)] text-sm">address_not_found_customer</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <Badge className="bg-[#3B82F6] text-white text-xs mb-1">Enabled</Badge>
                    <p className="text-[var(--muted-foreground)] text-xs">→ help@orangeburgfiber.net</p>
                    <p className="text-[var(--muted-foreground)] text-xs font-mono">address_not_found_team</p>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked readOnly />
                      <div className="w-11 h-6 bg-[#10B981] rounded-full peer peer-focus:ring-2 peer-focus:ring-[#147FFF] peer-checked:bg-[#10B981]">
                        <div className="w-5 h-5 bg-white rounded-full shadow-md transition-transform translate-x-5" />
                      </div>
                    </label>
                    <Badge className="bg-[#10B981] text-white text-xs">Active</Badge>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-[var(--muted-foreground)] hover:text-[#EF4444]">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>

              {/* Billing Notice */}
              <TableRow className="border-[var(--border)] hover:bg-[var(--secondary)]">
                <TableCell>
                  <div>
                    <p className="text-[var(--foreground)] font-medium">Billing Notice</p>
                    <p className="text-xs text-[var(--muted-foreground)] font-mono">billing_notification_3day</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-[#10B981] text-white text-xs">Enabled</Badge>
                    <span className="text-[var(--muted-foreground)] text-sm">billing_notification_3day</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <Badge className="bg-[var(--muted-foreground)] text-white text-xs mb-1">Disabled</Badge>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked readOnly />
                      <div className="w-11 h-6 bg-[#10B981] rounded-full peer peer-focus:ring-2 peer-focus:ring-[#147FFF] peer-checked:bg-[#10B981]">
                        <div className="w-5 h-5 bg-white rounded-full shadow-md transition-transform translate-x-5" />
                      </div>
                    </label>
                    <Badge className="bg-[#10B981] text-white text-xs">Active</Badge>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-[var(--muted-foreground)] hover:text-[#EF4444]">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>

              {/* Contact Form */}
              <TableRow className="border-[var(--border)] hover:bg-[var(--secondary)]">
                <TableCell>
                  <div>
                    <p className="text-[var(--foreground)] font-medium">Contact Form</p>
                    <p className="text-xs text-[var(--muted-foreground)] font-mono">contact_form</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-[var(--muted-foreground)] text-white text-xs">Disabled</Badge>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <Badge className="bg-[#3B82F6] text-white text-xs mb-1">Enabled</Badge>
                    <p className="text-[var(--muted-foreground)] text-xs">→ help@orangeburgfiber.net</p>
                    <p className="text-[var(--muted-foreground)] text-xs font-mono">contactFormSubmissionNotice</p>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked readOnly />
                      <div className="w-11 h-6 bg-[#10B981] rounded-full peer peer-focus:ring-2 peer-focus:ring-[#147FFF] peer-checked:bg-[#10B981]">
                        <div className="w-5 h-5 bg-white rounded-full shadow-md transition-transform translate-x-5" />
                      </div>
                    </label>
                    <Badge className="bg-[#10B981] text-white text-xs">Active</Badge>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-[var(--muted-foreground)] hover:text-[#EF4444]">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>

              {/* Customer Ready to Schedule Install */}
              <TableRow className="border-[var(--border)] hover:bg-[var(--secondary)]">
                <TableCell>
                  <div>
                    <p className="text-[var(--foreground)] font-medium">Customer Ready to Schedule Install</p>
                    <p className="text-xs text-[var(--muted-foreground)] font-mono">fiber_ready_plan_comp</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-[#10B981] text-white text-xs">Enabled</Badge>
                    <span className="text-[var(--muted-foreground)] text-sm">fiber_ready_plan_complete</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <Badge className="bg-[var(--muted-foreground)] text-white text-xs mb-1">Disabled</Badge>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked readOnly />
                      <div className="w-11 h-6 bg-[#10B981] rounded-full peer peer-focus:ring-2 peer-focus:ring-[#147FFF] peer-checked:bg-[#10B981]">
                        <div className="w-5 h-5 bg-white rounded-full shadow-md transition-transform translate-x-5" />
                      </div>
                    </label>
                    <Badge className="bg-[#10B981] text-white text-xs">Active</Badge>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-[var(--muted-foreground)] hover:text-[#EF4444]">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>

              {/* Future Service Area Inquiry */}
              <TableRow className="border-[var(--border)] hover:bg-[var(--secondary)]">
                <TableCell>
                  <div>
                    <p className="text-[var(--foreground)] font-medium">Future Service Area Inquiry</p>
                    <p className="text-xs text-[var(--muted-foreground)] font-mono">inquiry_future_service_area</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-[#10B981] text-white text-xs">Enabled</Badge>
                    <span className="text-[var(--muted-foreground)] text-sm">future_service_customer</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <Badge className="bg-[#3B82F6] text-white text-xs mb-1">Enabled</Badge>
                    <p className="text-[var(--muted-foreground)] text-xs">→ help@orangeburgfiber.net</p>
                    <p className="text-[var(--muted-foreground)] text-xs font-mono">future_service_team</p>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked readOnly />
                      <div className="w-11 h-6 bg-[#10B981] rounded-full peer peer-focus:ring-2 peer-focus:ring-[#147FFF] peer-checked:bg-[#10B981]">
                        <div className="w-5 h-5 bg-white rounded-full shadow-md transition-transform translate-x-5" />
                      </div>
                    </label>
                    <Badge className="bg-[#10B981] text-white text-xs">Active</Badge>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-[var(--muted-foreground)] hover:text-[#EF4444]">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>

              {/* Installation Confirmation */}
              <TableRow className="border-[var(--border)] hover:bg-[var(--secondary)]">
                <TableCell>
                  <div>
                    <p className="text-[var(--foreground)] font-medium">Installation Confirmation</p>
                    <p className="text-xs text-[var(--muted-foreground)] font-mono">installation</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-[var(--muted-foreground)] text-white text-xs">Disabled</Badge>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <Badge className="bg-[var(--muted-foreground)] text-white text-xs mb-1">Disabled</Badge>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked readOnly />
                      <div className="w-11 h-6 bg-[#10B981] rounded-full peer peer-focus:ring-2 peer-focus:ring-[#147FFF] peer-checked:bg-[#10B981]">
                        <div className="w-5 h-5 bg-white rounded-full shadow-md transition-transform translate-x-5" />
                      </div>
                    </label>
                    <Badge className="bg-[#10B981] text-white text-xs">Active</Badge>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-[var(--muted-foreground)] hover:text-[#EF4444]">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>

              {/* Signup Inquiry */}
              <TableRow className="border-[var(--border)] hover:bg-[var(--secondary)]">
                <TableCell>
                  <div>
                    <p className="text-[var(--foreground)] font-medium">Signup Inquiry</p>
                    <p className="text-xs text-[var(--muted-foreground)] font-mono">signup_inquiry</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-[#10B981] text-white text-xs">Enabled</Badge>
                    <span className="text-[var(--muted-foreground)] text-sm">signup_callback_customer</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <Badge className="bg-[#3B82F6] text-white text-xs mb-1">Enabled</Badge>
                    <p className="text-[var(--muted-foreground)] text-xs">→ help@orangeburgfiber.net</p>
                    <p className="text-[var(--muted-foreground)] text-xs font-mono">signup_callback_team</p>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked readOnly />
                      <div className="w-11 h-6 bg-[#10B981] rounded-full peer peer-focus:ring-2 peer-focus:ring-[#147FFF] peer-checked:bg-[#10B981]">
                        <div className="w-5 h-5 bg-white rounded-full shadow-md transition-transform translate-x-5" />
                      </div>
                    </label>
                    <Badge className="bg-[#10B981] text-white text-xs">Active</Badge>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-[var(--muted-foreground)] hover:text-[#EF4444]">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
