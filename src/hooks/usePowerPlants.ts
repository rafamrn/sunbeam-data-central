
import { useState, useEffect } from 'react';

export interface PowerPlant {
  id: string;
  name: string;
  location: string;
  capacity: number;
  currentPower: number;
  status: 'active' | 'alarm' | 'inactive';
  dailyPerformance: number;
  weeklyPerformance: number;
  monthlyPerformance: number;
  inverters: Inverter[];
  owner: PlantOwner;
  monthlyGeneration: number;
}

export interface Inverter {
  id: string;
  status: 'online' | 'offline' | 'warning';
  temperature: number;
  strings: StringData[];
}

export interface StringData {
  id: string;
  voltage: number;
  current: number;
  power: number;
}

export interface PlantOwner {
  name: string;
  phone: string;
  email: string;
  address: string;
}

export interface Alert {
  id: string;
  plantId: string;
  plantName: string;
  type: 'warning' | 'critical' | 'info';
  message: string;
  timestamp: Date;
  resolved: boolean;
}

export const usePowerPlants = () => {
  const [plants, setPlants] = useState<PowerPlant[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    // Dados simulados
    const mockPlants: PowerPlant[] = [
      {
        id: '1',
        name: 'Usina Solar Norte',
        location: 'Ceará, Brasil',
        capacity: 1500,
        currentPower: 1350,
        status: 'active',
        dailyPerformance: 92,
        weeklyPerformance: 88,
        monthlyPerformance: 85,
        monthlyGeneration: 180000,
        owner: {
          name: 'João Silva',
          phone: '+55 85 99999-9999',
          email: 'joao@email.com',
          address: 'Rua das Flores, 123, Fortaleza - CE'
        },
        inverters: [
          {
            id: 'INV001',
            status: 'online',
            temperature: 45.2,
            strings: [
              { id: 'STR001', voltage: 650, current: 12.5, power: 8125 },
              { id: 'STR002', voltage: 645, current: 12.3, power: 7933 }
            ]
          },
          {
            id: 'INV002',
            status: 'warning',
            temperature: 52.1,
            strings: [
              { id: 'STR003', voltage: 630, current: 11.8, power: 7434 },
              { id: 'STR004', voltage: 642, current: 12.1, power: 7768 }
            ]
          }
        ]
      },
      {
        id: '2',
        name: 'Usina Solar Sul',
        location: 'Rio Grande do Sul, Brasil',
        capacity: 1200,
        currentPower: 480,
        status: 'alarm',
        dailyPerformance: 45,
        weeklyPerformance: 52,
        monthlyPerformance: 48,
        monthlyGeneration: 120000,
        owner: {
          name: 'Maria Santos',
          phone: '+55 51 88888-8888',
          email: 'maria@email.com',
          address: 'Av. Ipiranga, 456, Porto Alegre - RS'
        },
        inverters: [
          {
            id: 'INV003',
            status: 'offline',
            temperature: 0,
            strings: []
          }
        ]
      },
      {
        id: '3',
        name: 'Usina Solar Leste',
        location: 'Minas Gerais, Brasil',
        capacity: 2000,
        currentPower: 0,
        status: 'inactive',
        dailyPerformance: 0,
        weeklyPerformance: 0,
        monthlyPerformance: 0,
        monthlyGeneration: 250000,
        owner: {
          name: 'Carlos Oliveira',
          phone: '+55 31 77777-7777',
          email: 'carlos@email.com',
          address: 'Rua das Minas, 789, Belo Horizonte - MG'
        },
        inverters: []
      }
    ];

    const mockAlerts: Alert[] = [
      {
        id: '1',
        plantId: '2',
        plantName: 'Usina Solar Sul',
        type: 'critical',
        message: 'Inversor INV003 desconectado',
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        resolved: false
      },
      {
        id: '2',
        plantId: '1',
        plantName: 'Usina Solar Norte',
        type: 'warning',
        message: 'Temperatura elevada no inversor INV002',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
        resolved: false
      }
    ];

    setPlants(mockPlants);
    setAlerts(mockAlerts);
  }, []);

  return { plants, alerts };
};
