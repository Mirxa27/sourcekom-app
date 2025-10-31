'use client';

import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { RefreshCw, Save, Key } from 'lucide-react';

interface PaymentSettings {
  apiKey?: string;
  countryCode: string;
  isTest: boolean;
  webhookEnabled: boolean;
  webhookEndpoint: string;
  webhookSecretEnabled: boolean;
  webhookSecretKey: string;
  webhookEvents: string[];
  signingVersion: string;
  numberOfRetries: number;
  delayBetweenRetries: number;
  enabledGateways: string[];
}

const webhookEventOptions = [
  { id: 'TransactionStatusChanged', label: 'Transaction Status Changed' },
  { id: 'RefundStatusChanged', label: 'Refund Status Changed' },
  { id: 'BalanceTransferred', label: 'Balance Transferred' },
  { id: 'SupplierUpdateRequestChanged', label: 'Supplier Update Request Changed' },
  { id: 'RecurringStatusChanged', label: 'Recurring Status Changed' },
  { id: 'DisputeStatusChanged', label: 'Dispute Status Changed' },
  { id: 'SupplierBankDetailsChanged', label: 'Supplier Bank Details Changed' }
];

export default function PaymentSettingsPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [generateKeyLoading, setGenerateKeyLoading] = useState(false);
  const [settings, setSettings] = useState<PaymentSettings>({
    countryCode: 'SAU',
    isTest: false,
    webhookEnabled: true,
    webhookEndpoint: '',
    webhookSecretEnabled: true,
    webhookSecretKey: '',
    webhookEvents: ['TransactionStatusChanged', 'RefundStatusChanged', 'BalanceTransferred', 'SupplierUpdateRequestChanged', 'RecurringStatusChanged', 'DisputeStatusChanged', 'SupplierBankDetailsChanged'],
    signingVersion: 'v2',
    numberOfRetries: 5,
    delayBetweenRetries: 180,
    enabledGateways: []
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/payment-settings', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSettings(prev => ({
          ...prev,
          ...data
        }));
      }
    } catch (error) {
      console.error('Error fetching payment settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to load payment settings',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const generateWebhookKey = () => {
    setGenerateKeyLoading(true);
    // Generate a cryptographically secure random key
    const randomKey = Array.from(crypto.getRandomValues(new Uint8Array(64)))
      .map(byte => byte.toString(16).padStart(2, '0'))
      .join('');
    
    setSettings(prev => ({
      ...prev,
      webhookSecretKey: randomKey
    }));
    setGenerateKeyLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/payment-settings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(settings)
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Payment settings saved successfully'
        });
      } else {
        const error = await response.json();
        toast({
          title: 'Error',
          description: error.error || 'Failed to save settings',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error saving payment settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to save payment settings',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  const toggleWebhookEvent = (eventId: string) => {
    setSettings(prev => ({
      ...prev,
      webhookEvents: prev.webhookEvents.includes(eventId)
        ? prev.webhookEvents.filter(e => e !== eventId)
        : [...prev.webhookEvents, eventId]
    }));
  };

  if (loading) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="flex items-center justify-center">
          <RefreshCw className="w-8 h-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Payment Settings</h1>
          <p className="text-muted-foreground">Configure MyFatoorah payment integration</p>
        </div>

        <div className="space-y-6">
          {/* API Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>API Configuration</CardTitle>
              <CardDescription>MyFatoorah API credentials and settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="apiKey">API Key *</Label>
                <Input
                  id="apiKey"
                  type="password"
                  value={settings.apiKey || ''}
                  onChange={(e) => setSettings(prev => ({ ...prev, apiKey: e.target.value }))}
                  placeholder="Enter your MyFatoorah API key"
                />
                <p className="text-sm text-muted-foreground">
                  Get your API key from MyFatoorah dashboard
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="countryCode">Country Code</Label>
                <Select
                  value={settings.countryCode}
                  onValueChange={(value) => setSettings(prev => ({ ...prev, countryCode: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SAU">Saudi Arabia (SAU)</SelectItem>
                    <SelectItem value="KWT">Kuwait (KWT)</SelectItem>
                    <SelectItem value="ARE">UAE (ARE)</SelectItem>
                    <SelectItem value="QAT">Qatar (QAT)</SelectItem>
                    <SelectItem value="BHR">Bahrain (BHR)</SelectItem>
                    <SelectItem value="OMN">Oman (OMN)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isTest"
                  checked={settings.isTest}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, isTest: !!checked }))}
                />
                <Label htmlFor="isTest" className="cursor-pointer">
                  Test Mode (Use sandbox environment)
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Webhook Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>Webhook Settings</CardTitle>
              <CardDescription>Configure webhook notifications for payment events</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="webhookEnabled"
                  checked={settings.webhookEnabled}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, webhookEnabled: !!checked }))}
                />
                <Label htmlFor="webhookEnabled" className="cursor-pointer">
                  Enable Webhook
                </Label>
              </div>

              {settings.webhookEnabled && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="webhookEndpoint">Endpoint *</Label>
                    <Input
                      id="webhookEndpoint"
                      value={settings.webhookEndpoint}
                      onChange={(e) => setSettings(prev => ({ ...prev, webhookEndpoint: e.target.value }))}
                      placeholder="https://sourcekom.com/?wc-api=myfatoorah_webhook"
                    />
                    <p className="text-sm text-muted-foreground">
                      URL where MyFatoorah will send webhook notifications
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="webhookSecretEnabled"
                      checked={settings.webhookSecretEnabled}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, webhookSecretEnabled: !!checked }))}
                    />
                    <Label htmlFor="webhookSecretEnabled" className="cursor-pointer">
                      Enable Secret Key
                    </Label>
                  </div>

                  {settings.webhookSecretEnabled && (
                    <div className="space-y-2">
                      <Label htmlFor="webhookSecretKey">Webhook Secret Key</Label>
                      <div className="flex space-x-2">
                        <Input
                          id="webhookSecretKey"
                          type="text"
                          value={settings.webhookSecretKey}
                          onChange={(e) => setSettings(prev => ({ ...prev, webhookSecretKey: e.target.value }))}
                          placeholder="Enter or generate a secret key"
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={generateWebhookKey}
                          disabled={generateKeyLoading}
                        >
                          <Key className="w-4 h-4 mr-2" />
                          Generate
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label>Webhook Events</Label>
                    <div className="grid grid-cols-2 gap-4">
                      {webhookEventOptions.map((event) => (
                        <div key={event.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={event.id}
                            checked={settings.webhookEvents.includes(event.id)}
                            onCheckedChange={() => toggleWebhookEvent(event.id)}
                          />
                          <Label htmlFor={event.id} className="cursor-pointer">
                            {event.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signingVersion">Signing Version</Label>
                    <Select
                      value={settings.signingVersion}
                      onValueChange={(value) => setSettings(prev => ({ ...prev, signingVersion: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="v2">v2</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="numberOfRetries">Number of Retries</Label>
                      <Input
                        id="numberOfRetries"
                        type="number"
                        min="0"
                        max="5"
                        value={settings.numberOfRetries}
                        onChange={(e) => setSettings(prev => ({ ...prev, numberOfRetries: parseInt(e.target.value) || 0 }))}
                      />
                      <p className="text-sm text-muted-foreground">Max: 5 retries</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="delayBetweenRetries">Delay between retries (seconds)</Label>
                      <Input
                        id="delayBetweenRetries"
                        type="number"
                        min="0"
                        max="180"
                        value={settings.delayBetweenRetries}
                        onChange={(e) => setSettings(prev => ({ ...prev, delayBetweenRetries: parseInt(e.target.value) || 0 }))}
                      />
                      <p className="text-sm text-muted-foreground">Max: 180 seconds</p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button
              onClick={handleSave}
              disabled={saving || !settings.apiKey}
              size="lg"
            >
              {saving ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Settings
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

