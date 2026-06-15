// src/components/admin/LibrarySettings.jsx
// Admin panel: edit library name, address, seats, pricing, facilities, WhatsApp
import { useState } from 'react';
import { updateLibrarySettings } from '../../firebase/firestore';
import { useLibrary } from '../../contexts/LibraryContext';
import { Save, Plus, Trash2, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LibrarySettings() {
  const { settings } = useLibrary();
  const [form, setForm] = useState({ ...settings });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateLibrarySettings(form);
      toast.success('Settings saved successfully!');
    } catch {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const updateShiftPrice = (id, price) => {
    setForm((f) => ({
      ...f,
      shifts: f.shifts.map((s) => s.id === id ? { ...s, price: Number(price) } : s),
    }));
  };

  const updateShiftTime = (id, time) => {
    setForm((f) => ({
      ...f,
      shifts: f.shifts.map((s) => s.id === id ? { ...s, time } : s),
    }));
  };

  const addFacility = () => {
    const name = prompt('Enter facility name:');
    if (name?.trim()) {
      setForm((f) => ({ ...f, facilities: [...f.facilities, name.trim()] }));
    }
  };

  const removeFacility = (idx) => {
    setForm((f) => ({ ...f, facilities: f.facilities.filter((_, i) => i !== idx) }));
  };

  return (
    <div className="space-y-8">
      {/* General */}
      <div className="bg-white dark:bg-surface-card rounded-2xl border border-gray-200/50 dark:border-surface-border p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-5">General Settings</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Library Name</label>
            <input
              className="input-field"
              value={form.libraryName || ''}
              onChange={(e) => setForm((f) => ({ ...f, libraryName: e.target.value }))}
              placeholder="Library Name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Total Seats per Shift</label>
            <input
              type="number"
              className="input-field"
              value={form.totalSeats || 51}
              min={1}
              max={500}
              onChange={(e) => setForm((f) => ({ ...f, totalSeats: Number(e.target.value) }))}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Address</label>
            <input
              className="input-field"
              value={form.address || ''}
              onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
              placeholder="Full address"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">WhatsApp Number</label>
            <input
              className="input-field"
              value={form.whatsapp || ''}
              onChange={(e) => setForm((f) => ({ ...f, whatsapp: e.target.value }))}
              placeholder="91XXXXXXXXXX"
            />
          </div>
        </div>
      </div>

      {/* Shift Pricing */}
      <div className="bg-white dark:bg-surface-card rounded-2xl border border-gray-200/50 dark:border-surface-border p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-5">Shift Pricing & Timing</h3>
        <div className="space-y-4">
          {form.shifts?.map((shift) => (
            <div key={shift.id} className="grid sm:grid-cols-3 gap-3 p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200/50 dark:border-white/10">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">{shift.label} Shift</label>
                <div className="font-bold capitalize text-gray-800 dark:text-gray-200">{shift.id}</div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Time</label>
                <input
                  className="input-field text-sm"
                  value={shift.time}
                  onChange={(e) => updateShiftTime(shift.id, e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Price (₹)</label>
                <input
                  type="number"
                  className="input-field text-sm"
                  value={shift.price}
                  min={0}
                  onChange={(e) => updateShiftPrice(shift.id, e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Facilities */}
      <div className="bg-white dark:bg-surface-card rounded-2xl border border-gray-200/50 dark:border-surface-border p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Facilities</h3>
          <button onClick={addFacility} className="flex items-center gap-1.5 text-sm text-primary-400 hover:text-primary-300 transition-colors">
            <Plus className="w-4 h-4" /> Add Facility
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {form.facilities?.map((f, i) => (
            <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-sm">
              <span className="text-primary-400">{f}</span>
              <button onClick={() => removeFacility(i)} className="text-red-400 hover:text-red-300 transition-colors">
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Save */}
      <button onClick={handleSave} disabled={saving} className="btn-primary">
        {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : <><Save className="w-4 h-4" /> Save All Settings</>}
      </button>
    </div>
  );
}
