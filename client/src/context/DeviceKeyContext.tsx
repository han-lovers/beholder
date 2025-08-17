import { createContext, useContext, useState, type ReactNode } from 'react';

interface DeviceKeyContextType {
  selectedKey: string | null;
  setSelectedKey: (key: string | null) => void;
}

const DeviceKeyContext = createContext<DeviceKeyContextType | undefined>(undefined);

export function DeviceKeyProvider({ children }: { children: ReactNode }) {
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  return (
    <DeviceKeyContext.Provider value={{ selectedKey, setSelectedKey }}>
      {children}
    </DeviceKeyContext.Provider>
  );
}

export function useDeviceKey() {
  const context = useContext(DeviceKeyContext);
  if (!context) throw new Error('useDeviceKey must be used within a DeviceKeyProvider');
  return context;
}
