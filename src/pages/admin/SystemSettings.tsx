import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { toast } from 'sonner';

export default function SystemSettings() {
  const [loanDays, setLoanDays] = useState('14');
  const [maxBooks, setMaxBooks] = useState('5');
  const [emailNotif, setEmailNotif] = useState(true);
  const [overdueAlert, setOverdueAlert] = useState(true);

  const handleSave = () => {
    toast.success('Settings saved successfully.');
  };

  return (
    <div>
      <h1 className="text-2xl font-display font-semibold mb-6">System Settings</h1>
      <div className="space-y-6 max-w-lg">
        <Card>
          <CardHeader><CardTitle className="font-display text-base">Loan Settings</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Default Loan Period (days)</Label>
              <Input type="number" value={loanDays} onChange={e => setLoanDays(e.target.value)} />
            </div>
            <div>
              <Label>Maximum Books Per Student</Label>
              <Input type="number" value={maxBooks} onChange={e => setMaxBooks(e.target.value)} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="font-display text-base">Notifications</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Email Notifications</Label>
              <Switch checked={emailNotif} onCheckedChange={setEmailNotif} />
            </div>
            <div className="flex items-center justify-between">
              <Label>Overdue Alerts</Label>
              <Switch checked={overdueAlert} onCheckedChange={setOverdueAlert} />
            </div>
          </CardContent>
        </Card>

        <Button onClick={handleSave} className="w-full">Save Settings</Button>
      </div>
    </div>
  );
}
